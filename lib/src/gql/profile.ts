import { ArcGQLResponseType, CursorEnum, getTxEndpoint, ProfileType, TAGS } from '../helpers';

import { getGQLData } from '.';

export async function getProfile(walletAddress: string | null): Promise<ProfileType | null> {
	if (!walletAddress) return null;

	walletAddress = walletAddress.trim();
	if (!/^[a-zA-Z0-9\-_]{43}$/.test(walletAddress)) return null;
	else {
		let finalProfile: ProfileType | null = null;

		const gqlResponse: ArcGQLResponseType = await getGQLData({
			ids: null,
			tagFilters: [
				{
					name: TAGS.keys.protocolName,
					values: [TAGS.values.profileVersions['0.2'], TAGS.values.profileVersions['0.3']],
				},
			],
			uploader: walletAddress,
			cursor: null,
			reduxCursor: null,
			cursorObject: CursorEnum.GQL,
		});

		if (gqlResponse.data && gqlResponse.data.length) {
			const txResponse = await fetch(getTxEndpoint(gqlResponse.data[0].node.id));
			if (txResponse.status === 200) {
				let fetchedProfile: any = await txResponse.text();
				fetchedProfile = JSON.parse(fetchedProfile);
				finalProfile = {
					handle: fetchedProfile.handle ? fetchedProfile.handle : null,
					avatar: fetchedProfile.avatar ? fetchedProfile.avatar : null,
					twitter: fetchedProfile.links.twitter ? fetchedProfile.links.twitter : null,
					discord: fetchedProfile.links.discord ? fetchedProfile.links.discord : null,
				};
			}
		}

		return finalProfile;
	}
}
