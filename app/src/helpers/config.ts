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
import htmlSVG from 'assets/html.svg';
import infoSVG from 'assets/info.svg';
import leaderboardSVG from 'assets/leaderboard.svg';
import licenseSVG from 'assets/license.svg';
import logoSVG from 'assets/logo.svg';
import logoAltPNG from 'assets/logoAlt.png';
import marketSVG from 'assets/market.svg';
import menuSVG from 'assets/menu.svg';
import microscopeSVG from 'assets/microscope.svg';
import ordersSVG from 'assets/orders.svg';
import overviewSVG from 'assets/overview.svg';
import ownersSVG from 'assets/owners.svg';
import pasteSVG from 'assets/paste.svg';
import pixlSVG from 'assets/pixl.svg';
import provenanceSVG from 'assets/provenance.svg';
import rendererSVG from 'assets/renderer.svg';
import searchSVG from 'assets/search.svg';
import sellSVG from 'assets/sell.svg';
import settingsSVG from 'assets/settings.svg';
import shareSVG from 'assets/share.svg';
import defaultStampSVG from 'assets/stamp-default.svg';
import superStampSVG from 'assets/stamp-super.svg';
import vouchedStampSVG from 'assets/stamp-vouched.svg';
import stampsSVG from 'assets/stamps.svg';
import streak1SVG from 'assets/streak-1-7.svg';
import streak2SVG from 'assets/streak-8-14.svg';
import streak3SVG from 'assets/streak-15-29.svg';
import streak4GIF from 'assets/streak-30.gif';
import transferSVG from 'assets/transfer.svg';
import uSVG from 'assets/u.svg';
import udlSVG from 'assets/udl.svg';
import unsupportedSVG from 'assets/unsupported.svg';
import userSVG from 'assets/user.svg';
import videoSVG from 'assets/video.svg';
import walletSVG from 'assets/wallet.svg';
import xSVG from 'assets/x.svg';

import { language } from './language';
import { DREObjectType, SelectOptionType, WalletEnum } from './types';
import { getHost } from './utils';

export const APP = {
	appKey: 'appVersion',
	appVersion: '1.0.6',
	orderTx: 'orderTx',
	providerKey: 'providerVersion',
	providerVersion: '1.0.3',
};

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
	html: htmlSVG,
	info: infoSVG,
	leaderboard: leaderboardSVG,
	license: licenseSVG,
	logo: logoSVG,
	logoAlt: logoAltPNG,
	market: marketSVG,
	menu: menuSVG,
	microscope: microscopeSVG,
	orders: ordersSVG,
	overview: overviewSVG,
	owners: ownersSVG,
	paste: pasteSVG,
	pixl: pixlSVG,
	provenance: provenanceSVG,
	renderer: rendererSVG,
	search: searchSVG,
	sell: sellSVG,
	settings: settingsSVG,
	share: shareSVG,
	stamps: stampsSVG,
	stamp: {
		default: defaultStampSVG,
		super: superStampSVG,
		vouched: vouchedStampSVG,
	},
	streak: {
		'1': streak1SVG,
		'2': streak2SVG,
		'3': streak3SVG,
		'4': streak4GIF,
	},
	transfer: transferSVG,
	u: uSVG,
	udl: udlSVG,
	unsupported: unsupportedSVG,
	user: userSVG,
	video: videoSVG,
	wallet: walletSVG,
	wallets: {
		arconnect: arconnectWalletPNG,
		arweaveApp: arLogoSVG,
	},
	x: xSVG,
};

