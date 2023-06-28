import React from 'react';

import { Tabs } from 'components/organisms/Tabs';
import { AssetBuy } from 'global/AssetBuy';
import { AssetSell } from 'global/AssetSell';
import { ACTION_TABS, TAB_OPTIONS } from 'helpers/config';

import * as S from './styles';
import { IProps } from './types';

export default function AssetDetailAction(props: IProps) {
	const [currentTab, setCurrentTab] = React.useState<string>(ACTION_TABS[0]!.label);

	function getTab() {
		switch (currentTab) {
			case TAB_OPTIONS.buy:
				return <AssetBuy asset={props.asset} />;
			case TAB_OPTIONS.sell:
				return <AssetSell asset={props.asset} />;
			default:
				return null;
		}
	}

	return (
		<S.Wrapper>
			<Tabs onTabPropClick={(label: string) => setCurrentTab(label)}>
				{ACTION_TABS.map((tab: { label: string }, index: number) => {
					return <S.TabWrapper key={index} label={tab.label} />;
				})}
			</Tabs>
			<S.TabContent>{getTab()}</S.TabContent>
		</S.Wrapper>
	);
}
