import { useState } from 'react'
import { books } from '../../data/books'
import BookCard from '../../components/BookCard'
import ContinueReading from '../../components/ContinueReading'

const genres = ['All', 'Werewolf', 'Romance', 'Mafia', 'Billionaire']

export default function Home() {
  const [genre, setGenre] = useState('All')

  const shown = genre === 'All' ? books : books.filter((b) => b.genre === genre)

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
              genre === g ? 'bg-brand text-white' : 'bg-white text-ink shadow-sm'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <ContinueReading />

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">Top ranked</h2>
        <ol className="space-y-3">
          {books.slice(0, 4).map((book, i) => (
            <li key={book.id} className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-xs text-gray-500">{book.genre} · {book.views} views</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">New arrivals</h2>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6">
          {shown.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}