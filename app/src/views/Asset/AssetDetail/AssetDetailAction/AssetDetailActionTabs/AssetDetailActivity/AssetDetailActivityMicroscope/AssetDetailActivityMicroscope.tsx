import React from 'react';
import { Link } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { useTheme } from 'styled-components';

import { ActivityElementType, AssetDetailType, AssetType } from 'permaweb-orderbook';

import { TxAddress } from 'components/atoms/TxAddress';
import { AssetData } from 'components/organisms/AssetData';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { REDIRECTS, STORAGE } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

function Tree(props: { data: any; handleCallback: (node: any) => void; activeId: string | null }) {
	const theme = useTheme();

	const styles: any = [
		{
			selector: 'node',
			style: {
				'background-color': theme.colors.button.primary.active.background,
				'text-valign': 'center',
				'text-halign': 'center',
				height: props.data && props.data.length < 20 ? '4.5px' : '25px',
				width: props.data && props.data.length < 20 ? '4.5px' : '25px',
				'border-width': props.data && props.data.length < 20 ? '0.25px' : '1px',
				'border-color': theme.colors.border.primary,
				'overlay-opacity': 0,
			},
		},
		{
			selector: `node[type = "stamp"]`,
			style: {
				'background-color': theme.colors.stats.alt1,
			},
		},
		{
			selector: `node[type = "root"]`,
			style: {
				'background-color': theme.colors.stats.alt6,
			},
		},
		{
			selector: `node[type = "comment"]`,
			style: {
				'background-color': theme.colors.stats.alt2,
			},
		},
		{
			selector: `node[id = "${props.activeId}"]`,
			style: {
				'background-color': theme.colors.stats.primary,
			},
		},
		{
			selector: 'edge',
			style: {
				'line-color': theme.colors.border.primary,
				width: props.data && props.data.length < 20 ? 0.25 : 1.5,
			},
		},
	];

	const cyRef = React.useRef<any>();

	React.useEffect(() => {
		const cy = cytoscape({
			container: cyRef.current,
			elements: props.data,
			style: styles,
			userPanningEnabled: false,
			userZoomingEnabled: false,
		});

		const layout = cy.layout({
			name: 'concentric',
			fit: true,
			padding: 30,
			startAngle: (Math.PI * 3) / 2,
			sweep: undefined,
			clockwise: true,
			equidistant: false,
			minNodeSpacing: 10,
			height: undefined,
			width: undefined,
			avoidOverlap: true,
			nodeDimensionsIncludeLabels: false,
			spacingFactor: undefined,
			concentric: function (node) {
				return node.degree();
			},
			levelWidth: function (nodes) {
				return nodes.maxDegree() / 4;
			},
		});

		layout.run();

		cy.on('click', 'node', function (event) {
			const target = event.target;
			props.handleCallback(target['_private'].data);
		});

		cy.on('tap', 'node', function (event) {
			const target = event.target;
			props.handleCallback(target['_private'].data);
		});

		cy.on('mouseover', 'node', function (event: any) {
			const node = event.target;
			cyRef.current.style.cursor = 'pointer';
			node.style('background-color', theme.colors.stats.primary);
		});

		cy.on('mouseout', 'node', function (event: any) {
			const node = event.target;
			cyRef.current.style.cursor = 'default';
			if (node.id() !== props.activeId) {
				switch (node.data().type) {
					case 'stamp':
						node.style('background-color', theme.colors.stats.alt1);
						break;
					case 'comment':
						node.style('background-color', theme.colors.stats.alt2);
						break;
					case 'root':
						node.style('background-color', theme.colors.stats.alt6);
						break;
					default:
						node.style('background-color', theme.colors.button.primary.active.background);
						break;
				}
			}
		});

		return () => {
			cy.destroy();
		};
	}, [props.activeId, props.data]);

	return (
		<S.TreeDiagram>
			<S.CyWrapper ref={cyRef} />
		</S.TreeDiagram>
	);
}

