export function displayDate(date: Date) {
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'full',
        timeStyle: 'long',
		timeZone: 'Africa/Lagos',
	}).format(date)
}