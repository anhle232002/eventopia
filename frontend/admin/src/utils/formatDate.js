const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}
export const formatDate = (date) => {
  const readableDate = new Date(date).toLocaleString(undefined, options)
  return readableDate
}
