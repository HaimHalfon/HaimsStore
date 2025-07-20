function formatDateShort(isoString) {
	const date = new Date(isoString);

	const pad = (n) => n.toString().padStart(2, "0");

	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1); // חודשים ב-JS מתחילים מ-0
	const year = date.getFullYear().toString().slice(-2);
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export { formatDateShort };
