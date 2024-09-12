export const calculateTotalAmount = (arr = []) => {
	if (!Array.isArray(arr)) {
		return '0.00'
	}
	const sum = arr.reduce((acc, curr) => {
		if (curr && typeof curr.amount === 'number') {
			return acc + curr.amount
		} else {
			return acc
		}
	}, 0)
	return sum.toFixed(2)
}

export const writeOutDate = (ISOdate) => {
	let writtenDate
	let today = new Date()
	let yearToday = today.getFullYear()

	if (+ISOdate.slice(0, 4) === yearToday) {
		writtenDate = new Date(ISOdate).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		})
	} else {
		writtenDate = new Date(ISOdate).toLocaleDateString('en-US', {
			year: 'numeric',
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		})
	}
	return `${writtenDate.slice(0, 2)}, ${writtenDate.slice(4)}`
}
