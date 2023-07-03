import { language } from 'helpers/language';
import { WalletConnect } from 'wallet/WalletConnect';

import * as S from './styles';

export default function WalletBlock() {
	return (
		<S.Wrapper>
			<p>{language.walletNotConnected}</p>
			<WalletConnect />
		</S.Wrapper>
	);
}
