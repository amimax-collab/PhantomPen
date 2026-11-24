import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool, migrate } from './db.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const secret = process.env.JWT_SECRET
const cookieName = 'phantompen_session'
const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be set to at least 32 characters')

app.use((req, res, next) => {
  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  if (req.headers.origin === origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
app.use(express.json({ limit: '1mb' }))

function tokenFor(user) {
  return jwt.sign({ sub: String(user.id), role: user.role }, secret, { expiresIn: '7d' })
}
function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role }
}
function requireUser(req, res, next) {
  try {
    const token = req.headers.cookie?.split('; ').find((part) => part.startsWith(`${cookieName}=`))?.split('=').slice(1).join('=')
    if (!token) return res.status(401).json({ error: 'Not signed in' })
    req.auth = jwt.verify(decodeURIComponent(token), secret)
    next()
  } catch {
    res.status(401).json({ error: 'Session expired' })
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || String(password || '').length < 8 || !['reader', 'author'].includes(role)) {
      return res.status(400).json({ error: 'Enter a name, valid email, password of at least 8 characters, and reader or author role.' })
    }
    const hash = await bcrypt.hash(password, 12)
    const { rows: [user] } = await pool.query(
      'INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role',
      [name.trim(), normalizedEmail, hash, role],
    )
    res.cookie(cookieName, tokenFor(user), cookieOptions).status(201).json({ user: publicUser(user) })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with that email already exists.' })
    next(error)
  }
})
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase()
    const { rows: [user] } = await pool.query('SELECT id,name,email,role,password_hash FROM users WHERE email=$1', [email])
    if (!user || !await bcrypt.compare(String(req.body?.password || ''), user.password_hash)) return res.status(401).json({ error: 'Email or password is incorrect.' })
    res.cookie(cookieName, tokenFor(user), cookieOptions).json({ user: publicUser(user) })
  } catch (error) { next(error) }
})
app.get('/api/auth/me', requireUser, async (req, res, next) => {
  try {
    const { rows: [user] } = await pool.query('SELECT id,name,email,role FROM users WHERE id=$1', [req.auth.sub])
    if (!user) return res.status(401).json({ error: 'Account not found' })
    res.json({ user: publicUser(user) })
  } catch (error) { next(error) }
})
app.post('/api/auth/logout', (_req, res) => res.clearCookie(cookieName, { ...cookieOptions, maxAge: undefined }).json({ ok: true }))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong.' })
})

await migrate()
app.listen(port, () => console.log(`PhantomPen API listening on ${port}`))
process.on('SIGTERM', async () => { await pool.end(); process.exit(0) })
