import { useParams, Link } from 'react-router-dom'
import { Lock, Bookmark } from 'lucide-react'
import { books } from '../../data/books'
import { chapters } from '../../data/chapters'
import useLibrary from '../../hooks/useLibrary'

export default function BookPage() {
  const { bookId } = useParams()
  const book = books.find((b) => b.id === Number(bookId))
  const { isSaved, toggle } = useLibrary()

  if (!book) return <p>Book not found.</p>

  const lastRead = localStorage.getItem(`progress-${bookId}`)
  const startAt = lastRead || 1
  const saved = isSaved(book.id)

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <img
          src={`https://placehold.co/300x400/e5436f/ffffff?text=${encodeURIComponent(book.title)}`}
          alt={book.title}
          className="w-32 rounded-lg object-cover md:w-48"
        />
        <div className="space-y-2">
          <h1 className="text-xl font-bold md:text-3xl">{book.title}</h1>
          <p className="text-gray-600">by {book.author}</p>
          <p className="text-sm text-tan">{book.genre} · {book.views} views</p>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/book/${book.id}/chapter/${startAt}`}
              className="inline-block rounded-full bg-brand px-6 py-2 font-semibold text-white"
            >
              {lastRead ? `Continue chapter ${lastRead}` : 'Start reading'}
            </Link>

            <button
              onClick={() => toggle(book.id)}
              className={`flex items-center gap-1 rounded-full border px-4 py-2 font-semibold ${
                saved ? 'border-brand bg-brand/10 text-brand' : 'border-gray-300 text-ink'
              }`}
            >
              <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'In library' : 'Add to library'}
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-bold">Chapters</h2>
        <ul className="divide-y">
          {chapters.map((c) => (
            <li key={c.id}>
              <Link
                to={`/book/${book.id}/chapter/${c.id}`}
                className="flex items-center justify-between py-3"
              >
                <span>{c.title}</span>
                {c.locked && <Lock size={16} className="text-gray-400" />}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}