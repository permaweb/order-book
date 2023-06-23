import React from 'react';

import { Loader } from 'components/atoms/Loader';
import { Paginator } from 'components/molecules/Paginator';
import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsList } from 'global/AssetsList';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function AssetsTable(props: IProps) {
	const scrollRef = React.useRef(null);

	const [currentPage, setCurrentPage] = React.useState(1);
	const [recordsPerPage] = React.useState(props.recordsPerPage);

	const lastRecordIndex = currentPage * recordsPerPage;
	const firstRecordIndex = lastRecordIndex - recordsPerPage;
	const currentRecords = props.assets ? props.assets.slice(firstRecordIndex, lastRecordIndex) : null;
	const nPages = props.assets ? Math.ceil(props.assets.length / recordsPerPage) : null;

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
						handleCursorFetch={(cursor: string | null) => props.handleCursorFetch(cursor)}
						cursors={props.cursors}
						useIcons={useIcons}
					/>
				);
			}
		}
	}

	function getTable() {
		if (!currentRecords) {
			return <Loader />;
		} else {
			if (currentRecords.length <= 0) {
				if (props.showNoResults) {
					return (
						<S.NoAssetsContainer>
							<p>{language.noAssets}</p>
						</S.NoAssetsContainer>
					);
				} else {
					return null;
				}
			} else if (currentRecords.length > 0) {
				switch (props.tableType) {
					case 'grid':
						return <AssetsGrid assets={currentRecords} />;
					case 'list':
						return <AssetsList assets={currentRecords} />;
					default:
						return null;
				}
			} else {
				if (props.showNoResults) {
					return (
						<S.NoAssetsContainer>
							<p>{language.noAssets}</p>
						</S.NoAssetsContainer>
					);
				}
			}
		}
	}

	return (
		<div className={'view-wrapper max-cutoff'}>
			<S.Wrapper>
				{props.header && <h2>{props.header}</h2>}
				{getPaginator(true)}
				{getTable()}
				{getPaginator(false)}
			</S.Wrapper>
		</div>
	);
}
