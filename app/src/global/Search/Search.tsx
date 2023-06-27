import React from 'react';
import { ReactSVG } from 'react-svg';

import { IconButton } from 'components/atoms/IconButton';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

// TODO: mobile search
export default function Search(props: IProps) {
	const [value, setValue] = React.useState<string>('');

	function handleChange(value: string) {
		setValue(value);
	}

	function handleSearch(e: any) {
		if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
			console.log(`Search: ${value}`);
		}
	}

	function handleClear() {
		setValue('');
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
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleSearch(e)}
					disabled={false}
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
		</S.Wrapper>
	);
}
