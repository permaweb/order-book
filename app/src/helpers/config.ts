import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import arrowDownSVG from 'assets/arrow-down.svg';
import arrowUpSVG from 'assets/arrow-up.svg';
import checkmarkSVG from 'assets/checkmark.svg';
import closeSVG from 'assets/close.svg';
import copySVG from 'assets/copy.svg';
import detailsSVG from 'assets/details.svg';
import logoSVG from 'assets/logo.svg';
import menuSVG from 'assets/menu.svg';
import overviewSVG from 'assets/overview.svg';
import provenanceSVG from 'assets/provenance.svg';

export const ASSETS = {
	arrowDown: arrowDownSVG,
	arrowUp: arrowUpSVG,
	checkmark: checkmarkSVG,
	close: closeSVG,
	copy: copySVG,
	details: detailsSVG,
	logo: logoSVG,
	menu: menuSVG,
	overview: overviewSVG,
	provenance: provenanceSVG,
	wallets: {
		arconnect: arconnectWalletPNG,
	},
};

export const DOM = {
	loader: 'loader',
	modal: 'modal',
	notification: 'notification',
};

export const AR_WALLETS = [{ name: 'arconnect', logo: ASSETS.wallets.arconnect }];

export const WALLET_PERMISSIONS = ['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY', 'SIGN_TRANSACTION', 'DISPATCH'];

export const FEATURE_COUNT = 3;

export const PAGINATOR = 100;

export const STORAGE = {
	none: 'N/A',
};
