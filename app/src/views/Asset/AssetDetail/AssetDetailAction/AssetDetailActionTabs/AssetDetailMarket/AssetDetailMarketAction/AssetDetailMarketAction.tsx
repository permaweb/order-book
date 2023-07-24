import React from 'react';

import { Tabs } from 'components/organisms/Tabs';
import { AssetBuy } from 'global/AssetBuy';
import { AssetSell } from 'global/AssetSell';
import { DETAIL_MARKET_ACTION_TABS, DETAIL_MARKET_TAB_OPTIONS } from 'helpers/config';

import * as S from './styles';
import { IProps } from './types';

export default function AssetDetailMarketAction(props: IProps) {
	const [currentTab, setCurrentTab] = React.useState<string>(DETAIL_MARKET_ACTION_TABS[0]!.label);

	function getTab() {
		switch (currentTab) {
			case DETAIL_MARKET_TAB_OPTIONS.buy:
				return <AssetBuy asset={props.asset} updateAsset={props.updateAsset} />;
			case DETAIL_MARKET_TAB_OPTIONS.sell:
				return <AssetSell asset={props.asset} updateAsset={props.updateAsset} />;
			default:
				return null;
		}
	}

	return (
		<S.Wrapper>
			<Tabs onTabPropClick={(label: string) => setCurrentTab(label)} type={'alt1'}>
				{DETAIL_MARKET_ACTION_TABS.map((tab: { label: string; icon?: string }, index: number) => {
					return <S.TabWrapper key={index} label={tab.label} icon={tab.icon ? tab.icon : null} />;
				})}
			</Tabs>
			<S.TabContent>{getTab()}</S.TabContent>
		</S.Wrapper>
	);
}
