import { useEffect } from 'react';
import { env } from 'api';

export default function Landing() {
	const { getUserAssets } = env;

	useEffect(() => {
		getUserAssets('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4')
			.then((data) => {
				console.log('Fetched user assets:', data);
			})
			.catch(console.log);
	}, []);

	return <div className={'view-wrapper max-cutoff'}>Marketplace</div>;
}
