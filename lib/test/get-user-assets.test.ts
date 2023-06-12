import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getUserAssets } from '../src/api/get-user-assets';

const test = suite('mint');

test.before(async () => {});

test('should get user assets', async () => {
	const output = getUserAssets('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4').toPromise();
	console.log('test', output);
});

test.after(async () => {});

test.run();
