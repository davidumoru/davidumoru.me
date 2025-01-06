export function displayDate(date: Date) {
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'medium',
        timeStyle: 'short',
		timeZone: 'Africa/Lagos',
	}).format(date)
}