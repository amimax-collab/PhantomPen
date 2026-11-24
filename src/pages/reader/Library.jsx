import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { books } from '../../data/books'
import { chapters } from '../../data/chapters'
import useLibrary from '../../hooks/useLibrary'

export default function Library() {
  const { saved, toggle } = useLibrary()
  const myBooks = books.filter((b) => saved.includes(b.id))

  if (myBooks.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-3 text-lg font-semibold">Your library is empty</p>
        <Link to="/" className="rounded-full bg-brand px-5 py-2 text-white">
          Discover books
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">My library</h1>

      {myBooks.map((book) => {
        const progress = Number(localStorage.getItem(`progress-${book.id}`)) || 0
        const percent = Math.round((progress / chapters.length) * 100)

        return (
          <div key={book.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <Link to={`/book/${book.id}`}>
              <img
                src={`https://placehold.co/300x400/e5436f/ffffff?text=${encodeURIComponent(book.title)}`}
                alt={book.title}
                className="w-20 rounded-lg object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link to={`/book/${book.id}`} className="line-clamp-2 font-semibold">
                  {book.title}
                </Link>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>

              <div>
                <div className="h-1.5 rounded-full bg-gray-200">
                  <div className="h-1.5 rounded-full bg-brand" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {progress ? `Chapter ${progress} of ${chapters.length}` : 'Not started'}
                  </span>
                  <Link
                    to={`/book/${book.id}/chapter/${progress || 1}`}
                    className="font-semibold text-brand"
                  >
                    {progress ? 'Continue' : 'Start'}
                  </Link>
                </div>
              </div>
            </div>

            <button onClick={() => toggle(book.id)} aria-label="Remove from library">
              <Trash2 size={18} className="text-gray-400" />
            </button>
          </div>
        )
      })}
    </div>
  )
}