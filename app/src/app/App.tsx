import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { CONTRACT_CONFIG, ORDERBOOK_CONTRACT } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
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

	const [showInfo, setShowInfo] = React.useState<boolean>(true);

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
			})
				.use(new DeployPlugin())
				.useGwUrl(CONTRACT_CONFIG.gwUrl);

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
					{showInfo && (
						<Modal header={'BazAR Update'} handleClose={() => setShowInfo(false)}>
							<div className={'modal-info'}>
								<p>
									<b>BazAR</b> is migrating to <b>AO</b>!<br />
									<br />
									Information on how to migrate existing atomic assets onto AO will be released soon.
									<br />
									<br />
									All $U holders, stay tuned for important updates!
									<br />
									<br />
									You can start interacting with <b>AO BazAR</b> <a href="https://ao-bazar.arweave.dev">here</a>.
								</p>
							</div>
						</Modal>
					)}
				</>
			) : (
				<div className={'app-loader'}>
					<ReactSVG src={ASSETS.logo} />
					<span>{`${language.fetching}...`}</span>
				</div>
			)}
		</>
	);
}
