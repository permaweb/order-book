import React from 'react';

import { AssetDetailType, CommentType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { OwnerInfo } from 'global/OwnerInfo';
// import { StampWidget } from 'global/StampWidget';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType, ResponseType } from 'helpers/types';
import { getOwners } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { WalletConnect } from 'wallet/WalletConnect';

import { IAMProps, IAProps } from '../../../types';

import * as S from './styles';

function CommentCreate(props: IAMProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

	const [owner, setOwner] = React.useState<OwnerType | OwnerListingType | null>(null);
	const [comment, setComment] = React.useState<string>('');

	const [loading, setLoading] = React.useState<boolean>(false);
	const [commentResponse, setCommentResponse] = React.useState<ResponseType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress && props.asset && orProvider.orderBook) {
				const owner = (
					await getOwners([{ creator: arProvider.walletAddress }], orProvider, props.asset as AssetDetailType)
				)[0];
				setOwner(owner);
			}
		})();
	}, [arProvider.walletAddress, props.asset, orProvider.orderBook]);

	React.useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			const setHeight = () => {
				textarea.style.height = 'auto';
				textarea.style.height = `${textarea.scrollHeight + 10}px`;
			};
			setHeight();
			textarea.addEventListener('input', setHeight);
			return () => {
				textarea.removeEventListener('input', setHeight);
			};
		}
	}, []);

	// TODO: create comment in sdk
	async function handleSubmit(e: any) {
		e.preventDefault();
		e.stopPropagation();
		setLoading(true);
		console.log(comment);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setLoading(false);
		setCommentResponse({
			status: true,
			message: `${language.replied}!`,
		});
		setTimeout(() => {
			setCommentResponse(null), setComment('');
		}, 2000);
		props.handleUpdate();
	}

	function getCommentCreate() {
		if (arProvider.walletAddress) {
			return (
				<S.CommentCreate>
					{owner && (
						<S.CommentHeader>
							<OwnerInfo owner={owner} asset={props.asset} isSaleOrder={false} handleUpdate={() => {}} />
						</S.CommentHeader>
					)}
					<S.CommentCreateForm>
						<S.CommentCreateTextArea
							ref={textareaRef}
							value={comment}
							onWheel={(e: any) => e.target.blur()}
							onChange={(e: any) => setComment(e.target.value)}
							disabled={loading || commentResponse !== null}
							invalid={false}
							placeholder={`${language.leaveComment}!`}
						/>
						<S.CommentCreateSubmit>
							<Button
								type={'alt1'}
								label={commentResponse ? commentResponse.message : language.reply}
								handlePress={(e: any) => handleSubmit(e)}
								disabled={!comment || loading || commentResponse !== null}
								loading={loading}
								formSubmit
								noMinWidth
							/>
						</S.CommentCreateSubmit>
					</S.CommentCreateForm>
				</S.CommentCreate>
			);
		} else {
			return (
				<S.WalletConnectionWrapper>
					<span>{language.connectWalletToComment}</span>
					<S.WalletConnect>
						<WalletConnect />
					</S.WalletConnect>
				</S.WalletConnectionWrapper>
			);
		}
	}

	return <S.CommentCreateWrapper>{getCommentCreate()}</S.CommentCreateWrapper>;
}

export default function AssetDetailComments(props: IAProps) {
	type FinalCommentType = CommentType & { ownerDetail: OwnerType | OwnerListingType };

	const orProvider = useOrderBookProvider();

	const [comments, setComments] = React.useState<CommentType[] | null>(null);
	const [owners, setOwners] = React.useState<OwnerType[] | OwnerListingType[] | null>(null);

	const [finalComments, setFinalComments] = React.useState<FinalCommentType[] | null>(null);
	const [localUpdate, setLocalUpdate] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			setComments(COMMENTS);
		})();
	}, [props.asset, localUpdate]);

	React.useEffect(() => {
		(async function () {
			if (comments) {
				const owners = await getOwners(
					comments.map((comment: CommentType) => {
						return { creator: comment.owner };
					}),
					orProvider,
					props.asset as AssetDetailType
				);
				setOwners(owners);
			}
		})();
	}, [comments]);

	React.useEffect(() => {
		if (comments && owners) {
			const mergedData: FinalCommentType[] = comments.map((comment) => {
				const ownerDetail = (owners as OwnerType[]).find((owner: OwnerType) => owner.address === comment.owner);
				return { ...comment, ownerDetail };
			});
			setFinalComments(mergedData);
		}
	}, [comments, owners]);

	function getComments() {
		if (finalComments) {
			return (
				<>
					{finalComments.map((comment: any, index: number) => {
						return (
							<S.CommentLine key={index}>
								<S.CommentHeader>
									<OwnerInfo
										owner={comment.ownerDetail}
										asset={props.asset}
										isSaleOrder={false}
										handleUpdate={() => {}}
									/>
									{/* <S.StampWidget>
										<StampWidget
											assetId={props.asset.data.id}
											title={language.stampComment}
											stamps={null}
											hasStampedMessage={language.commentStamped}
										/>
									</S.StampWidget> */}
								</S.CommentHeader>
								<S.CommentDetail>
									<p>{comment.text}</p>
								</S.CommentDetail>
							</S.CommentLine>
						);
					})}
				</>
			);
		} else {
			return (
				<S.LoadingWrapper>
					<p>{`${language.loading}...`}</p>
				</S.LoadingWrapper>
			);
		}
	}

	return (
		<S.Wrapper className={'border-wrapper'}>
			<CommentCreate asset={props.asset} handleUpdate={() => setLocalUpdate((prev) => !prev)} />
			{getComments()}
		</S.Wrapper>
	);
}

const COMMENTS = [
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'hv4NIWngChaX8TkmyTdRS9CW1gquds3u9NlVoU9W9KM',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque.',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'hv4NIWngChaX8TkmyTdRS9CW1gquds3u9NlVoU9W9KM',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque.',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'hv4NIWngChaX8TkmyTdRS9CW1gquds3u9NlVoU9W9KM',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque.',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'hv4NIWngChaX8TkmyTdRS9CW1gquds3u9NlVoU9W9KM',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque.',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'hv4NIWngChaX8TkmyTdRS9CW1gquds3u9NlVoU9W9KM',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque.',
	},
	{
		tx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		rootTx: 'yCseB5x0cYyO9cQfYj4O83zUeAC9Y_x2K3v_9sn8_jU',
		owner: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ipsum nec velit euismod, non auctor justo scelerisque. Nulla facilisi. Sed quis neque eget eros fringilla congue. Vivamus dapibus lacus in velit malesuada',
	},
];
