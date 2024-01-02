import Stamps from '@permaweb/stampjs';
import Arweave from 'arweave';
import { always, compose, cond, equals, identity, join, split, T, takeLast } from 'ramda';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { AssetDetailType, AssetType, CollectionType, CommentType } from 'permaweb-orderbook';

import { getProfiles } from 'gql';

import { API_CONFIG, AR_PROFILE, ASSETS, STORAGE } from './config';
import { language } from './language';
import { DateType, OwnerListingType, OwnerType } from './types';

LoggerFactory.INST.logLevel('fatal');

export function getHost() {
	return compose(
		cond([
			[equals('gitpod.io'), always('arweave.net')],
			[equals('arweave.dev'), always('arweave.net')],
			[equals('localhost'), always('arweave.net')],
			[T, identity],
		]),
		join('.'),
		takeLast(2),
		split('.')
	)(window.location.hostname);
}

export function formatAddress(address: string | null, wrap: boolean) {
	if (!address) {
		return '';
	}
	const formattedAddress = address.substring(0, 5) + '...' + address.substring(36);
	return wrap ? `(${formattedAddress})` : formattedAddress;
}

export function convertCamelCase(str: string) {
	const s = str.replace(/([A-Z])/g, ' $1');
	return s.replace(/^./, (firstChar) => firstChar.toUpperCase()).trim();
}

export function formatCount(count: string): string {
	if (count.includes('.')) {
		let parts = count.split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.join('.');
	} else {
		return count.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
	})} ${date.getDate()}, ${date.getUTCFullYear()}`;
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
			if (Number.isInteger(updatedPrice)) {
				return updatedPrice;
			} else {
				const decimalPlaces = (updatedPrice.toString().split('.')[1] || []).length;
				return updatedPrice.toFixed(decimalPlaces);
			}
		}
	} else {
		return updatedPrice.toExponential(2).replace(/\.?0+e/, 'e');
	}
}

export function formatDisplayString(input: string): string {
	let formattedString = input
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	formattedString = formattedString.replace(/([A-Z][a-z]*)([A-Z][a-z]*)/g, '$1 $2');

	return formattedString;
}

export async function getStampData(
	dataFetch: CollectionType[] | AssetType[] | CommentType[] | string[],
	wallet: any,
	useRank: boolean,
	_dre: string
) {
	const arweave = Arweave.init({
		host: API_CONFIG.arweavePost,
		port: API_CONFIG.port,
		protocol: API_CONFIG.protocol,
		timeout: API_CONFIG.timeout,
		logging: API_CONFIG.logging,
	});

	const warp = WarpFactory.forMainnet({
		...defaultCacheOptions,
		inMemory: true,
	}).use(new DeployPlugin());

	const stamps = Stamps.init({
		warp: warp,
		arweave: arweave,
		wallet: new InjectedArweaveSigner(wallet),
		graphql: `${API_CONFIG.protocol}://${API_CONFIG.arweavePost}/graphql`,
	});

	const dataIds: string[] = dataFetch.map((a: any) => getDataId(a));
	const counts = await stamps.counts(dataIds);

	// Add stamp counts to data
	const updatedData = dataFetch.map((dataElement: any) => {
		return typeof dataElement === 'string' ? dataElement : { ...dataElement, stamps: counts[getDataId(dataElement)] };
	});

	if (useRank) {
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
	}

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
			const profiles = await getProfiles({
				addresses: addressObject.map((owner: any) => owner.creator),
			});
			const owners: OwnerListingType[] = [];

			if (profiles.length === addressObject.length) {
				for (let i = 0; i < profiles.length; i++) {
					let avatar = profiles[i].avatar;
					if (avatar === AR_PROFILE.defaultAvatar) avatar = null;
					if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

					let handle = profiles[i].handle;
					handle =
						!handle && profiles[i].walletAddress === orProvider.orderBook.env.orderBookContract
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
			const profiles = await getProfiles({ addresses: Object.keys(addressObject) });
			let owners: OwnerType[] = [];
			for (let i = 0; i < profiles.length; i++) {
				let avatar = profiles[i].avatar;
				if (avatar === AR_PROFILE.defaultAvatar) avatar = null;
				if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

				owners.push({
					address: profiles[i].walletAddress,
					handle: profiles[i].handle,
					avatar: profiles[i].avatar,
					balance: addressObject[profiles[i].walletAddress],
					ownerPercentage: addressObject[profiles[i].walletAddress] / totalBalance,
				});
			}

			owners = owners.filter((owner: OwnerType) => owner.balance > 0);

			return owners;
		}
	}
	return [];
}

export function checkEqualBalances(arr1: number[], arr2: number[]) {
	if (arr1.length !== arr2.length) return false;

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	return true;
}

export const checkAddress = (addr: string) => /[a-z0-9_-]{43}/i.test(addr);

export function getRangeLabel(number: number) {
	if (number >= 0 && number <= 7) return '0-7';
	if (number >= 8 && number <= 14) return '8-14';
	if (number >= 15 && number <= 29) return '15-29';
	if (number >= 30) return '30+';
	return 'out-of-range';
}

export function getStreakIcon(count: number) {
	if (count !== null) {
		let icon: string;
		switch (getRangeLabel(count)) {
			case '0-7':
				icon = ASSETS.streak['1'];
				break;
			case '8-14':
				icon = ASSETS.streak['2'];
				break;
			case '15-29':
				icon = ASSETS.streak['3'];
				break;
			case '30+':
				icon = ASSETS.streak['4'];
				break;
			default:
				break;
		}
		return <img src={icon} />;
	} else return null;
}
