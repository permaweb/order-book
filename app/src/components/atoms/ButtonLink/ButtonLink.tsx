import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function ButtonLink(props: IProps) {
	const buttonStyle = getType();
	const StyledButton = buttonStyle.wrapper;
	const StyledIcon = buttonStyle.icon;

	function getType() {
		let buttonObj: {
			wrapper: any;
			icon: any;
		};
		switch (props.type) {
			case 'alt1':
				buttonObj = {
					wrapper: S.Alt1,
					icon: S.IconSecondary,
				};
				return buttonObj;
			case 'alt2':
				buttonObj = {
					wrapper: S.Alt2,
					icon: S.IconAlt2,
				};
				return buttonObj;
			default:
				buttonObj = {
					wrapper: S.Primary,
					icon: S.IconPrimary,
				};
				return buttonObj;
		}
	}

	function getLabel() {
		return (
			<>
				{props.icon && props.iconLeftAlign && (
					<StyledIcon disabled={props.disabled} active={props.active} leftAlign={props.iconLeftAlign}>
						<ReactSVG src={props.icon} />
					</StyledIcon>
				)}
				<span>{props.label}</span>
				{props.icon && !props.iconLeftAlign && (
					<StyledIcon disabled={props.disabled} active={props.active} leftAlign={props.iconLeftAlign}>
						<ReactSVG src={props.icon} />
					</StyledIcon>
				)}
			</>
		);
	}

	return (
		<S.Wrapper>
			<Link to={props.href} target={props.targetBlank ? '_blank' : ''}>
				<StyledButton
					tabIndex={props.noFocus ? -1 : 0}
					disabled={props.disabled}
					active={props.active}
					useMaxWidth={props.useMaxWidth}
					noMinWidth={props.noMinWidth}
					width={props.width}
					height={props.height}
					data-testid={props.testingCtx}
				>
					{props.loading ? `${language.loading} ...` : getLabel()}
				</StyledButton>
			</Link>
		</S.Wrapper>
	);
}
