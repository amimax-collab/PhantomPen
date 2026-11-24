import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Lock } from 'lucide-react'
import { books } from '../../data/books'
import { chapters } from '../../data/chapters'

const themes = {
  light: 'bg-white text-gray-900',
  sepia: 'bg-amber-50 text-stone-800',
  dark: 'bg-neutral-900 text-neutral-200',
}

export default function ChapterReader() {
  const { bookId, chapterId } = useParams()
  const book = books.find((b) => b.id === Number(bookId))
  const chapter = chapters.find((c) => c.id === Number(chapterId))

  const [theme, setTheme] = useState(() => localStorage.getItem('reader-theme') || 'light')
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('reader-font')) || 18)

  useEffect(() => {
    localStorage.setItem('reader-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('reader-font', fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem(`progress-${bookId}`, chapterId)
    window.scrollTo(0, 0)
  }, [bookId, chapterId])

  if (!book || !chapter) return <p className="p-6">Chapter not found.</p>

  const prev = chapters.find((c) => c.id === chapter.id - 1)
  const next = chapters.find((c) => c.id === chapter.id + 1)

  return (
    <div className={`min-h-screen ${themes[theme]}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-inherit px-4 py-3">
        <Link to={`/book/${book.id}`} className="flex items-center gap-1 text-sm">
          <ArrowLeft size={18} /> {book.title}
        </Link>

        <div className="flex items-center gap-3">
          <button onClick={() => setFontSize((s) => Math.max(14, s - 2))}><Minus size={18} /></button>
          <span className="text-sm">{fontSize}</span>
          <button onClick={() => setFontSize((s) => Math.min(30, s + 2))}><Plus size={18} /></button>

          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-full border px-2 py-0.5 text-xs capitalize ${
                theme === t ? 'border-brand text-brand' : 'border-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="mb-6 text-2xl font-bold">{chapter.title}</h1>

        {chapter.locked ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Lock size={32} />
            <p className="font-semibold">This chapter is locked</p>
            <p className="text-sm opacity-70">Unlocking with coins comes in the next phase.</p>
          </div>
        ) : (
          <div style={{ fontSize: `${fontSize}px` }} className="space-y-5 leading-relaxed">
            {chapter.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-between">
          {prev ? (
            <Link to={`/book/${book.id}/chapter/${prev.id}`} className="rounded-full border px-4 py-2 text-sm">
              Previous
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/book/${book.id}/chapter/${next.id}`} className="rounded-full bg-brand px-4 py-2 text-sm text-white">
              Next
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}