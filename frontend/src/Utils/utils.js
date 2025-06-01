export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function format(date, formatStr) {
  if (!date) return ""

  const d = new Date(date)

  if (formatStr === "PPP") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (formatStr === "MMMM d, yyyy") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return d.toLocaleDateString()
}
