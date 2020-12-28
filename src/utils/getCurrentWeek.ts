import { startOfWeek, add } from 'date-fns'

function getCurrentWeek (): Date[] {
  const start = startOfWeek(new Date())
  const week: Date[] = []

  for (let i = 0; i <= 6; i++) {
    week.push(add(start, { days: i }))
  }

  return week
}

export default getCurrentWeek
