"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../Utils/utils"
import { Button } from "./button"

const Calendar = React.forwardRef(({ className, selected, onSelect, disabled, ...props }, ref) => {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const selectDate = (day) => {
    const selectedDate = new Date(year, month, day)
    if (disabled && disabled(selectedDate)) return
    onSelect?.(selectedDate)
  }

  const isSelected = (day) => {
    if (!selected) return false
    const date = new Date(year, month, day)
    return selected.toDateString() === date.toDateString()
  }

  const isDisabled = (day) => {
    if (!disabled) return false
    const date = new Date(year, month, day)
    return disabled(date)
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedDay = isSelected(day)
      const isDisabledDay = isDisabled(day)

      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          disabled={isDisabledDay}
          className={cn(
            "p-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
            isSelectedDay && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            !isSelectedDay && !isDisabledDay && "hover:bg-slate-700",
            className,
          )}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div ref={ref} className={cn("p-3 bg-slate-800 text-white", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth} className="h-8 w-8 text-white hover:bg-slate-700">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold text-white">
          {monthNames[month]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-white hover:bg-slate-700">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-xs text-center text-slate-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  )
})
Calendar.displayName = "Calendar"

export { Calendar }
