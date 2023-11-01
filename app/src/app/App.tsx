import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { ORDERBOOK_CONTRACT } from 'permaweb-orderbook';

import { APP, ASSETS, CONTRACT_OPTIONS, DOM } from 'helpers/config';
import { language } from 'helpers/language';
import { Footer } from 'navigation/footer';
import { Header } from 'navigation/header';
import { Routes } from 'routes';
import { RootState } from 'store';
import * as ucmActions from 'store/ucm/actions';

LoggerFactory.INST.logLevel('fatal');

export default function App() {
	const dispatch = useDispatch();

	const ucmReducer = useSelector((state: RootState) => state.ucmReducer);

	if (!localStorage.getItem(APP.appKey) || localStorage.getItem(APP.appKey) !== APP.appVersion) {
		localStorage.clear();
		localStorage.setItem(APP.appKey, APP.appVersion);
		window.location.reload();
	}

	React.useEffect(() => {
		(async function () {
			const warp = WarpFactory.forMainnet({
				...defaultCacheOptions,
				inMemory: true,
			}).use(new DeployPlugin());

			const contract = warp.contract(ORDERBOOK_CONTRACT).setEvaluationOptions(CONTRACT_OPTIONS);
			const contractState = (await contract.readState()).cachedValue.state as any;
			dispatch(ucmActions.setUCM(contractState));
		})();
	}, []);

	return (
		<>
			<div id={DOM.loader} />
			<div id={DOM.modal} />
			<div id={DOM.notification} />
			{ucmReducer ? (
				<>
					<Header />
					<Routes />
					<Footer />
				</>
			) : (
				<div className={'app-loader'}>
					<ReactSVG src={ASSETS.logo} />
					<span>{`${language.fetchingUCM}...`}</span>
				</div>
			)}
		</>
	);
}
