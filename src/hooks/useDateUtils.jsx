export const useDateUtils = () => {
	const convertToISO = (date) => date.toISOString().slice(0, 10)

	const today = new Date()

	const dayToday = today.getDay()
	const monthToday = today.getMonth()
	const yearToday = today.getFullYear()
	const dateTodayISO = convertToISO(today)
	const lastDayFromToday = new Date(today.setDate(today.getDate() + (((-dayToday - 2) % 7) + 6)))
	const lastDayFromTodayISO = convertToISO(lastDayFromToday)

	return {
		convertToISO,
		dayToday,
		monthToday,
		yearToday,
		dateTodayISO,
		lastDayFromToday,
		lastDayFromTodayISO,
	}
}
