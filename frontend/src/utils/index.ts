export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
};

export const getDuration = (duration: { hour: string; day: string; minute: string }) => {
  let result = "";
  if (duration.day != "0") {
    result += `${duration.day}d`;
  }

  if (duration.hour != "0") {
    result += `${duration.hour}h`;
  }

  if (duration.minute != "0") {
    result += `${duration.minute}m`;
  }

  return result;
};

export const formatDuration = (duration: string) => {
  let res = "";
  for (let i = 0; i < duration.length; i++) {
    if (duration[i] === "d") {
      res += " Days ";
    } else if (duration[i] === "h") {
      res += " Hours ";
    } else if (duration[i] === "m") {
      res += " Minutes ";
    } else {
      res += duration.charAt(i);
    }
  }
  return res;
};
