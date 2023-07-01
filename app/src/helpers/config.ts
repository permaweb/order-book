import { CURRENCY_DICT } from 'permaweb-orderbook';

import arLogoSVG from 'assets/ar-logo.svg';
import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import arrowDownSVG from 'assets/arrow-down.svg';
import arrowNextSVG from 'assets/arrow-next.svg';
import arrowPreviousSVG from 'assets/arrow-previous.svg';
import arrowUpSVG from 'assets/arrow-up.svg';
import buySVG from 'assets/buy.svg';
import checkmarkSVG from 'assets/checkmark.svg';
import closeSVG from 'assets/close.svg';
import copySVG from 'assets/copy.svg';
import detailsSVG from 'assets/details.svg';
import infoSVG from 'assets/info.svg';
import logoSVG from 'assets/logo.svg';
import menuSVG from 'assets/menu.svg';
import ordersSVG from 'assets/orders.svg';
import overviewSVG from 'assets/overview.svg';
import ownersSVG from 'assets/owners.svg';
import provenanceSVG from 'assets/provenance.svg';
import rendererSVG from 'assets/renderer.svg';
import searchSVG from 'assets/search.svg';
import sellSVG from 'assets/sell.svg';
import defaultStampSVG from 'assets/stamp-default.svg';
import superStampSVG from 'assets/stamp-super.svg';
import vouchedStampSVG from 'assets/stamp-vouched.svg';
import stampsSVG from 'assets/stamps.svg';
import uSVG from 'assets/u.svg';
import unsupportedSVG from 'assets/unsupported.svg';
import userSVG from 'assets/user.svg';
import walletSVG from 'assets/wallet.svg';

import { language } from './language';

export const ASSETS = {
	arLogo: arLogoSVG,
	arrowDown: arrowDownSVG,
	arrowNext: arrowNextSVG,
	arrowPrevious: arrowPreviousSVG,
	arrowUp: arrowUpSVG,
	buy: buySVG,
	checkmark: checkmarkSVG,
	close: closeSVG,
	copy: copySVG,
	details: detailsSVG,
	info: infoSVG,
	logo: logoSVG,
	menu: menuSVG,
	orders: ordersSVG,
	overview: overviewSVG,
	owners: ownersSVG,
	provenance: provenanceSVG,
	renderer: rendererSVG,
	search: searchSVG,
	sell: sellSVG,
	stamps: stampsSVG,
	stamp: {
		default: defaultStampSVG,
		super: superStampSVG,
		vouched: vouchedStampSVG,
	},
	u: uSVG,
	unsupported: unsupportedSVG,
	user: userSVG,
	wallet: walletSVG,
	wallets: {
		arconnect: arconnectWalletPNG,
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

export const AR_WALLETS = [{ name: 'arconnect', logo: ASSETS.wallets.arconnect }];

export const WALLET_PERMISSIONS = ['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY', 'SIGN_TRANSACTION', 'DISPATCH'];

export const FEATURE_COUNT = 3;

export const PAGINATOR = 100;

export const STORAGE = {
	none: 'N/A',
};

export const REDIRECTS = {
	arProfile: `https://arprofile.arweave.dev/`,
};

export const TAB_OPTIONS = {
	buy: language.buy,
	sell: language.sell,
};

export const ACTION_TABS = [
	{
		label: TAB_OPTIONS.buy,
	},
	{
		label: TAB_OPTIONS.sell,
	},
];
