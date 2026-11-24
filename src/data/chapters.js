const body = [
  'The night air was cold against her skin as she stepped out of the car, the city lights blurring behind her.',
  'She had promised herself she would not look back, but his voice still echoed in her mind, steady and low.',
  '"You should not have come here," he said, and for a moment neither of them moved.',
  'Somewhere in the distance, a clock struck midnight, and everything she thought she knew began to change.',
]

export const chapters = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Chapter ${i + 1}`,
  locked: i >= 5, // chapters 6+ will need coins later
  body,
}))