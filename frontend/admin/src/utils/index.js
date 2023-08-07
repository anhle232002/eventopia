export const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  })
}

export const getDuration = (duration) => {
  let result = ''
  if (duration.day !== '0') {
    result += `${duration.day}d`
  }

  if (duration.hour !== '0') {
    result += `${duration.hour}h`
  }

  if (duration.minute !== '0') {
    result += `${duration.minute}m`
  }

  return result
}
export function parseTime(input) {
  const regex = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?/
  const match = input.match(regex)

  if (!match) {
    throw new Error("Invalid input format. Please provide input in the format 'xdyhzm'.")
  }

  const [, days, hours, minutes] = match
  const parsedTime = {
    day: parseInt(days) || 0,
    hour: parseInt(hours) || 0,
    minute: parseInt(minutes) || 0,
  }

  return parsedTime
}

export const formatDuration = (duration) => {
  let res = ''
  for (let i = 0; i < duration.length; i++) {
    if (duration[i] === 'd') {
      res += ' Days '
    } else if (duration[i] === 'h') {
      res += ' Hours '
    } else if (duration[i] === 'm') {
      res += ' Minutes '
    } else {
      res += duration.charAt(i)
    }
  }
  return res
}
