import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { AssetType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Modal } from 'components/molecules/Modal';
import { AssetData } from 'global/AssetData';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';
import * as windowUtils from 'helpers/window';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';

export default function Search() {
	const orProvider = useOrderBookProvider();

	const [value, setValue] = React.useState<string>('');
	const [loading, setLoading] = React.useState<boolean>(false);
	const [results, setResults] = React.useState<AssetType[]>([]);

	const [desktop, setDesktop] = React.useState(windowUtils.checkDesktop());
	const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	React.useEffect(() => {
		setTimer(
			setTimeout(() => {
				if (value) {
					handleSearch('timer');
				} else {
					handleClear();
				}
			}, 500)
		);

		return () => clearTimeout(timer);
	}, [value]);

	function handleWindowResize() {
		if (windowUtils.checkDesktop()) {
			setDesktop(true);
		} else {
			setDesktop(false);
		}
	}

	windowUtils.checkWindowResize(handleWindowResize);

	const [currentPage, setCurrentPage] = React.useState(1);
	const resultsPerPage = 10;

	function handleChange(value: string) {
		clearTimeout(timer);
		setValue(value);
	}

	async function handleSearch(e: any) {
		if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click' || e === 'timer') {
			if (orProvider.orderBook) {
				setLoading(true);
				const searchResults = await orProvider.orderBook.api.search({
					ids: null,
					owner: null,
					uploader: null,
					cursor: null,
					reduxCursor: null,
					walletAddress: null,
					term: value,
				});
				setResults(searchResults.assets);
				setLoading(false);
			}
		}
	}

	function handleClear() {
		setValue('');
		setResults([]);
		setSearchOpen(false);
		setCurrentPage(1);
	}

	function handleNextPage() {
		setCurrentPage(currentPage + 1);
	}

	function handlePreviousPage() {
		setCurrentPage(currentPage - 1);
	}

	function getResults() {
		if (loading) {
			return (
				<S.SearchResultsWrapper>
					<S.LoadingWrapper>
						<p>{`${language.loading}...`}</p>
					</S.LoadingWrapper>
				</S.SearchResultsWrapper>
			);
		}
		if (results && results.length > 0) {
			const startIndex = (currentPage - 1) * resultsPerPage;
			const endIndex = startIndex + resultsPerPage;
			const currentResults = results.slice(startIndex, endIndex);

			return (
				<S.SearchResultsWrapper>
					{currentResults.map((result: AssetType, index: number) => (
						<Link key={index} to={`${urls.asset}${result.data.id}`} onClick={handleClear}>
							<S.SearchResult>
								<S.AssetData>
									<AssetData asset={result} preview />
								</S.AssetData>
								<S.DetailLine>
									<p>{result.data.title}</p>
								</S.DetailLine>
							</S.SearchResult>
						</Link>
					))}
					{currentResults.length > 1 && (
						<S.SPaginator>
							<Button
								label={language.previous}
								type={'primary'}
								handlePress={handlePreviousPage}
								disabled={startIndex === 0}
								noMinWidth
							/>
							<Button
								label={language.next}
								type={'primary'}
								handlePress={handleNextPage}
								disabled={endIndex >= results.length}
								noMinWidth
							/>
						</S.SPaginator>
					)}
				</S.SearchResultsWrapper>
			);
		} else return null;
	}

	function getSearch() {
		return (
			<S.Wrapper>
				<S.SearchWrapper>
					<S.SearchIcon disabled={false}>
						<ReactSVG src={ASSETS.search} />
					</S.SearchIcon>
					<S.SearchInput
						type={'text'}
						placeholder={language.searchAssets}
						value={value}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
						onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await handleSearch(e)}
						disabled={false}
						hasResults={(results && results.length > 0) || loading}
					/>
					<S.ClearWrapper>
						<IconButton
							src={ASSETS.close}
							type={'primary'}
							handlePress={() => handleClear()}
							disabled={!value}
							warning
							sm
						/>
					</S.ClearWrapper>
				</S.SearchWrapper>
				{getResults()}
			</S.Wrapper>
		);
	}

	return desktop ? (
		getSearch()
	) : (
		<>
			<IconButton type={'alt1'} src={ASSETS.search} handlePress={() => setSearchOpen(!searchOpen)} />
			{searchOpen && (
				<Modal
					header={null}
					handleClose={() => {
						handleClear();
					}}
				>
					{getSearch()}
				</Modal>
			)}
		</>
	);
}