export const TAGS = {
	keys: {
		ans110: {
			title: 'Title',
			description: 'Description',
			topic: 'Topic:*',
			type: 'Type',
			implements: 'Implements',
			license: 'License',
		},
		appName: 'App-Name',
		banner: 'Banner',
		collectionCode: 'Collection-Code',
		contentType: 'Content-Type',
		contractSrc: 'Contract-Src',
		creator: 'Creator',
		dataProtocol: 'Data-Protocol',
		dataSource: 'Data-Source',
		dateCreated: 'Date-Created',
		holderTitle: 'Holder-Title',
		indexedBy: 'Indexed-By',
		initialOwner: 'Initial-Owner',
		initState: 'Init-State',
		name: 'Name',
		paymentFee: 'Payment-Fee',
		protocolName: 'Protocol-Name',
		uploaderTxId: 'Uploader-Tx-Id',
		renderWith: 'Render-With',
		rootSource: 'Root-Source',
		smartweaveAppName: 'App-Name',
		smartweaveAppVersion: 'App-Version',
		thumbnail: 'Thumbnail',
		topic: (topic: string) => `topic:${topic}`,
		udl: {
			access: 'Access',
			accessFee: 'Access-Fee',
			commercial: 'Commercial',
			commercialFee: 'Commercial-Fee',
			commercialUse: 'Commercial-Use',
			currency: 'Currency',
			derivation: 'Derivation',
			derivationFee: 'Derivation-Fee',
			license: 'License',
			licenseFee: 'License-Fee',
			paymentMode: 'Payment-Mode',
		},
	},
	values: {
		ansVersion: 'ANS-110',
		assetContractSrc: 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ',
		collection: 'Collection',
		comment: 'comment',
		contentTypes: {
			textPlain: 'text/plain',
		},
		holderTitle: {
			sponsor: 'sponsor',
		},
		indexer: 'ucm',
		profileVersions: {
			'0.2': 'Account-0.2',
			'0.3': 'Account-0.3',
		},
		smartweaveAppAction: 'SmartWeaveAction',
		smartweaveAppName: 'SmartWeaveContract',
		smartweaveAppVersion: '0.3.0',
	},
};

export const DOM = {
	loader: 'loader',
	modal: 'modal',
	notification: 'notification',
	renderer: 'renderer',
};

export const CURRENCY_ICONS = {
	PIXL: ASSETS.pixl,
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
	arweaveGet: getHost(),
	arweavePost: getHost(),
	protocol: 'https',
	port: 443,
	timeout: 40000,
	logging: false,
};

export const PAGINATORS = {
	collection: 15,
	contract: 10,
	user: 15,
	default: 100,
};

export const WALLET_PERMISSIONS = ['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY', 'SIGN_TRANSACTION', 'DISPATCH', 'SIGNATURE'];

export const FEATURE_COUNT = 3;

export const STORAGE = {
	none: 'N/A',
};

export const REDIRECTS = {
	arProfile: `https://arprofile.arweave.dev/`,
	everpay: `https://app.everpay.io/deposit`,
	u: `https://getu.arweave.dev/#/burn/`,
	udl: `https://udlicense.arweave.dev`,
	viewblock: (tx: string) => `https://viewblock.io/arweave/tx/${tx}`,
};

export const DETAIL_ACTION_TAB_OPTIONS = {
	market: language.market,
	comments: language.comments,
	activity: language.activity,
};

export const DETAIL_ACTION_TABS = [
	{
		label: DETAIL_ACTION_TAB_OPTIONS.market,
		icon: ASSETS.market,
	},
	{
		label: DETAIL_ACTION_TAB_OPTIONS.comments,
		icon: ASSETS.comments,
	},
	{
		label: DETAIL_ACTION_TAB_OPTIONS.activity,
		icon: ASSETS.activity,
	},
];

export const DETAIL_MARKET_TAB_OPTIONS = {
	buy: language.buy,
	sell: language.sell,
	transfer: language.transfer,
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
	{
		label: DETAIL_MARKET_TAB_OPTIONS.transfer,
		icon: ASSETS.transfer,
	},
];

export const DRE_NODES: DREObjectType[] = [
	{
		label: 'DRE-U',
		source: 'https://dre-u.warp.cc/contract',
	},
];

