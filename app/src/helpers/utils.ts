import Stamps from '@permaweb/stampjs';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { AssetDetailType, AssetType, CollectionType, CommentType } from 'permaweb-orderbook';

import { AR_PROFILE, STORAGE } from './config';
import { language } from './language';
import { DateType, OwnerListingType, OwnerType } from './types';

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

export async function rankData(
	dataFetch: CollectionType[] | AssetType[] | CommentType[] | string[],
	warp: any,
	arweave: any,
	wallet: any
) {
	const stamps = Stamps.init({
		warp: warp,
		arweave: arweave,
		wallet: new InjectedArweaveSigner(wallet),
	});

	const dataIds: string[] = dataFetch.map((a: any) => getDataId(a));
	const counts = await stamps.counts(dataIds);

	// Add stamp counts to data
	const updatedData = dataFetch.map((dataElement: any) => {
		return typeof dataElement === 'string' ? dataElement : { ...dataElement, stamps: counts[getDataId(dataElement)] };
	});

	// Rank by stamps
	updatedData.sort((a: any, b: any) => {
		const totalA = counts[getDataId(a)]?.total || 0;
		const totalB = counts[getDataId(b)]?.total || 0;

		if (totalB !== totalA) {
			return totalB - totalA;
		}

		// If 'total' is the same, sort by 'id' in descending order.
		return getDataId(b).localeCompare(getDataId(a));
	});

	return updatedData;
}

function getDataId(dataElement: any) {
	if (typeof dataElement === 'string') return dataElement;
	else {
		if (dataElement.data) return dataElement.data.id;
		else return dataElement.id;
	}
}

export async function getOwners(
	addressObject: any,
	orProvider: any,
	asset: AssetDetailType | null
): Promise<OwnerType[] | OwnerListingType[]> {
	if (asset && asset.state) {
		const balances = Object.keys(asset.state.balances).map((balance: any) => {
			return asset.state.balances[balance];
		});
		const totalBalance = balances.reduce((a: number, b: number) => a + b, 0);

		if (Array.isArray(addressObject)) {
			const owners: OwnerListingType[] = [];

			for (let i = 0; i < addressObject.length; i++) {
				if (addressObject[i].creator) {
					const profile = await orProvider.orderBook.api.getProfile({ walletAddress: addressObject[i].creator });
					let handle = profile ? profile.handle : null;

					let avatar = profile ? profile.avatar : null;
					if (avatar === AR_PROFILE.defaultAvatar) avatar = null;
					if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

					handle =
						!handle && addressObject[i].creator === orProvider.orderBook.env.orderBookContract
							? language.orderBook
							: handle;
					owners.push({
						address: addressObject[i].creator,
						handle: handle,
						avatar: avatar,
						sellQuantity: addressObject[i].quantity,
						sellPercentage: addressObject[i].quantity / totalBalance,
						sellUnitPrice: addressObject[i].price,
					});
				}
			}

			return owners;
		} else {
			let owners: OwnerType[] = await Promise.all(
				Object.keys(addressObject).map(async (address: string) => {
					const profile = await orProvider.orderBook.api.getProfile({ walletAddress: address });
					const ownerPercentage = addressObject[address] / totalBalance;
					let handle = profile ? profile.handle : null;

					let avatar = profile ? profile.avatar : null;
					if (avatar === AR_PROFILE.defaultAvatar) avatar = null;
					if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

					handle = !handle && address === orProvider.orderBook.env.orderBookContract ? language.orderBook : handle;
					return {
						address: address,
						handle: handle,
						avatar: avatar,
						balance: addressObject[address],
						ownerPercentage: ownerPercentage,
					};
				})
			);

			owners = owners.filter((owner: OwnerType) => owner.balance > 0);

			return owners;
		}
	}
	return [];
}
