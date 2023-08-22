import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { IconButton } from 'components/atoms/IconButton';
import { Search } from 'components/organisms/Search';
import { ASSETS } from 'helpers/config';
import { STYLING } from 'helpers/styling';
import * as urls from 'helpers/urls';
import { checkDesktop, checkWindowResize, hideDocumentBody, showDocumentBody } from 'helpers/window';
import { WalletConnect } from 'wallet/WalletConnect';

import * as S from './styles';

export default function Header() {
	const [open, setOpen] = React.useState(checkDesktop(STYLING.cutoffs.initialWrapper));
	const [desktop, setDesktop] = React.useState(checkDesktop(STYLING.cutoffs.initialWrapper));

	function handleWindowResize() {
		if (checkDesktop(STYLING.cutoffs.initialWrapper)) {
			setDesktop(true);
			setOpen(true);
		} else {
			setDesktop(false);
			setOpen(false);
		}
	}

	function handleNavStatus() {
		checkDesktop(STYLING.cutoffs.initialWrapper) ? setOpen(true) : setOpen(!open);
	}

	checkWindowResize(handleWindowResize);

	if (open && !checkDesktop(STYLING.cutoffs.initialWrapper)) {
		hideDocumentBody();
	} else {
		showDocumentBody();
	}

	function navList() {
		return (
			<S.NC>
				<S.SC>
					<S.Connect show={true}>
						<WalletConnect callback={() => setOpen(!open)} />
					</S.Connect>
				</S.SC>
			</S.NC>
		);
	}

	function getNav() {
		if (desktop) {
			return navList();
		} else {
			return (
				<>
					<S.NCMobile>
						<S.MenuContainer>
							<S.Menu>
								<IconButton
									type={'alt1'}
									warning={open}
									src={open ? ASSETS.close : ASSETS.menu}
									handlePress={handleNavStatus}
								/>
							</S.Menu>
						</S.MenuContainer>
					</S.NCMobile>
				</>
			);
		}
	}

	return (
		<S.Wrapper>
			<S.NavWrapper>
				<S.NavContainer>
					<S.LogoContainer>
						<Link to={urls.base} onClick={() => setOpen(false)}>
							<S.LogoContent>
								<ReactSVG src={ASSETS.logo} />
							</S.LogoContent>
						</Link>
					</S.LogoContainer>
					<S.SearchWrapper>
						<Search />
					</S.SearchWrapper>
					{getNav()}
				</S.NavContainer>
			</S.NavWrapper>
			{!desktop && open && <S.OpenContainer>{navList()}</S.OpenContainer>}
		</S.Wrapper>
	);
}
