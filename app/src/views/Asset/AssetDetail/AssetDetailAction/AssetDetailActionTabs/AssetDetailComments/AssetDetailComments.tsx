import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AssetDetailType, CommentDetailType, CommentType, CONTENT_TYPES } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { OwnerInfo } from 'global/OwnerInfo';
import { StampWidget } from 'global/StampWidget';
import { ASSETS, COMMENT_SPEC } from 'helpers/config';
import { language } from 'helpers/language';
import { FinalCommentType, OwnerListingType, OwnerType, ResponseType, SequenceType } from 'helpers/types';
import * as urls from 'helpers/urls';
import { getOwners, rankData } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { WalletConnect } from 'wallet/WalletConnect';

import { IAMProps, IAProps } from '../../../types';

import * as S from './styles';

const SEQUENCE_ITERATION = 5;

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
			try {
				await orProvider.orderBook.api.arClient.bundlr.ready();

				const contractId = await orProvider.orderBook.api.createAsset({
					content: comment,
					contentType: CONTENT_TYPES.textPlain,
					title: comment.length > 25 ? `${comment.substring(0, 25)}...` : comment,
					description: comment,
					type: COMMENT_SPEC.protcolId,
					topics: [COMMENT_SPEC.protcolId],
					owner: arProvider.walletAddress,
					ticker: COMMENT_SPEC.ticker,
					dataProtocol: COMMENT_SPEC.protcolId,
					dataSource: props.asset.data.id,
					renderWith: [COMMENT_SPEC.renderWith],
				});

				setLoading(false);
				setCommentResponse({
					status: true,
					message: `${language.replied}!`,
				});

				setTimeout(() => {
					setCommentResponse(null), setComment('');
				}, 1500);
				props.handleUpdate(contractId);
			} catch (e: any) {
				console.error(e);
				setLoading(false);
				setCommentResponse({
					status: true,
					message: language.errorOccurred,
				});
			}
		}
	}

	function getCommentCreate() {
		if (arProvider.walletAddress) {
			return (
				<S.CommentCreate>
					{owner && (
						<S.CommentHeader>
							<OwnerInfo
								owner={owner}
								asset={props.asset}
								isSaleOrder={false}
								handleUpdate={() => {}}
								loading={false}
							/>
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
				const comment = await orProvider.orderBook.api.getCommentData({ id: props.id });
				setComment(comment);
			}
		})();
	}, [props.id]);

	return (
		<S.CommentDetail>
			<p>{comment ? comment.text : null}</p>
		</S.CommentDetail>
	);
}

export default function AssetDetailComments(props: IAProps) {
	const navigate = useNavigate();

	const orProvider = useOrderBookProvider();

	const wrapperRef = React.useRef(null);

	const [comments, setComments] = React.useState<CommentType[] | null>(null);
	const [currentComments, setCurrentComments] = React.useState<CommentType[] | null>(null);
	const [finalComments, setFinalComments] = React.useState<FinalCommentType[] | null>(null);

	const [owners, setOwners] = React.useState<OwnerType[] | OwnerListingType[] | null>(null);

	const [localUpdate, setLocalUpdate] = React.useState<boolean>(false);

	const [sequence, setSequence] = React.useState<SequenceType>({
		start: SEQUENCE_ITERATION - (SEQUENCE_ITERATION - 1) - 1,
		end: SEQUENCE_ITERATION - 1,
	});

	const handleScroll = React.useCallback(() => {
		const element = wrapperRef.current;
		const rect = element?.getBoundingClientRect();

		if (rect && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
			if (comments && comments.length > sequence.end && finalComments && finalComments.length) {
				updateSequence();
			}
		}
	}, [sequence, finalComments, updateSequence]);

	function updateSequence() {
		setSequence({
			start: sequence.start + SEQUENCE_ITERATION,
			end: sequence.end + SEQUENCE_ITERATION,
		});
	}

	React.useEffect(() => {
		(async function () {
			if (props.asset && orProvider) {
				const commentsFetch = await orProvider.orderBook.api.getComments({ id: props.asset.data.id, cursor: null });
				const rankedComments = await rankData(
					commentsFetch.comments,
					orProvider.orderBook.env.arClient.warpDefault,
					orProvider.orderBook.env.arClient.arweavePost,
					window.arweaveWallet
				);
				setComments(rankedComments);
			}
		})();
	}, [props.asset, orProvider, localUpdate]);

	React.useEffect(() => {
		if (comments) {
			const existingData: any = finalComments ? [...finalComments] : [];
			const currentData: any = [...comments].splice(sequence.start, sequence.end + 1);
			setCurrentComments(
				[...existingData, ...currentData].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
			);
		}
	}, [comments, sequence]);

	React.useEffect(() => {
		(async function () {
			if (currentComments) {
				const owners = await getOwners(
					currentComments.map((comment: CommentType) => {
						return { creator: comment.owner };
					}),
					orProvider,
					props.asset as AssetDetailType
				);
				setOwners(owners);
			}
		})();
	}, [currentComments]);

	React.useEffect(() => {
		if (currentComments && owners) {
			const mergedData: FinalCommentType[] = currentComments.map((comment) => {
				const ownerDetail = (owners as OwnerType[]).find((owner: OwnerType) => owner.address === comment.owner);
				return { ...comment, ownerDetail };
			});
			setFinalComments(mergedData);
		}
	}, [currentComments, owners]);

	React.useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	async function handleUpdate(id: string) {
		if (orProvider) {
			const comment = await orProvider.orderBook.api.getAssetById({ id: id });
			const ownerDetail = (
				await getOwners([{ creator: comment.data.creator }], orProvider, props.asset as AssetDetailType)
			)[0];
			const newComment: FinalCommentType = {
				id: id,
				dataSource: props.asset.data.id,
				owner: comment.data.creator,
				ownerDetail,
			};
			setFinalComments([newComment, ...finalComments]);
		}
	}

	function getComments() {
		if (finalComments) {
			return finalComments.length > 0 ? (
				<S.CommentsWrapper>
					{finalComments.map((comment: any, index: number) => {
						return (
							<S.CommentLine key={index}>
								<S.CommentHeader>
									<OwnerInfo
										owner={comment.ownerDetail}
										asset={props.asset}
										isSaleOrder={false}
										handleUpdate={() => setLocalUpdate((prev) => !prev)}
										loading={!comment.ownerDetail}
									/>
								</S.CommentHeader>
								<CommentData id={comment.id} />
								<S.ActionsContainer>
									<StampWidget
										assetId={comment.id}
										title={language.stampComment}
										stamps={comment.stamps ? comment.stamps : null}
										hasStampedMessage={language.commentStamped}
										sm
									/>
									<S.Action>
										<IconButton
											type={'alt1'}
											src={ASSETS.details}
											handlePress={() => navigate(`${urls.asset}${comment.id}`)}
											tooltip={language.viewDetails}
											dimensions={{
												wrapper: 28.75,
												icon: 15,
											}}
										/>
									</S.Action>
								</S.ActionsContainer>
							</S.CommentLine>
						);
					})}
				</S.CommentsWrapper>
			) : null;
		} else {
			return (
				<S.LoadingWrapper>
					<p>{`${language.loading}...`}</p>
				</S.LoadingWrapper>
			);
		}
	}

	return (
		<S.Wrapper ref={wrapperRef} className={'border-wrapper'}>
			<CommentCreate asset={props.asset} handleUpdate={handleUpdate} />
			{getComments()}
		</S.Wrapper>
	);
}
