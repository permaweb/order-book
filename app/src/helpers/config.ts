import { CURRENCY_DICT } from 'permaweb-orderbook';

import activitySVG from 'assets/activity.svg';
import arLogoSVG from 'assets/ar-logo.svg';
import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import arrowDownSVG from 'assets/arrow-down.svg';
import arrowLeftSVG from 'assets/arrow-left-bold.svg';
import arrowNextSVG from 'assets/arrow-next.svg';
import arrowPreviousSVG from 'assets/arrow-previous.svg';
import arrowUpSVG from 'assets/arrow-up.svg';
import audioSVG from 'assets/audio.svg';
import buySVG from 'assets/buy.svg';
import checkmarkSVG from 'assets/checkmark.svg';
import closeSVG from 'assets/close.svg';
import collectionsSVG from 'assets/collections.svg';
import commentsSVG from 'assets/comments.svg';
import copySVG from 'assets/copy.svg';
import defaultCollectionPNG from 'assets/default-collection.png';
import detailsSVG from 'assets/details.svg';
import infoSVG from 'assets/info.svg';
import licenseSVG from 'assets/license.svg';
import logoSVG from 'assets/logo.svg';
import logoAltPNG from 'assets/logoAlt.png';
import marketSVG from 'assets/market.svg';
import menuSVG from 'assets/menu.svg';
import ordersSVG from 'assets/orders.svg';
import overviewSVG from 'assets/overview.svg';
import ownersSVG from 'assets/owners.svg';
import provenanceSVG from 'assets/provenance.svg';
import rendererSVG from 'assets/renderer.svg';
import searchSVG from 'assets/search.svg';
import sellSVG from 'assets/sell.svg';
import settingsSVG from 'assets/settings.svg';
import defaultStampSVG from 'assets/stamp-default.svg';
import superStampSVG from 'assets/stamp-super.svg';
import vouchedStampSVG from 'assets/stamp-vouched.svg';
import stampsSVG from 'assets/stamps.svg';
import uSVG from 'assets/u.svg';
import udlSVG from 'assets/udl.svg';
import unsupportedSVG from 'assets/unsupported.svg';
import userSVG from 'assets/user.svg';
import walletSVG from 'assets/wallet.svg';

import { language } from './language';
import { DREObjectType, WalletEnum } from './types';

export const ASSETS = {
	activity: activitySVG,
	arLogo: arLogoSVG,
	arrowDown: arrowDownSVG,
	arrowLeft: arrowLeftSVG,
	arrowNext: arrowNextSVG,
	arrowPrevious: arrowPreviousSVG,
	arrowUp: arrowUpSVG,
	audio: audioSVG,
	buy: buySVG,
	checkmark: checkmarkSVG,
	close: closeSVG,
	collections: collectionsSVG,
	comments: commentsSVG,
	copy: copySVG,
	defaultCollection: defaultCollectionPNG,
	details: detailsSVG,
	info: infoSVG,
	license: licenseSVG,
	logo: logoSVG,
	logoAlt: logoAltPNG,
	market: marketSVG,
	menu: menuSVG,
	orders: ordersSVG,
	overview: overviewSVG,
	owners: ownersSVG,
	provenance: provenanceSVG,
	renderer: rendererSVG,
	search: searchSVG,
	sell: sellSVG,
	settings: settingsSVG,
	stamps: stampsSVG,
	stamp: {
		default: defaultStampSVG,
		super: superStampSVG,
		vouched: vouchedStampSVG,
	},
	u: uSVG,
	udl: udlSVG,
	unsupported: unsupportedSVG,
	user: userSVG,
	wallet: walletSVG,
	wallets: {
		arconnect: arconnectWalletPNG,
		arweaveApp: arLogoSVG,
	},
};

export const DOM = {
	loader: 'loader',
	modal: 'modal',
	notification: 'notification',
	renderer: 'renderer',
};

export const CURRENCY_ICONS = {
	[CURRENCY_DICT.U]: ASSETS.u,
};

export const CURRENCIES = {
	default: 'U' as 'U',
};

export const AR_WALLETS = [
	{ type: WalletEnum.arConnect, logo: ASSETS.wallets.arconnect },
	{ type: WalletEnum.arweaveApp, logo: ASSETS.wallets.arweaveApp },
];

export const API_CONFIG = {
	arweaveGet: 'arweave-search.goldsky.com',
	arweavePost: 'arweave.net',
	protocol: 'https',
	port: 443,
	timeout: 40000,
	logging: false,
};

export const WALLET_PERMISSIONS = ['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY', 'SIGN_TRANSACTION', 'DISPATCH', 'SIGNATURE'];

export const FEATURE_COUNT = 3;

export const PAGINATOR = 100;

export const STORAGE = {
	none: 'N/A',
};

export const REDIRECTS = {
	arProfile: `https://arprofile.arweave.dev/`,
	udl: `https://udlicense.arweave.dev`,
	viewblock: (tx: string) => `https://viewblock.io/arweave/tx/${tx}`,
};

export const DETAIL_ACTION_TAB_OPTIONS = {
	activity: language.activity,
	comments: language.comments,
	market: language.market,
};

export const DETAIL_ACTION_TABS = [
	{
		label: DETAIL_ACTION_TAB_OPTIONS.comments,
		icon: ASSETS.comments,
	},
	{
		label: DETAIL_ACTION_TAB_OPTIONS.market,
		icon: ASSETS.market,
	},
	// {
	// 	label: DETAIL_ACTION_TAB_OPTIONS.activity,
	// 	icon: ASSETS.activity,
	// },
];

export const DETAIL_MARKET_TAB_OPTIONS = {
	buy: language.buy,
	sell: language.sell,
};

export const DETAIL_MARKET_ACTION_TABS = [
	{
		label: DETAIL_MARKET_TAB_OPTIONS.buy,
		icon: ASSETS.buy,
	},
	{
		label: DETAIL_MARKET_TAB_OPTIONS.sell,
		icon: ASSETS.sell,
	},
];

export const DRE_NODES: DREObjectType[] = [
	{
		label: 'DRE-5',
		source: 'https://dre-5.warp.cc/contract',
	},
	{
		label: 'DRE-6',
		source: 'https://dre-6.warp.cc/contract',
	},
];

export const UDL_ICONS_MAP = {
	AR: ASSETS.arLogo,
	U: ASSETS.u,
};

export const AR_PROFILE = {
	defaultAvatar: 'ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA',
};

export const COMMENT_SPEC = {
	protcolId: 'comment',
	renderWith: 'comment-renderers',
	ticker: 'ATOMIC ASSET - COMMENT',
};
