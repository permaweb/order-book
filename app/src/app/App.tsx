import { DOM } from 'helpers/config';
import { Footer } from 'navigation/footer';
import { Header } from 'navigation/header';
import { Routes } from 'routes';

export default function App() {
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
