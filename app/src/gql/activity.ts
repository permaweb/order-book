import { getTagValue } from 'permaweb-orderbook';

import { GATEWAYS, STORAGE, TAGS } from 'helpers/config';
import { ActivityElementType, ActivityResponseType, CursorEnum } from 'helpers/types';

import { getGQLData } from '../gql';

export async function getActivity(args: { id: string }): Promise<ActivityResponseType> {
	const dataSourceGqlData = await getGQLData({
		gateway: GATEWAYS.arweave,
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.dataSource,
				values: [args.id],
			},
		],
		owners: null,
		cursor: null,
		reduxCursor: null,
		cursorObjectKey: CursorEnum.GQL,
	});

	const feePaymentGqlData = await getGQLData({
		gateway: GATEWAYS.arweave,
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.appName,
				values: [TAGS.values.smartweaveAppAction],
			},
			{
				name: TAGS.keys.paymentFee,
				values: [args.id],
			},
		],
		owners: null,
		cursor: null,
		reduxCursor: null,
		cursorObjectKey: CursorEnum.GQL,
	});

	const activity: ActivityElementType[] = [];
	for (let i = 0; i < feePaymentGqlData.data.length; i++) {
		const node = feePaymentGqlData.data[i].node;
		activity.push({
			id: node.id,
			dataProtocol: STORAGE.none,
			dataSource: args.id,
			dateCreated: node.timestamp,
			owner: node.owner ? node.owner.address : node.address,
			protocolName: STORAGE.none,
			interactionType: 'UDL Interaction',
		});
	}

	for (let i = 0; i < dataSourceGqlData.data.length; i++) {
		const node = dataSourceGqlData.data[i].node;
		activity.push({
			id: node.id,
			dataProtocol: getTagValue(node.tags, TAGS.keys.dataProtocol),
			dataSource: getTagValue(node.tags, TAGS.keys.dataSource),
			dateCreated: node.timestamp,
			owner: node.owner ? node.owner.address : node.address,
			protocolName: getTagValue(node.tags, TAGS.keys.protocolName),
		});
	}

	return {
		activity: activity,
		nextCursor: dataSourceGqlData.nextCursor,
		previousCursor: null,
	};
}
