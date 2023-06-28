import React from 'react';
import { ReactSVG } from 'react-svg';

import { IconButton } from 'components/atoms/IconButton';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

// TODO: mobile search
export default function Search(props: IProps) {
	const [value, setValue] = React.useState<string>('');
	const [results, setResults] = React.useState<any[]>([]);
	const orProvider = useOrderBookProvider();

	function handleChange(value: string) {
		setValue(value);
	}

	async function handleSearch(e: any) {
		if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
			console.log(`Search: ${value}`);
			if (orProvider.orderBook) {
				let searchResults = await orProvider.orderBook.api.search({
					ids: null,
					owner: null,
					uploader: null,
					cursor: null,
					reduxCursor: null,
					walletAddress: null,
					term: value,
				});

				// setResults(searchResults);
			}
		}
	}

	function handleClear() {
		setValue('');
	}

	function getResults() {
		if (results && results.length > 0) {
		} else {
			return null;
		}
	}

	return (
		<S.Wrapper>
			<S.SearchWrapper>
				<S.SearchIcon disabled={false}>
					<ReactSVG src={ASSETS.search} />
				</S.SearchIcon>
				<S.SearchInput
					type={'text'}
					placeholder={language.search}
					value={value}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
					onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await handleSearch(e)}
					disabled={false}
				/>
				{/* <S.ClearWrapper>
					<IconButton
						src={ASSETS.close}
						type={'primary'}
						handlePress={() => handleClear()}
						disabled={!value}
						warning
						sm
					/>
				</S.ClearWrapper> */}
			</S.SearchWrapper>
			<S.SearchResultsWrapper>{getResults()}</S.SearchResultsWrapper>
		</S.Wrapper>
	);
}