export const DRE_STATE_CHANNEL = (id: string) => `states/DRE-BAZAR-2/${id}`;

export const UDL_ICONS_MAP = {
	AR: ASSETS.arLogo,
	U: ASSETS.u,
};

export const AR_PROFILE = {
	defaultAvatar: 'OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA',
};

export const COMMENT_SPEC = {
	protcolId: 'comment',
	renderWith: 'comment-renderers',
	ticker: 'ATOMIC ASSET - COMMENT',
};

export const SOCIAL_PATHS = [
	{
		name: language.social.twitter,
		icon: ASSETS.x,
		href: 'https://twitter.com/OurBazAR',
	},
];

export const ORDERBOOK_ASSET_PATH =
	'https://cxc5f7qktvrrxkfzkioh7rfwn77v56pe6ncqbrnok5qpz6sp3sia.arweave.net/FcXS_gqdYxuouVIcf8S2b_9e-eTzRQDFrldg_PpP3JA';
export const STAMP_ASSET_PATH =
	'https://7nvuz4m3gvkej42fu7z7z2e6dat7xhr4ddnygx6uo42fvn7ov6na.arweave.net/-2tM8Zs1VETzRafz_OieGCf7njwY24Nf1Hc0Wrfur5o';

export const ASSET_SORT_OPTIONS: SelectOptionType[] = [
	{ id: 'recently-listed', label: language.recentlyListed },
	{ id: 'low-to-high', label: language.lowToHigh },
	{ id: 'high-to-low', label: language.highToLow },
	// { id: 'by-stamps', label: language.byStamps },
];

export const CC_LICENSE = 'x5UYiin_eRB0XCpZAkpduL0JIaXAUe9Bi2-RXGloBQI';

export const CURSORS = {
	p1: 'P1',
	end: 'END',
};

export const PAGINATOR = 100;

export const GATEWAYS = {
	arweave: 'arweave.net',
	goldsky: 'arweave-search.goldsky.com',
};

export const CONTRACT_OPTIONS = {
	allowBigInt: true,
	internalWrites: true,
	remoteStateSyncEnabled: true,
	remoteStateSyncSource: DRE_NODES[0].source,
	unsafeClient: 'skip' as any,
};

