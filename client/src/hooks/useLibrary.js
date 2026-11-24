import { useState, useEffect } from 'react'

export default function useLibrary() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('library')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('library', JSON.stringify(saved))
  }, [saved])

  const isSaved = (id) => saved.includes(id)

  const toggle = (id) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return { saved, isSaved, toggle }
}