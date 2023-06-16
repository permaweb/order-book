import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from 'components/atoms/Loader';
import * as urls from 'helpers/urls';
import { View } from 'wrappers/View';

const Account = getLazyImport('Account');
const Asset = getLazyImport('Asset');
const Landing = getLazyImport('Landing');
const NotFound = getLazyImport('NotFound');

export default function _Routes() {
	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route
					path={urls.base}
					element={
						<View>
							<Landing />
						</View>
					}
				/>
				<Route
					path={urls.account}
					element={
						<View>
							<Account />
						</View>
					}
				/>
				<Route
					path={`${urls.asset}:id`}
					element={
						<View>
							<Asset />
						</View>
					}
				/>
				<Route
					path={'*'}
					element={
						<View>
							<NotFound />
						</View>
					}
				/>
			</Routes>
		</Suspense>
	);
}

function getLazyImport(view: string) {
	return lazy(() =>
		import(`../views/${view}/index.tsx`).then((module) => ({
			default: module.default,
		}))
	);
}
