import React from 'react';
import cytoscape from 'cytoscape';
// import klay from 'cytoscape-klay';
import { useTheme } from 'styled-components';

import { ActivityElementType, AssetDetailType } from 'permaweb-orderbook';

import { TxAddress } from 'components/atoms/TxAddress';
// import { AssetData } from 'global/AssetData';
import { OwnerInfo } from 'global/OwnerInfo';
import { STORAGE } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

// cytoscape.use(klay);

// const layouts: Record<string, any> = {
// 	// breadthfirst: {
// 	// 	name: 'breadthfirst',
// 	// 	directed: true,
// 	// 	padding: 10,
// 	// 	circle: true, // put this to false for a tree-like layout
// 	// },
// 	concentric: {
// 		name: 'concentric',
// 		fit: true, // whether to fit the viewport to the graph
// 		padding: 30, // the padding on fit
// 		startAngle: (Math.PI * 3) / 2, // the position of the first node
// 		sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
// 		clockwise: true, // whether the layout should go clockwise (true) or counterclockwise (false)
// 		equidistant: false, // whether levels have an equal radial distance between them
// 		minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
// 		concentric: function (node) {
// 			// returns numeric value for each node, placing higher nodes in levels towards the center
// 			return node.id() === 'root' ? 1 : 0; // replace 'root' with the id of your root node
// 		},
// 		levelWidth: function (nodes) {
// 			// the variation of concentric values in each level
// 			return nodes.maxDegree() / 4;
// 		},
// 		animate: false, // whether to transition the node positions
// 		animationDuration: 500, // duration of animation in ms if enabled
// 	},
// 	// klay: {
// 	// 	name: 'klay',
// 	// 	animate: true,
// 	// 	padding: 4,
// 	// 	nodeDimensionsIncludeLabels: true,
// 	// 	klay: {
// 	// 		spacing: 40,
// 	// 		mergeEdges: false,
// 	// 	},
// 	// },
// };

// ['box', 'disco', 'force', 'layered', 'mrtree', 'random', 'stress'].forEach((elkAlgo) => {
// 	layouts[`elk_${elkAlgo}`] = {
// 		name: 'elk',
// 		animate: true,
// 		elk: {
// 			algorithm: elkAlgo,
// 		},
// 	};
// });

function Tree(props: { data: any; handleCallback: (node: any) => void; activeId: string | null }) {
	const theme = useTheme();

	const styles: any = [
		{
			selector: 'node',
			style: {
				'background-color': theme.colors.microscope.inactive.background,
				'text-valign': 'center',
				'text-halign': 'center',
				height: '25px',
				width: '25px',
				'border-width': '1px',
				'border-color': theme.colors.border.primary,
			},
		},
		{
			selector: `node[id="${props.activeId}"]`,
			style: {
				'background-color': theme.colors.microscope.active.background,
			},
		},
		{
			selector: 'edge',
			style: {
				'line-color': theme.colors.border.primary,
				width: 1.5,
			},
		},
	];

	const cyRef = React.useRef<any>();

	React.useEffect(() => {
		const cy = cytoscape({
			container: cyRef.current,
			elements: props.data,
			style: styles,
			userPanningEnabled: false, // Disable panning
			userZoomingEnabled: false,
		});

		// cy.layout(layouts['breadthfirst']).run();

		const layout = cy.layout({
			name: 'concentric',
			fit: true, // whether to fit the viewport to the graph
			padding: 30, // padding on fit
			startAngle: (Math.PI * 3) / 2, // where nodes start in radians
			sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
			clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
			equidistant: false, // whether levels have an equal radial distance betwen them (may distort distances between nodes in the same level)
			minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
			height: undefined, // height of layout area (overrides container height)
			width: undefined, // width of layout area (overrides container width)
			avoidOverlap: true, // prevents node overlap, may overflow bounding box and radius if not enough space
			nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
			spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
			concentric: function (node) {
				// returns numeric value for each node, placing higher nodes in levels towards the centre
				return node.degree();
			},
			levelWidth: function (nodes) {
				// the variation of concentric values in each level
				return nodes.maxDegree() / 4;
			},
			animate: false, // whether to transition the node positions
			animationDuration: 500, // duration of animation in ms if enabled
			animationEasing: undefined, // easing of animation if enabled
			ready: undefined, // callback on layout ready
			stop: undefined, // callback on layout stop
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
			node.style('background-color', theme.colors.microscope.active.hover);
		});

		cy.on('mouseout', 'node', function (event: any) {
			const node = event.target;
			cyRef.current.style.cursor = 'default';
			if (node.id() !== props.activeId) {
				node.style('background-color', theme.colors.microscope.inactive.background);
			}
		});

		return () => {
			cy.destroy();
		};
	}, [props.activeId]);

	return (
		<S.TreeDiagram>
			<S.CyWrapper ref={cyRef} />
		</S.TreeDiagram>
	);
}

