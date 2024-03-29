import React from 'react';

import { Tabs } from 'components/molecules/Tabs';
import { DETAIL_ACTION_TAB_OPTIONS, DETAIL_ACTION_TABS } from 'helpers/config';

import { IADProps } from '../../types';

import { AssetDetailActivity } from './AssetDetailActivity';
import { AssetDetailComments } from './AssetDetailComments';
import { AssetDetailMarket } from './AssetDetailMarket';
import * as S from './styles';

export default function AssetDetailActions(props: IADProps) {
	const [currentTab, setCurrentTab] = React.useState<string>(DETAIL_ACTION_TABS[0]!.label);

	function getTab() {
		switch (currentTab) {
			case DETAIL_ACTION_TAB_OPTIONS.market:
				return (
					<AssetDetailMarket
						asset={props.asset}
						handleUpdate={props.handleUpdate}
						pendingResponse={props.pendingResponse}
						updating={props.updating}
					/>
				);
			case DETAIL_ACTION_TAB_OPTIONS.comments:
				return <AssetDetailComments asset={props.asset} />;
			case DETAIL_ACTION_TAB_OPTIONS.activity:
				return <AssetDetailActivity asset={props.asset} />;
			default:
				return null;
		}
	}

	return (
		<S.Wrapper>
			<Tabs onTabPropClick={(label: string) => setCurrentTab(label)} type={'alt1'}>
				{DETAIL_ACTION_TABS.map((tab: { label: string; icon?: string }, index: number) => {
					return <S.TabWrapper key={index} label={tab.label} icon={tab.icon ? tab.icon : null} />;
				})}
			</Tabs>
			<S.TabContent>{getTab()}</S.TabContent>
		</S.Wrapper>
	);
}
