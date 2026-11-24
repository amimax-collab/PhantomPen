import { Link } from 'react-router-dom'
import { books } from '../data/books'

export default function ContinueReading() {
  const inProgress = books.filter((b) => localStorage.getItem(`progress-${b.id}`))

  if (inProgress.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Continue reading</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {inProgress.map((book) => (
          <Link
            key={book.id}
            to={`/book/${book.id}/chapter/${localStorage.getItem(`progress-${book.id}`)}`}
            className="w-24 shrink-0"
          >
            <img
              src={`https://placehold.co/300x400/e5436f/ffffff?text=${encodeURIComponent(book.title)}`}
              alt={book.title}
              className="aspect-[3/4] w-full rounded-lg object-cover"
            />
            <p className="mt-1 line-clamp-2 text-xs font-semibold">{book.title}</p>
            <p className="text-xs text-brand">
              Chapter {localStorage.getItem(`progress-${book.id}`)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}