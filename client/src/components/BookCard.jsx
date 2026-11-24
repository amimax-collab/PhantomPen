import { Link } from 'react-router-dom'

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="flex flex-col gap-1">
      <img
        src={`https://placehold.co/300x400/e5436f/ffffff?text=${encodeURIComponent(book.title)}`}
        alt={book.title}
        className="aspect-[3/4] w-full rounded-lg object-cover"
      />
      <h3 className="line-clamp-2 text-sm font-semibold text-ink">{book.title}</h3>
      <p className="text-xs text-gray-500">{book.author}</p>
      <span className="text-xs font-medium text-tan">{book.genre}</span>
    </Link>
  )
}