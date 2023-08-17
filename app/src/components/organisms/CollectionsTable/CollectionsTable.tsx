import React from 'react';
import { Link } from 'react-router-dom';

import { CollectionType, getTxEndpoint } from 'permaweb-orderbook';

import { Paginator } from 'components/molecules/Paginator';
import { StampWidget } from 'components/organisms/StampWidget';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';
import { checkAddress } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

function CollectionRow(props: { collection: CollectionType; index: number }) {
	const redirect = `${urls.collection}${props.collection.id}`;

	let thumbnail: string = '';
	if (props.collection.thumbnail) {
		thumbnail = checkAddress(props.collection.thumbnail)
			? getTxEndpoint(props.collection.thumbnail)
			: props.collection.thumbnail;
	}

	return (
		<S.PICWrapper>
			<S.PCWrapper>
				<S.AFlex>
					<p>{props.index}</p>
					<S.AWrapper>
						<S.CollectionLink>
							<Link to={redirect} />
						</S.CollectionLink>
						<S.ThumbnailWrapper>
							<img src={thumbnail} />
						</S.ThumbnailWrapper>
					</S.AWrapper>
					<S.ATitle>
						<Link to={redirect}>{props.collection.name}</Link>
					</S.ATitle>
				</S.AFlex>
				<S.SFlex>
					<S.SCValue>
						<StampWidget
							assetId={props.collection.id}
							title={props.collection.name}
							stamps={props.collection.stamps ? props.collection.stamps : null}
							hasStampedMessage={language.collectionStamped}
						/>
					</S.SCValue>
				</S.SFlex>
			</S.PCWrapper>
		</S.PICWrapper>
	);
}

export default function CollectionsTable(props: IProps) {
	const scrollRef = React.useRef(null);

	const [currentPage, setCurrentPage] = React.useState(1);
	const [recordsPerPage] = React.useState(props.recordsPerPage);

	const [currentRecords, setCurrentRecords] = React.useState<CollectionType[] | null>(null);
	const [nPages, setNPages] = React.useState<number | null>(null);

	const lastRecordIndex = currentPage * recordsPerPage;
	const firstRecordIndex = lastRecordIndex - recordsPerPage;

	React.useEffect(() => {
		if (props.collections) {
			setCurrentRecords(props.collections ? props.collections.slice(firstRecordIndex, lastRecordIndex) : null);
			setNPages(props.collections ? Math.ceil(props.collections.length / recordsPerPage) : null);
		}
	}, [props.collections]);

	function getPaginator(useIcons: boolean) {
		if (currentRecords && nPages) {
			if (currentRecords.length <= 0) {
				return null;
			} else {
				return (
					<Paginator
						scrollRef={scrollRef}
						nPages={nPages}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						showPageNumbers={props.showPageNumbers}
						handleCursorFetch={(cursor: string | null) => {
							props.handlePageFetch(cursor);
						}}
						cursors={{
							next: props.cursors.next,
							previous: props.cursors.previous,
						}}
						useIcons={useIcons}
					/>
				);
			}
		}
	}

	return props.collections !== null ? (
		<S.Wrapper ref={scrollRef}>
			<S.Header>
				<p>{language.collections.toUpperCase()}</p>
			</S.Header>
			<S.Body>
				<S.HSection1>
					<S.Rank>
						<p>{language.rank}</p>
					</S.Rank>
					<S.Collection>
						<p>{language.collection}</p>
					</S.Collection>
					<S.SHeaderFlex>
						<S.StampCount>
							<p>{language.stampCount}</p>
						</S.StampCount>
					</S.SHeaderFlex>
				</S.HSection1>
				<S.PWrapper>{getPaginator(true)}</S.PWrapper>
				<>
					{props.collections.map((collection: CollectionType, index: number) => {
						return <CollectionRow key={index} collection={collection} index={index + 1} />;
					})}
				</>
				<S.PWrapper>{getPaginator(false)}</S.PWrapper>
			</S.Body>
		</S.Wrapper>
	) : null;
}