export default function AssetDetailActivityMicroscope(props: IProps) {
	const theme = useTheme();

	const orProvider = useOrderBookProvider();

	const [activeNode, setActiveNode] = React.useState<any>(null);
	const [data, setData] = React.useState<any>(null);

	const [activeOwner, setActiveOwner] = React.useState<OwnerType | OwnerListingType | null>(null);
	const [activeAsset, setActiveAsset] = React.useState<AssetType | null>(null);

	React.useEffect(() => {
		if (props.asset && props.activity)
			setData(structureData(props.activity, props.asset.data.id, props.asset.data.creator));
	}, [props.asset, props.activity]);

	React.useEffect(() => {
		if (data && data.length) {
			setActiveNode(data[0].data);
		}
	}, [data]);

	React.useEffect(() => {
		(async function () {
			if (activeNode && props.asset && orProvider.orderBook) {
				setActiveAsset(null);
				setActiveOwner(null);

				const asset = await orProvider.orderBook.api.getAssetById({ id: activeNode.id });
				const owner = (await getOwners([{ creator: activeNode.owner }], orProvider, props.asset as AssetDetailType))[0];

				setActiveAsset(asset);
				setActiveOwner(owner);
			}
		})();
	}, [activeNode, orProvider.orderBook]);

	function handleCallback(node: any) {
		setActiveNode(node);
	}

	return (
		<S.Wrapper className={'border-wrapper'}>
			<S.Header>
				<p>{language.relatedTransactions}</p>
			</S.Header>
			<Tree
				data={data}
				handleCallback={(node: any) => handleCallback(node)}
				activeId={activeNode ? activeNode.id : null}
			/>
			{activeNode && (
				<S.TxWrapper>
					<S.TxHeader>
						<S.TInfoWrapper>
							<S.THeaderWrapper>
								<S.TFlex>
									<span>{`${language.activeNode}:`}</span>
									<TxAddress address={activeNode.id} wrap={false} />
								</S.TFlex>
							</S.THeaderWrapper>
							<S.TDetailWrapper>
								<S.TFlex>
									<span>{`${language.owner.charAt(0).toUpperCase() + language.owner.slice(1)}:`}</span>
									<OwnerInfo
										owner={activeOwner}
										asset={props.asset}
										isSaleOrder={false}
										handleUpdate={() => {}}
										loading={!activeOwner}
										hideOrderCancel={false}
									/>
								</S.TFlex>
								{activeNode.dataProtocol && activeNode.dataProtocol !== STORAGE.none && (
									<S.TFlex>
										<span>{`${language.dataProtocol}:`}</span>
										<p>{activeNode.dataProtocol.charAt(0).toUpperCase() + activeNode.dataProtocol.slice(1)}</p>
									</S.TFlex>
								)}
								{activeNode.protocolName && activeNode.protocolName !== STORAGE.none && (
									<S.TFlex>
										<span>{`${language.protocolName}:`}</span>
										<p>{activeNode.protocolName.charAt(0).toUpperCase() + activeNode.protocolName.slice(1)}</p>
									</S.TFlex>
								)}
								{activeNode && (
									<S.ACLink>
										<Link target={'_blank'} to={REDIRECTS.viewblock(activeNode.id)}>
											{language.viewblock}
										</Link>
									</S.ACLink>
								)}
							</S.TDetailWrapper>
						</S.TInfoWrapper>
						<S.TKeyWrapper>
							<S.TKeyLine>
								<S.TKey background={theme.colors.stats.primary} />
								<p>{language.activeNode}</p>
							</S.TKeyLine>
							<S.TKeyLine>
								<S.TKey background={theme.colors.stats.alt6} />
								<p>{language.rootNode}</p>
							</S.TKeyLine>
							<S.TKeyLine>
								<S.TKey background={theme.colors.stats.alt1} />
								<p>{language.stamp}</p>
							</S.TKeyLine>
							<S.TKeyLine>
								<S.TKey background={theme.colors.stats.alt2} />
								<p>{language.comment}</p>
							</S.TKeyLine>
						</S.TKeyWrapper>
					</S.TxHeader>
					{props.asset && activeAsset && activeAsset.data.id !== props.asset.data.id && (
						<S.TAssetWrapper>
							<AssetData asset={activeAsset} autoLoad />
						</S.TAssetWrapper>
					)}
				</S.TxWrapper>
			)}
		</S.Wrapper>
	);
}

function structureData(activity: ActivityElementType[], rootId: string, rootOwner: string) {
	const nodeGroups = activity.map((element: ActivityElementType) => ({
		data: {
			group: 'nodes',
			id: element.id,
			owner: element.owner,
			dataProtocol: element.dataProtocol,
			protocolName: element.protocolName,
			type: getType(element),
		},
	}));
	nodeGroups.push({
		data: {
			group: 'nodes',
			id: rootId,
			owner: rootOwner,
			dataProtocol: STORAGE.none,
			protocolName: STORAGE.none,
			type: 'root',
		},
	});

	const edgeGroups = activity
		.map((element: ActivityElementType) => ({
			data: {
				group: 'edges',
				id: `_${element.id}`,
				source: element.dataSource,
				target: element.id,
				owner: element.owner,
				dataProtocol: element.dataProtocol,
				protocolName: element.protocolName,
				type: getType(element),
			},
		}))
		.filter((element: any) => element.id !== rootId);

	return [...nodeGroups.reverse(), ...edgeGroups];
}

function getType(element: ActivityElementType) {
	if (element.protocolName && element.protocolName.toLowerCase() === 'stamp') return 'stamp';
	if (element.dataProtocol && element.dataProtocol.toLowerCase() === 'comment') return 'comment';
	return null;
}
