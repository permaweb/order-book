import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getUserAssets } from '../src/api/get-user-assets';

const test = suite('mint');

test.before(async () => {});

test('should get user assets', async () => {
	const output = await getUserAssets('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4');
	assert.is(output.paging.limit, 30);
	assert.is(output.paging.items, 30);
	assert.is(output.paging.page, 1);
});

test('should get second page', async () => {
	const output = await getUserAssets('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4', 2);
	assert.is(output.paging.limit, 30);
	assert.is(output.paging.items, 30);
	assert.is(output.paging.page, 2);
});

test('should get 2nd page with 60 items', async () => {
	const output = await getUserAssets('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4', 2, 60);
	assert.is(output.paging.limit, 60);
	assert.is(output.paging.items, 60);
	assert.is(output.paging.page, 2);
});

test.after(async () => {});

test.run();
