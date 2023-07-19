import Stamps from '@permaweb/stampjs';

import { CollectionType } from 'permaweb-orderbook';

import { STORAGE } from './config';
import { DateType } from './types';

export function formatAddress(address: string | null, wrap: boolean) {
	if (!address) {
		return '';
	}
	const formattedAddress = address.substring(0, 5) + '...' + address.substring(36, address.length - 1);
	return wrap ? `(${formattedAddress})` : formattedAddress;
}

export function convertCamelCase(str: string) {
	const s = str.replace(/([A-Z])/g, ' $1');
	return s.replace(/^./, (firstChar) => firstChar.toUpperCase()).trim();
}

export function formatCount(count: string): string {
	return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
	})} ${date.getDate()}, ${date.getUTCFullYear()} · ${getHours(date.getHours())}:${formatTime(
		date.getMinutes()
	)}:${formatTime(date.getSeconds())} ${getHourFormat(date.getHours())}`;
}

export function formatFloat(number: number, value: number) {
	let string = number.toString();
	string = string.slice(0, string.indexOf('.') + value + 1);
	return Number(string);
}

export function formatPrice(price: number) {
	let updatedPrice = price / 1e6;
	if (updatedPrice >= 0.0001) {
		if (updatedPrice.toFixed(4).split('.')[1].length > 4) {
			return updatedPrice.toExponential(2).replace(/\.?0+e/, 'e');
		} else {
			return updatedPrice.toFixed(4);
		}
	} else {
		return updatedPrice.toExponential(2).replace(/\.?0+e/, 'e');
	}
}

export function formatDisplayString(input: string): string {
	return input
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export async function collectionsRank(collectionsFetch: CollectionType[], warp: any, arweave: any) {
	let stamps = Stamps.init({
		warp: warp,
		arweave: arweave,
	});
	const collectionIds: string[] = collectionsFetch.map((a: CollectionType) => a.id);
	const counts = await stamps.counts(collectionIds);

	// Add stamp counts to assets
	let collections = collectionsFetch.map((collection: CollectionType) => {
		return { ...collection, stamps: counts[collection.id] };
	});

	// Rank by stamps
	collections.sort((a: CollectionType, b: CollectionType) => {
		const totalA = counts[a.id]?.total || 0;
		const totalB = counts[b.id]?.total || 0;

		if (totalB !== totalA) {
			return totalB - totalA;
		}

		// If 'total' is the same, sort by 'id' in descending order.
		return b.id.localeCompare(a.id);
	});

	return collections;
}
