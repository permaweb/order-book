import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { ASSETS, DRE_NODES } from 'helpers/config';
import { language } from 'helpers/language';
import { DREObjectType } from 'helpers/types';
import { RootState } from 'store';
import * as dreActions from 'store/dre/actions';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

function DRESwitch() {
	const dispatch = useDispatch();

	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	function handlePress(node: DREObjectType) {
		dispatch(dreActions.setNode(node));
	}

	return (
		<S.DREWrapper>
			<p>{language.selectDRENode}</p>
			{DRE_NODES.map((node: DREObjectType, index: number) => {
				return (
					<Button
						key={index}
						type={'alt1'}
						active={node.label === dreReducer.label}
						label={node.label}
						handlePress={() => handlePress(node)}
						fullWidth
					/>
				);
			})}
		</S.DREWrapper>
	);
}

export default function Settings() {
	const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

	return (
		<CloseHandler active={dropdownOpen} callback={() => setDropdownOpen(false)} disabled={false}>
			<S.Wrapper>
				<IconButton
					type={'alt1'}
					src={ASSETS.settings}
					handlePress={() => setDropdownOpen(!dropdownOpen)}
					dimensions={{
						wrapper: 45,
						icon: 20,
					}}
				/>
				{dropdownOpen && (
					<S.Dropdown className={'border-wrapper'}>
						<DRESwitch />
					</S.Dropdown>
				)}
			</S.Wrapper>
		</CloseHandler>
	);
}
