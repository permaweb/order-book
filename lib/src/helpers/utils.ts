import { STORAGE } from './config';
import { DateType } from './types';

export function getHashUrl(url: string) {
	return `${url}/#`;
}

export function formatArtifactType(artifactType: string) {
	return artifactType.includes('Alex') ? artifactType.substring(5) : artifactType;
}

export function formatAddress(address: string | null, wrap: boolean) {
	if (!address) {
		return '';
	}
	const formattedAddress = address.substring(0, 5) + '...' + address.substring(36, address.length - 1);
	return wrap ? `(${formattedAddress})` : formattedAddress;
}

export function formatDataSize(size: string) {
	return `${size} KB`;
}

export function formatCount(count: string): string {
	return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatFloat(number: number, value: number) {
	let string = number.toString();
	string = string.slice(0, string.indexOf('.') + value + 1);
	return Number(string);
}

export function formatMetric(count: string): string {
	if (Number(count) > 1000) {
		const localeString = Number(count).toLocaleString();
		const parsedString = localeString.substring(0, localeString.indexOf(','));
		const unit = count.toString().length >= 7 ? 'm' : 'k';
		return `${parsedString}${unit}`;
	} else {
		return count;
	}
}

function formatTime(time: number): string {
	return time < 10 ? `0${time.toString()}` : time.toString();
}

function getHours(hours: number) {
	if (hours > 12) return hours - 12;
	else return hours;
}

function getHourFormat(hours: number) {
	if (hours >= 12 && hours <= 23) {
		return `PM`;
	} else {
		return `AM`;
	}
}

export function formatDate(dateArg: string | number | null, dateType: DateType) {
	if (!dateArg) {
		return STORAGE.none;
	}

	let date: Date | null = null;

	switch (dateType) {
		case 'iso':
			date = new Date(dateArg);
			break;
		case 'epoch':
			date = new Date(Number(dateArg));
			break;
		default:
			date = new Date(dateArg);
			break;
	}

	return `${date.toLocaleString('default', {
		month: 'long',
	})} ${date.getDate()}, ${date.getUTCFullYear()} @ ${getHours(date.getHours())}:${formatTime(
		date.getMinutes()
	)}:${formatTime(date.getSeconds())} ${getHourFormat(date.getHours())}`;
}

export function formatTitle(string: string) {
	const result = string.replace(/([A-Z])/g, ' $1');
	const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
	return finalResult;
}

export function getTagValue(list: { [key: string]: any }[], name: string): string {
	for (let i = 0; i < list.length; i++) {
		if (list[i]) {
			if (list[i]!.name === name) {
				return list[i]!.value as string;
			}
		}
	}
	return STORAGE.none;
}

export function getJSONStorage(key: string) {
	return JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem(key))));
}

export function checkNullValues(obj: any) {
	for (const key in obj) {
		if (obj[key] === null) {
			return true;
		}
	}
	return false;
}

export function unquoteJsonKeys(json: Object): string {
	return JSON.stringify(json).replace(/"([^"]+)":/g, '$1:');
}

export function splitArray(array: any[], size: number) {
	const splitResult = [];
	const arrayCopy = [...array];
	for (let i = 0; i < arrayCopy.length; i += size) {
		const chunk = arrayCopy.slice(i, i + size);
		splitResult.push(chunk);
	}
	return splitResult;
}

export function checkGqlCursor(string: string): boolean {
	/* All Search Cursors contain '-'
		GQL Cursors contain letters, numbers or '=' */
	if (/[-]/.test(string)) {
		return false;
	} else if (/[A-Za-z0-9]/.test(string) || /[=]/.test(string)) {
		return true;
	} else {
		return true;
	}
}

export function formatKeywordString(text: string, char: string) {
	/* Find words containing char
		Return html string with char strings formatted in HTML tag and strip URLs */
	let finalStr = '';
	let count = 0;
	for (let i = 0; i < text.length; i++) {
		if (text[i] === ' ') {
			if (text.substring(count, i).includes(char)) {
				finalStr += `<span>${text.substring(count, i)}</span>`;
			} else {
				finalStr += text.substring(count, i);
			}
			count = i;
		}
	}
	if (count < text.length) {
		finalStr += text.substring(count, text.length);
	}
	return finalStr.replace(/(https?:\/\/[^\s]+)/g, '');
}

export function logJsonUpdate(poolTitle: string, key: string, value: string): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - Updating ${poolTitle} JSON Object - ${key} - [`, `'${value}'`, `]`);
}

export function log(message: any, status: 0 | 1 | null): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - ${message} - log status ${status}`);
}

export function logValue(message: any, value: any, status: 0 | 1 | null): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - ${message} - ['${value}'] - log status ${status}`);
}
