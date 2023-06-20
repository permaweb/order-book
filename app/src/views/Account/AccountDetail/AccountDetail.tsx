import { AssetsGrid } from 'global/AssetsGrid';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function AccountDetail(props: IProps) {
    return (
        <div className={'view-wrapper max-cutoff'}>
            <S.Wrapper>
                <h2>{language.myAssets}</h2>
                <AssetsGrid assets={props.assets} />
            </S.Wrapper>
        </div>
    )
}