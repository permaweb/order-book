import { APP, DOM } from 'helpers/config';
import { Footer } from 'navigation/footer';
import { Header } from 'navigation/header';
import { Routes } from 'routes';

export default function App() {
	if (!localStorage.getItem(APP.appKey) || localStorage.getItem(APP.appKey) !== APP.appVersion) {
		localStorage.clear();
		localStorage.setItem(APP.appKey, APP.appVersion);
		window.location.reload();
	}

	return (
		<>
			<div id={DOM.loader} />
			<div id={DOM.modal} />
			<div id={DOM.notification} />
			<Header />
			<Routes />
			<Footer />
		</>
	);
}
