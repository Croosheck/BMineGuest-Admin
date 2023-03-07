export function filteredKeys(e, type = "numbersOnly") {
	if (!/[0-9]/.test(e.key) && type === "numbersOnly") {
		e.preventDefault();
	}
	if (!/[a-zA-Z]/.test(e.key) && type === "lettersOnly") {
		e.preventDefault();
	}
	if (!/[a-zA-Z\s]/.test(e.key) && type === "lettersAndSpaces") {
		e.preventDefault();
	}
}
