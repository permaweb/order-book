import { getGQLData } from '../gql';
import { AGQLResponseType, ArweaveClientType, CursorEnum, getTxEndpoint, ProfileType, TAGS } from '../helpers';

export async function getProfile(args: {
	walletAddress: string | null;
	arClient: ArweaveClientType;
}): Promise<ProfileType | null> {
	if (!args.walletAddress) return null;

	args.walletAddress = args.walletAddress.trim();
	if (!/^[a-zA-Z0-9\-_]{43}$/.test(args.walletAddress)) return null;
	else {
		let finalProfile: ProfileType | null = null;

		const gqlResponse: AGQLResponseType = await getGQLData({
			ids: null,
			tagFilters: [
				{
					name: TAGS.keys.protocolName,
					values: [TAGS.values.profileVersions['0.2'], TAGS.values.profileVersions['0.3']],
				},
			],
			uploader: args.walletAddress,
			cursor: null,
			reduxCursor: null,
			cursorObject: CursorEnum.GQL,
			arClient: args.arClient,
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
					walletAddress: args.walletAddress,
				};
			}
		} else {
			finalProfile = {
				handle: null,
				avatar: null,
				twitter: null,
				discord: null,
				walletAddress: args.walletAddress,
			};
		}

		return finalProfile;
	}
}
