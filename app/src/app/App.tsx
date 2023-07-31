import { APP, DOM } from 'helpers/config';
import { Footer } from 'navigation/footer';
import { Header } from 'navigation/header';
import { Routes } from 'routes';

export default function App() {
	if (!localStorage.getItem(APP.key) || localStorage.getItem(APP.key) !== APP.version) {
		localStorage.clear();
		localStorage.setItem(APP.key, APP.version);
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
