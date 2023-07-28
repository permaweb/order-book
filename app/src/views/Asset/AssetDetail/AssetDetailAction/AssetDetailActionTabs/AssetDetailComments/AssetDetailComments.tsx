import React from 'react';

import { AssetDetailType, CommentDetailType, CommentType, CONTENT_TYPES } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { OwnerInfo } from 'global/OwnerInfo';
import { StampWidget } from 'global/StampWidget';
import { COMMENT_SPEC } from 'helpers/config';
import { language } from 'helpers/language';
import { FinalCommentType, OwnerListingType, OwnerType, ResponseType, WalletEnum } from 'helpers/types';
import { getOwners, rankData } from 'helpers/utils';
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

	async function handleSubmit(e: any) {
		if (arProvider.walletAddress && orProvider.orderBook) {
			e.preventDefault();
			e.stopPropagation();
			setLoading(true);

			if (arProvider.walletType === WalletEnum.arweaveApp) {
				alert(language.arweaveAppNotSupportedError);
				setLoading(false);
			} else {
				try {
					await orProvider.orderBook.api.arClient.bundlr.ready();
					const contractId = await orProvider.orderBook.api.createAsset({
						content: comment,
						contentType: CONTENT_TYPES.textPlain,
						title: `${props.asset.data.title} comment - ${arProvider.walletAddress}`,
						description: comment,
						type: COMMENT_SPEC.protcolId,
						topics: [COMMENT_SPEC.protcolId],
						owner: arProvider.walletAddress,
						ticker: COMMENT_SPEC.ticker,
						dataProtocol: COMMENT_SPEC.protcolId,
						dataSource: props.asset.data.id,
						renderWith: [COMMENT_SPEC.renderWith],
					});
					console.log(`Contract: ${contractId}`);
					setLoading(false);
					setCommentResponse({
						status: true,
						message: `${language.replied}!`,
					});
				} catch (e: any) {
					console.error(e);
					setLoading(false);
					setCommentResponse({
						status: true,
						message: language.errorOccurred,
					});
				}
			}

			setTimeout(() => {
				setCommentResponse(null), setComment('');
			}, 1500);
			props.handleUpdate();
		}
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

function CommentData(props: { id: string }) {
	const orProvider = useOrderBookProvider();

	const [comment, setComment] = React.useState<CommentDetailType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.id) {
				let comment = await orProvider.orderBook.api.getComment({ id: props.id });
				setComment(comment);
			}
		})();
	}, [props.id]);

	return (
		<S.CommentDetail>
			<p>{comment ? comment.text : `${language.loading}...`}</p>
		</S.CommentDetail>
	);
}

export default function AssetDetailComments(props: IAProps) {
	const orProvider = useOrderBookProvider();

	const [comments, setComments] = React.useState<CommentType[] | null>(null);
	const [owners, setOwners] = React.useState<OwnerType[] | OwnerListingType[] | null>(null);

	const [finalComments, setFinalComments] = React.useState<FinalCommentType[] | null>(null);
	const [localUpdate, setLocalUpdate] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				const commentsFetch = await orProvider.orderBook.api.getComments({ id: props.asset.data.id });
				const rankedComments = await rankData(
					commentsFetch.comments,
					orProvider.orderBook.env.arClient.warpDefault,
					orProvider.orderBook.env.arClient.arweavePost,
					window.arweaveWallet
				);
				setComments(rankedComments);
			}
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
										handleUpdate={() => setLocalUpdate((prev) => !prev)}
									/>
								</S.CommentHeader>
								<CommentData id={comment.id} />
								<S.StampWidget>
									<StampWidget
										assetId={comment.id}
										title={language.stampComment}
										stamps={comment.stamps ? comment.stamps : null}
										hasStampedMessage={language.commentStamped}
										sm
									/>
								</S.StampWidget>
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
			<CommentCreate
				asset={props.asset}
				handleUpdate={() => {
					setFinalComments(null);
					setLocalUpdate((prev) => !prev);
				}}
			/>
			{getComments()}
		</S.Wrapper>
	);
}