export const FILTERED_IDS = [
	'fjgMN5h1bybEULC2ho9SzCc_noUUC3ieYztmlfnxWro',
	'6Twb5wMKt52-tg5PKfZwH157Nxed6sevSHTmxqx_44c',
	'iS9PhSYv2Vfqu3BRx8sqgfZidYsnl911YJfd7bFe4jk',
	'nOWM_UqkcKqBEy5g696ybe4APQvee-_nSuQ__yaWXnQ',
	'G-l4PIGMtsBB-72ikBVFtFTKvFQOS4BDnIojhijkTsk',
	'8XO1J5sNy377113PrO2TYTCOXYoDe5J_PRteGIIUJRE',
	'3ci95c5uQ5tPIjiQVkvMD1igFRVXgO7tkGZAYavjbzA',
	'7jd_WTm22LE-l9rH_pmgD37q0eDewztLb6AaaMGbnGw',
	'g-C1qidVwMLBO3bHCF54WmrFSjTxrobd7h1DEGnmm-I',
	'P5byd15fpKsVxctWFX_z86LjCzIkzKOeoplsb5FJHhs',
	'g6H5z9NbodrmMXSemqruuJu_KRM9Fw5sesuXi-yJfKg',
	'zJRiJ29Du4TpJNHNkpcmkBc04gZWzCdU6yzDP1dJ2NQ',
	'uWtQrWPVJgMzPnflboIQnM8Hd1pwZMbcW2dGp_tu9n0',
	'bhOAGwqrsl9mSbx4lXZWQAcK7B-09sQ9lZ6JJ6WqdSc',
	'uzExhjMo9cy0L2bOReXnoJwq8ZxLXq1Qm6vSubAOycM',
	'sdXz-ZY8G8VhZtxvXKgPKfQBIXJzxtiibbQtbZrZWew',
	'UNOot99N1d48uwOFHYCBno_u_BPKFc34nlq6gSvI24w',
	'xgcjelklzEZJ87J8kVTuMkBDf_x_sB6q9fwZmB0qPWs',
	'u0NlDO2PVpoiEkCj-iYBDoL3Mu1BBIkCjIn-93VTYKI',
	't3TZNbUrjf_VgngYeTSMppYf_pnIKMa7NJKlCImUGnY',
	'dwmjydNfY0Fh9d_7xsroGwNEyHsApfzatKocoiD1KeA',
	'bn7FTVwUwuMPUmP1MWNl87s_JFmewUkMl3jOY-ocKYY',
	'5UZ6IXw50VJx50zia7qaSfHaMK4ReV88FA7Wcj_svIM',
	'YkdQf32-sVEHrpFf7Ao3VQOGhnRqMExTZQ3EoUMh1IE',
	'4_mLyTRSNO4s7x7ahmFJcsNVsAibEUE3UQt0yP6WZSw',
	'N-i5S-mX8Vd_12ilth4J3U8DkKl9VNqfwS2dQXcBWDs',
	'A43silRFZAN78ef8RpgjsuNqITIpJ69-s0khPgpzmlY',
	'oyDJ3yUa-Bd8EI7jOFMx05VTFLbVO8BBSouh4usQa7o',
	'AB-mmIBpIPEAN6cFWjJQ5aghWJaUcej79fVBYdQjr5k',
	'5zDO-0db1fCgVy7uN7FnkoqqXa3_i0Psfd7wXlAlOZA',
	'84t7Xf0X03wSETjanZAFbTUNY0MEg1FgO-WAIWtRBnk',
	'LGHUEIm0kRsFzEGJNrT_PnXkyVf8d7UBOlnOsQs7-2o',
	'biv7lejRqUT6fguBXOIdAHmgEwMOb_U0A7yG_obeYOA',
	'4l8YXP1a91TVeUFpCILR6--Aa42YVYoIR_9_qejimW8',
	'8N-HN-1p_wf8bty189ktKkuFn7Se6WxUxEDDgj7gYPE',
	'HQn0DSM4mEaBoQLmYSg1hChz6r4YEH4DihIaWgauzuk',
	'TTa8IEtYkSm3QnwAGZw6-M3Jyu943xGQ9EYr_nT2r8s',
	'mujaSvCyRodIGAJYMiqN1_wcfZaujdusOjaLevpBtG4',
	'bwuzuDEH70Lyty1ew94SCjcfaqxr37sqEwFeQwrX4aU',
	'0jdx_jrX3W6GXyEodaO_PlepBP-g-KsfbDKgtcSSRnQ',
	'vMpyQtAj_9waClT87yM7KI-eNsf9ER-Ro31IOjBtfEM',
	'nrTjEckdCwTMOSPJZSn8MC5jNVuCiOEkQ93yyHqUV_s',
	'BBsOilgk103Fs0v9bPLTTgN3LacZtDlO3_woaVALonM',
	'TeoZoBwPqqMJKqWf5f8KmWjuEkJ3TYp0r1WZjKEBnRA',
	'v4uWkgZbmm6BhIWidb3urBi1H49H0sM4CC8qFjIQ-No',
	'Rx5ZBlDEjWb0st3FG1PAhRR1ulQ6Fo5qjMO4K6sYgdM',
	'8AO4wCG2QHZO47Uei7g426CL51WzNqNSNZpH_8wW6ac',
	'JYA2tA3CP5gc7WTw6mWAMMhU1_h5xxdYF2tmoX7FH60',
	'elWel6Q67513bxNU0ucc_B9K3iliDfDvj0hji6B4DfE',
	'bvtWEATCt0JrN1Nfq7Z4XPj-ufXrcFy89atfmjVpbY4',
	'GQQHCuBQ1oDXMONQds38DdQ2qmuYWsEa6RbEoOLkZxw',
	'jlk9r0IpjxAB1FN6GhG0fLFqp6LtoiJqdu7GvWsMLbY',
	'-Ewp7BvgROuAvmtxnUK5Qp63DsXpyU12IfbZG9G7FZc',
	'o6yBgn0ctc6RwdThHi-ULTBNNbOxY-3IDp3-pej_HTU',
	'Pr2sBr5a2GwQFyEFOez6N2tVuMmmSz7L2Nki4xQvACY',
	'-slTCsLM0rVlvPA65N5XhE7NpbJvbFg-3LdG7eG0P2A',
	'GN9vVkecxeSygEX0oQxH2zqRMYLJp0nUUrxCLruaMd8',
	'0NjJOcUCqs9aTEm27-1Ha0mQ9LkG8k1i_yqUmlBXZQw',
	'HJVhwVyVlLpn7p1PEgs_W6rU3NXVojDoI4-8D7B_yNc',
	'81yfZUaKAIi0yyAJyJ1QCl8__h98q0ofW8gWenNOV4A',
	'oDrntHOfYWGL98kJwVu38gX_Cd7paq-IBE2Jedsnjx0',
	'Q0tnMorbGQdQvzdmMl__uhABsqhzIGmvsVzHhrIFRGc',
	'6kySY-6lOx0aqOMXMPg6KYE20y-htm5Gfvok7maKKxw',
	'tbF00fU-eZ-wuMj1qFconV385KyqJ_bi9AjUaW7Rlm0',
	'v3exf116RW3pB06i2Vnpme96Ty3clmrDRS0sVXAlcRM',
	'Yu0B2XZ0FVYqXZMIaJnzhYVh73Rvk4bj6yOTiaghQD0',
	'srxs1B4bqB46dLKq31FrpxA-BvaflJ3DPnjsFbbYpGc',
	'BHiDR_HVGi1reiozMfrmEJTtwufwgB2E-69NW5SMHt8',
	'8EKjMMW5nYD8lkL9DCV7DzrxkxC_u_Cfz7XF0K2T2Ro',
	'BgNMcvG7PYmPDbC0T3bCG-SbpXeKaG1YPxu_D44QBAY',
	'26AAhs4cQZHv6bzoirrPMovnywhOYYrngZfo5wVLPZ0',
	'ac__EEkvAOOMgLQlGPCf4b41d7DdktdrsBQc4tSZ63M',
	'HL-JESXpvcHRHIf_ZgCT9TvRr9Q9pUv75ne5v3gWvL0',
	'DIDsQEboU7pYOd-p9dxDoJcNeWhWKoK_Hho1JQX0DAA',
	'JwiOxBrqhhxDcUipv1suGL8zKz7pdpuHDQ_salEbHrI',
	'UHzOuhRbMIjIdpxyo1lEQZNmrPqYniGCqIfCb6OUu8U',
	'2EGsEDV-QRxHAPfMPFHivlbL36LzvlICewIueAV08Ro',
	'djyxwry_c6GhouYd3dKO4kTnFZB4sBh2sqwZ3_KISKI',
	'krjIQ_hWExS5peicXwJAzTnP1SOu5d72mGqm3fVTTkM',
	'Qp4N2WmLYKmh-mQYun6xdJ7mtpYlYuqd0mxnTmCXxcQ',
	't7WZvTdHqfB_2RdapFcb2g-m8pViZzHPxqdcvvNxWo4',
	'WSwn_dR4NPhtMK6nolOXCNqsaj3GxY7joFEb8cgZo5s',
	'uPImUve4wLi3AVQ96NWu7MmVylemK4DTTflzgp_RI9c',
	'sBgL_YrL6lH4Y8E1fWo3pLMtemqKmjN922qfQBab32s',
	'T0gRG5etQZj1-nhecCPkphwMl5un7ME0dRQbN3H0D70',
	'-_XsI18KFnjdBYZlDMonn0St8fZLuNjFJp_Ttk3rzCE',
	'Pt87Q_cu6-trMYzT9SsOyZN7CvpEM1ICJyYCPsOL3lM',
	'HRw6mRE_bYPtP49vf5qVsk-lFXrh0xF3aF_O3fcJFno',
	'THeaOmcbe0A3P0wdAjNlOkJNJMe1bBcpTF9sJ0MbTGM',
	'1nGgpCRTm55dVkfFcqWdyzzxTHQxD3QBxYFpNC93OFo',
	'wNe-YjP2gtpcX8ahAWPpLsK9VIdNWlpU7naTcurseZs',
	'nC0XA-vonrIJjWY7Dx8TFL8wbdAmySZKGBJwOugHrNc',
	'0vf97XiWSXvGmlEPJPI38wOestJqAuL8bFbed75X3oA',
	'-Yral1_jqd9nv81mUHXHltS_M0vhFdr4vrWoi0eG4M0',
	'HK9_TSBMHDg4VSbS9fd63Cm33gsaS6rLp4Z3Sk-5mDg',
	'zd2kru3ejbBASyuciEDt8BOzZLpcOUfyork1M8NCC6U',
	'IH2F45n-N8PN1Dwd6aWBvz1rg2cx3sXvTFwntIqpJYo',
	'BKBp_PzP7kLFrKF2E62HC96E7pvK12FWfe9R_vjArD0',
	'K1QnSVgtyJRKyGx0Y0V3eh2vhSJIoX3WpZ_cvZHQiOw',
	'Em9gP0wmnd7sI8BPZzx8Ugy0qBAiRVT7fVks69bvnKY',
	'V6fwgkTtbRJVu_yKGJM2RQ6bHte35_g0Sj2C_BIdScs',
	'EKEcRBftTVMNKkgoaFq7zJUElzMJIoT4RlLlTrSCHbg',
	'x26ilh3k35jV4IgilRu5JFx5rnn-F4s5gG2mzel0Pyw',
	'5slxbV2C2Vd6sD0RYR1QzPrhVGpJ3tRSwBH1JpmRYq0',
	'yR5X4BZllnjaZAAEBz-608BE2fqZk9c5HsHviyiZahA',
	'ThVyY-Wg99gah__3mjWy4Mov7S3ZoWZ-UF2UbZPfIzA',
	'727tWCz4Bd7EtqAEGJH01HgTZH0JomZyf6wRGzjmtrc',
	'wMdDWG62bCZtpegXqzNqtFLEcOeOUJto4rh5PpiidRQ',
	'7g4P90mePfDn5zCed-YIHGdET-PE4C5ZoR1b1lWd880',
	'WrRahJdqy9c7MPTY6QJuMjR4K68gcHU5KvHGJHZk5yM',
	'p5cIg_OtFJZtdGe0foX7gveLQ-8UrXQeZO5OLbiz2Y0',
	'WKS7Ycjy15whpLIbTeuYPN3yzUbjig7UdpLaXBuZbdA',
	'thVvstNTLeFUMz_jiCdzflmtKPJE4E4b2WxGutj4Z0o',
	'OSc1zKQK1HXCUBIsmxjeRUx_0WcJGPreNQmWtaDPd94',
	'FBQtTNPxcGdvx9xb_r-tk_xypRGufbeF61UinE-lLr4',
	'4Ypwu-ZLApSGbibYEjMUxpCssboVSxhulu4lX__GqbA',
	'DGySa2rCqnSKuRpeAkmIsGr4-xbrlsUShux4R-vKoo4',
];

export const ANS_FILTER_LIST = [CURRENCY_DICT['U'], 'TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo'];

export const STAMP_CONTRACT = 'TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo';
