import React from 'react';
import { Link } from 'react-router-dom';

import { CollectionType } from 'permaweb-orderbook';

import { Paginator } from 'components/molecules/Paginator';
import { StampWidget } from 'global/StampWidget';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

// TODO: stamp counts
function CollectionRow(props: { collection: CollectionType; index: number }) {
	const redirect = `${urls.collection}${props.collection.id}`;

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
							<img src={props.collection.thumbnail} />
						</S.ThumbnailWrapper>
					</S.AWrapper>
					<S.ATitle>
						<Link to={redirect}>{props.collection.name}</Link>
					</S.ATitle>
				</S.AFlex>
				<S.SFlex>
					<S.SCValue>
						<StampWidget assetId={props.collection.name} title={props.collection.name} stamps={null} />
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

	return props.collections ? (
		<S.Wrapper>
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
				{getPaginator(true)}
				<>
					{props.collections.map((collection: CollectionType, index: number) => {
						return <CollectionRow key={index} collection={collection} index={index + 1} />;
					})}
				</>
				{getPaginator(false)}
			</S.Body>
		</S.Wrapper>
	) : null;
}