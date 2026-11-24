import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReaderLayout from './layouts/ReaderLayout'
import Home from './pages/reader/Home'
import BookPage from './pages/reader/BookPage'
import ChapterReader from './pages/reader/ChapterReader'
import Library from './pages/reader/Library'

const ComingSoon = ({ name }) => (
  <p className="py-20 text-center text-gray-500">{name} is coming soon.</p>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ReaderLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book/:bookId" element={<BookPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/rank" element={<ComingSoon name="Rankings" />} />
          <Route path="/profile" element={<ComingSoon name="Profile" />} />
        </Route>
        <Route path="/book/:bookId/chapter/:chapterId" element={<ChapterReader />} />
      </Routes>
    </BrowserRouter>
  )
}