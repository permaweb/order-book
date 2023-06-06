import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import closeSVG from 'assets/close.svg';
import logoSVG from 'assets/logo.svg';
import menuSVG from 'assets/menu.svg';

import { language } from './language';
import { IURLView } from './types';
import * as urls from './urls';

export const ASSETS = {
	close: closeSVG,
	logo: logoSVG,
	menu: menuSVG,
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