export default function AssetDetailMicroscope(props: IProps) {
	const orProvider = useOrderBookProvider();

	const [activeNode, setActiveNode] = React.useState<any>(null);
	const [data, setData] = React.useState<any>(null);

	const [activity, setActivity] = React.useState<ActivityElementType[] | null>(null);
	const [activeOwner, setActiveOwner] = React.useState<OwnerType | OwnerListingType | null>(null);
	// const [activeAsset, setActiveAsset] = React.useState<AssetType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.asset && orProvider) {
				const activityFetch = await orProvider.orderBook.api.getActivity({ id: props.asset.data.id });
				setActivity(activityFetch.activity);
			}
		})();
	}, [props.asset]);

	React.useEffect(() => {
		if (props.asset && activity) setData(structureData(activity, props.asset.data.id, props.asset.data.creator));
	}, [activity]);

	React.useEffect(() => {
		if (data && data.length) {
			setActiveNode(data[0].data);
		}
	}, [data]);

	React.useEffect(() => {
		(async function () {
			if (activeNode && props.asset && orProvider.orderBook) {
				// setActiveAsset(null);
				setActiveOwner(null);

				// const asset = await orProvider.orderBook.api.getAssetById({ id: activeNode.id });
				const owner = (await getOwners([{ creator: activeNode.owner }], orProvider, props.asset as AssetDetailType))[0];

				// setActiveAsset(asset);
				setActiveOwner(owner);
			}
		})();
	}, [activeNode, orProvider.orderBook]);

	function handleCallback(node: any) {
		setActiveNode(node);
	}

	return (
		<S.Wrapper className={'border-wrapper'}>
			{/* <S.Header>
				<p>{language.microscope}</p>
			</S.Header> */}
			<Tree
				data={data}
				handleCallback={(node: any) => handleCallback(node)}
				activeId={activeNode ? activeNode.id : null}
			/>
			{activeNode && (
				<S.TxWrapper>
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
								/>
							</S.TFlex>
							{activeNode.dataProtocol && activeNode.dataProtocol !== STORAGE.none && (
								<S.TFlex>
									<span>{`${language.dataProtocol}:`}</span>
									<p>{activeNode.dataProtocol.toUpperCase()}</p>
								</S.TFlex>
							)}
							{activeNode.protocolName && activeNode.protocolName !== STORAGE.none && (
								<S.TFlex>
									<span>{`${language.protocolName}:`}</span>
									<p>{activeNode.protocolName.toUpperCase()}</p>
								</S.TFlex>
							)}
						</S.TDetailWrapper>
					</S.TInfoWrapper>
					{/* {props.activity && (
                        <S.TTableWrapper>
                            {props.activity.map((element: ActivityElementType, index: number) => {
                                console.log(element)
                                return (
                                    <S.TRow key={index}>
                                        <TxAddress address={element.id} wrap={false} />
                                    </S.TRow>
                                )
                            })}
                        </S.TTableWrapper>
                    )} */}
					{/* <S.TAssetWrapper>
						<AssetData asset={activeAsset} autoLoad />
					</S.TAssetWrapper> */}
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
		},
	}));
	nodeGroups.push({
		data: { group: 'nodes', id: rootId, owner: rootOwner, dataProtocol: STORAGE.none, protocolName: STORAGE.none },
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
			},
		}))
		.filter((element: any) => element.id !== rootId);

	return [...nodeGroups.reverse(), ...edgeGroups];
}
