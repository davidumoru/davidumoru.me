export function displayDate(date: Date) {
	const day = date.getDate();
	const suffix = getOrdinalSuffix(day);
	
	const formatter = new Intl.DateTimeFormat('en-GB', {
		month: 'long',
		year: 'numeric',
		timeZone: 'Africa/Lagos',
	});
	
	const parts = formatter.formatToParts(date);
	const month = parts.find(p => p.type === 'month')?.value;
	const year = parts.find(p => p.type === 'year')?.value;
	
	return `${day}${suffix} ${month}, ${year}`;
}

function getOrdinalSuffix(day: number): string {
	if (day > 3 && day < 21) return 'th';
	switch (day % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
}
