import { Carousel } from 'react-responsive-carousel';

import { IconButton } from 'components/atoms/IconButton';
import { ASSETS } from 'helpers/config';
import { StepType } from 'helpers/types';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

import * as S from './styles';
import { IProps } from './types';

export default function _Carousel(props: IProps) {
	function handleClick(onClickHandler: any, action: StepType) {
		if (props.callback && !props.callback.disabled) {
			props.callback.fn(action);
		}
		onClickHandler();
	}

	function getAction(step: StepType, clickHandler: any, disabled: boolean) {
		const Action = step === 'prev' ? S.PrevAction : S.NextAction;
		if (props.data && props.data.length > 1) {
			return (
				<Action>
					<IconButton
						src={step === 'prev' ? ASSETS.arrowPrevious : ASSETS.arrowNext}
						type={'alt1'}
						handlePress={() => handleClick(clickHandler, step === 'prev' ? 'prev' : 'next')}
						dimensions={{ wrapper: 25, icon: 11 }}
						disabled={disabled}
					/>
				</Action>
			);
		} else {
			return null;
		}
	}

	return props.data ? (
		<S.Content>
			<S.Header>
				<S.Header1>{props.title}</S.Header1>
			</S.Header>
			<S.Body>
				<Carousel
					autoPlay={false}
					interval={0}
					showArrows={true}
					showStatus={false}
					showThumbs={false}
					infiniteLoop={false}
					stopOnHover={false}
					useKeyboardArrows={false}
					swipeScrollTolerance={100}
					swipeable={true}
					emulateTouch={true}
					preventMovementUntilSwipeScrollTolerance={true}
					renderArrowPrev={(onClickHandler, hasPrevious) => {
						return getAction('prev', onClickHandler, !hasPrevious);
					}}
					renderArrowNext={(onClickHandler, hasNext) => {
						return getAction('next', onClickHandler, !hasNext);
					}}
				>
					{props.data}
				</Carousel>
			</S.Body>
		</S.Content>
	) : null;
}
