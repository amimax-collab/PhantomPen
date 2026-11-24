import pg from 'pg'

const { Pool } = pg
export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('reader', 'author', 'admin')) DEFAULT 'reader',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS books (
      id BIGSERIAL PRIMARY KEY,
      author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      genre TEXT NOT NULL DEFAULT '',
      tags TEXT[] NOT NULL DEFAULT '{}',
      cover_url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('draft','pending','approved','rejected')) DEFAULT 'draft',
      admin_note TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS books_status_idx ON books(status);
    CREATE INDEX IF NOT EXISTS books_author_idx ON books(author_id);
    CREATE TABLE IF NOT EXISTS chapters (
      id BIGSERIAL PRIMARY KEY,
      book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      number INTEGER NOT NULL CHECK (number > 0),
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      is_locked BOOLEAN NOT NULL DEFAULT false,
      status TEXT NOT NULL CHECK (status IN ('draft','pending','approved','rejected')) DEFAULT 'draft',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT chapters_book_number_unique UNIQUE (book_id, number)
    );
    CREATE INDEX IF NOT EXISTS chapters_book_idx ON chapters(book_id);
    CREATE INDEX IF NOT EXISTS chapters_status_idx ON chapters(status);
    CREATE TABLE IF NOT EXISTS library (
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, book_id)
    );
    CREATE INDEX IF NOT EXISTS library_book_idx ON library(book_id);
    CREATE TABLE IF NOT EXISTS reading_progress (
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      last_chapter BIGINT REFERENCES chapters(id) ON DELETE SET NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, book_id)
    );
    CREATE INDEX IF NOT EXISTS reading_progress_book_idx ON reading_progress(book_id);
  `)
}
