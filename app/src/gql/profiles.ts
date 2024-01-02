import { getTxEndpoint, TAGS } from 'permaweb-orderbook';

import { getGQLData } from 'gql';
import { AR_PROFILE, GATEWAYS, PAGINATOR } from 'helpers/config';
import { AGQLResponseType, CursorEnum, GQLNodeResponseType, ProfileType } from 'helpers/types';

export async function getProfiles(args: { addresses: string[] }): Promise<ProfileType[]> {
	const profiles: ProfileType[] = [];
	let gqlData: GQLNodeResponseType[] = [];

	for (let i = 0; i < args.addresses.length; i += PAGINATOR) {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: GATEWAYS.arweave,
			ids: null,
			tagFilters: [
				{
					name: TAGS.keys.protocolName,
					values: [TAGS.values.profileVersions['0.2'], TAGS.values.profileVersions['0.3']],
				},
			],
			owners: args.addresses.slice(i, i + PAGINATOR),
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
		});

		gqlData = [...gqlData, ...gqlResponse.data];
	}

	for (let i = 0; i < args.addresses.length; i++) {
		let finalProfile: ProfileType | null = null;

		const gqlProfile = gqlData.find((data: GQLNodeResponseType) => data.node.owner.address === args.addresses[i]);

		if (gqlProfile) {
			const txResponse = await fetch(getTxEndpoint(gqlProfile.node.id));
			if (txResponse.status === 200) {
				let fetchedProfile: any = await txResponse.text();
				fetchedProfile = JSON.parse(fetchedProfile);

				let avatar: string | null = null;
				if (fetchedProfile.avatar && !fetchedProfile.avatar.includes(AR_PROFILE.defaultAvatar)) {
					if (fetchedProfile.avatar.includes('ar://')) {
						avatar = fetchedProfile.avatar.substring(5);
					} else {
						avatar = fetchedProfile.avatar;
					}
				}

				finalProfile = {
					handle: fetchedProfile.handle ? fetchedProfile.handle : null,
					avatar: avatar,
					twitter: fetchedProfile.links && fetchedProfile.links.twitter ? fetchedProfile.links.twitter : null,
					discord: fetchedProfile.links && fetchedProfile.links.discord ? fetchedProfile.links.discord : null,
					walletAddress: args.addresses[i],
				};
			}
		} else {
			finalProfile = {
				handle: null,
				avatar: null,
				twitter: null,
				discord: null,
				walletAddress: args.addresses[i],
			};
		}

		profiles.push(finalProfile);
	}

	return profiles;
}
