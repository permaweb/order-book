import { CURRENCY_DICT } from 'permaweb-orderbook';

import arLogoSVG from 'assets/ar-logo.svg';
import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import arrowDownSVG from 'assets/arrow-down.svg';
import arrowUpSVG from 'assets/arrow-up.svg';
import buySVG from 'assets/buy.svg';
import checkmarkSVG from 'assets/checkmark.svg';
import closeSVG from 'assets/close.svg';
import copySVG from 'assets/copy.svg';
import detailsSVG from 'assets/details.svg';
import logoSVG from 'assets/logo.svg';
import menuSVG from 'assets/menu.svg';
import ordersSVG from 'assets/orders.svg';
import overviewSVG from 'assets/overview.svg';
import ownersSVG from 'assets/owners.svg';
import provenanceSVG from 'assets/provenance.svg';
import sellSVG from 'assets/sell.svg';
import stampsSVG from 'assets/stamps.svg';
import uSVG from 'assets/u.svg';
import userSVG from 'assets/user.svg';

export const ASSETS = {
	arLogo: arLogoSVG,
	arrowDown: arrowDownSVG,
	arrowUp: arrowUpSVG,
	buy: buySVG,
	checkmark: checkmarkSVG,
	close: closeSVG,
	copy: copySVG,
	details: detailsSVG,
	logo: logoSVG,
	menu: menuSVG,
	orders: ordersSVG,
	overview: overviewSVG,
	owners: ownersSVG,
	provenance: provenanceSVG,
	sell: sellSVG,
	stamps: stampsSVG,
	u: uSVG,
	user: userSVG,
	wallets: {
		arconnect: arconnectWalletPNG,
	},
};

export const DOM = {
	loader: 'loader',
	modal: 'modal',
	notification: 'notification',
};

export const CURRENCY_ICONS = {
	[CURRENCY_DICT.U]: ASSETS.u
}

export const AR_WALLETS = [{ name: 'arconnect', logo: ASSETS.wallets.arconnect }];

export const WALLET_PERMISSIONS = ['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY', 'SIGN_TRANSACTION', 'DISPATCH'];

export const FEATURE_COUNT = 4;

export const PAGINATOR = 100;

export const STORAGE = {
	none: 'N/A',
};

export const REDIRECTS = {
	arProfile: `https://arprofile.arweave.dev/`
}