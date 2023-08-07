import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/atoms/Button';
import { DRE_NODES } from 'helpers/config';
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
		window.location.reload();
	}

	return (
		<S.DREWrapper>
			<p>{language.selectDRENode}</p>
			{DRE_NODES.map((node: DREObjectType, index: number) => {
				return (
					<Button
						key={index}
						type={'primary'}
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
				<S.Action onClick={() => setDropdownOpen(!dropdownOpen)}>{language.settings}</S.Action>
				{dropdownOpen && (
					<S.Dropdown className={'border-wrapper'}>
						<DRESwitch />
					</S.Dropdown>
				)}
			</S.Wrapper>
		</CloseHandler>
	);
}
