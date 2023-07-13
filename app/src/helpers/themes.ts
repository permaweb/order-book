import { DefaultTheme } from 'styled-components';

const DEFAULT = {
	neutral1: '#FFFFFF',
	neutral2: '#F7F7F7',
	neutral3: '#FAFAFC',
	neutral4: '#3A3A3A',
	neutral5: '#D0D7DE',
	neutral6: '#FAFAFA',
	neutral7: '#757582',
	neutral8: '#BDBDBD',
	neutral9: '#F9F9F9',
	neutral10: '#FAFAFA',
	neutral11: '#000000',
	neutral12: '#FAFAFA',
	neutral13: '#F7F7F7',
	neutral14: '#FFFFFF',
	neutral15: '#F8F5F3',
	neutral16: '#FFF9F6',
	primary: '#444C62',
	primary2: '#3B4154',
	primary3: '#333848',
	primary4: '#2A2E3C',
	primary5: '#212530',
	primary6: '#076FA9',
	alt1: '#ECE0D9',
	alt2: '#E4E4E4',
	alt3: '#FFDECF',
	alt4: '#ECE0D9',
	overlay1: '#2D2D2DC4',
	negative: '#D24646',
	negativeHover: '#F26969',
	negativeShadow: '#F27979',
	positive: '#26B426',
	positiveHover: '#209720',
	neutral: '#FFB600',
	transparent: 'rgba(255, 255, 255, 0)',
	semiTransparent1: '#FFFFFF',
	semiTransparent2: 'rgba(255, 255, 255, 0.1)',
	semiTransparent3: 'rgba(255, 255, 255, 0.3)',
	backdropShadow1: '#c4c4c4b0',
	backdropShadow2: '#dadadaba',
};
export const defaultTheme: DefaultTheme = {
	scheme: 'light',
	colors: {
		accordion: {
			background: DEFAULT.neutral1,
			hover: DEFAULT.neutral12,
			color: DEFAULT.neutral4,
		},
		border: {
			primary: DEFAULT.neutral5,
			alt1: DEFAULT.primary3,
			alt2: DEFAULT.primary4,
			alt3: DEFAULT.neutral6,
		},
		button: {
			primary: {
				background: DEFAULT.neutral1,
				border: DEFAULT.primary,
				hover: DEFAULT.primary2,
				label: DEFAULT.neutral1,
				active: {
					background: DEFAULT.primary,
					hover: DEFAULT.primary2,
					label: DEFAULT.neutral11,
				},
				disabled: {
					background: DEFAULT.neutral13,
					border: DEFAULT.neutral5,
					label: DEFAULT.neutral7,
				},
			},
			alt1: {
				background: DEFAULT.neutral1,
				border: DEFAULT.neutral2,
				hover: DEFAULT.alt2,
				label: DEFAULT.neutral11,
				active: {
					background: DEFAULT.alt2,
					border: DEFAULT.neutral2,
					hover: DEFAULT.neutral15,
					label: DEFAULT.neutral11,
				},
				disabled: {
					background: DEFAULT.neutral13,
					label: DEFAULT.neutral7,
				},
			},
			alt2: {
				background: DEFAULT.neutral1,
				border: DEFAULT.neutral5,
				hover: DEFAULT.alt2,
				label: DEFAULT.neutral1,
				active: {
					background: DEFAULT.alt1,
					hover: DEFAULT.alt2,
					label: DEFAULT.neutral1,
				},
				disabled: {
					background: DEFAULT.neutral13,
					border: DEFAULT.neutral5,
					label: DEFAULT.neutral7,
				},
			},
			alt3: {
				background: '#EC7F00',
				border: DEFAULT.neutral5,
				hover: '#EC7F00',
				label: 'white',
				active: {
					background: '#EC7F00',
					hover:  '#EC7F00',
					label: 'white',
				},
				disabled: {
					background: DEFAULT.neutral13,
					border: DEFAULT.neutral5,
					label: DEFAULT.neutral7,
				},
			},
			success: {
				background: DEFAULT.positive,
				hover: DEFAULT.positiveHover,
			},
			warning: {
				color: DEFAULT.negative,
				hover: DEFAULT.negativeHover,
			},
			disabled: DEFAULT.neutral4,
		},
		checkbox: {
			active: {
				background: DEFAULT.primary2,
			},
			background: DEFAULT.neutral1,
			hover: DEFAULT.neutral9,
			border: DEFAULT.neutral5,
			disabled: DEFAULT.neutral5,
		},
		container: {
			primary: {
				background: DEFAULT.neutral1,
				background1Gradient: DEFAULT.neutral6,
				background2Gradient: DEFAULT.alt3,
				backgroundGradient: DEFAULT.neutral10,
				hover: DEFAULT.neutral2,
			},
			alt1: {
				background: DEFAULT.neutral2,
			},
			alt2: {
				background: DEFAULT.neutral3,
			},
			alt3: {
				background: DEFAULT.alt1,
			},
			alt4: {
				background: DEFAULT.neutral4,
			},
			alt5: {
				background: DEFAULT.neutral8,
			},
			alt6: {
				background: DEFAULT.neutral5,
			},
			alt7: {
				background: DEFAULT.primary5,
			},
			alt8: {
				background: DEFAULT.positive,
			},
			alt9: {
				background: DEFAULT.neutral11,
			},
			alt10: {
				background: DEFAULT.neutral12,
			},
			alt11: {
				background: DEFAULT.neutral10,
			},
		},
		font: {
			primary: {
				base: DEFAULT.neutral1,
				alt1: DEFAULT.neutral4,
				alt2: DEFAULT.alt1,
				alt3: DEFAULT.alt2,
				alt4: DEFAULT.primary3,
				alt5: DEFAULT.primary4,
				alt6: DEFAULT.neutral7,
				alt7: DEFAULT.neutral8,
				alt8: DEFAULT.neutral11,
				alt9: DEFAULT.neutral15,
				alt10: DEFAULT.neutral5,
				alt11: DEFAULT.primary2,
				alt12: DEFAULT.primary6,
				active: {
					base: DEFAULT.primary,
					hover: DEFAULT.primary3,
				},
				invalid: DEFAULT.negative,
				positive: DEFAULT.positive,
				negative: DEFAULT.negative,
			},
		},
		form: {
			background: DEFAULT.neutral1,
			border: DEFAULT.neutral5,
			invalid: {
				outline: DEFAULT.negative,
				shadow: DEFAULT.negativeShadow,
			},
			valid: {
				outline: DEFAULT.neutral10,
				shadow: DEFAULT.neutral3,
			},
			disabled: {
				background: DEFAULT.neutral2,
				label: DEFAULT.neutral7,
			},
		},
		icon: {
			primary: {
				fill: DEFAULT.neutral1,
				hover: DEFAULT.neutral6,
				alt1: {
					fill: DEFAULT.neutral7,
				},
				alt2: {
					fill: DEFAULT.primary2,
				},
			},
			alt1: {
				fill: DEFAULT.primary,
			},
			alt2: {
				fill: DEFAULT.neutral,
			},
			inactive: DEFAULT.neutral4,
			info: {
				background: DEFAULT.negative,
				border: DEFAULT.neutral7,
			},
		},
		image: {
			shadow1: DEFAULT.backdropShadow1,
			shadow2: DEFAULT.backdropShadow2,
		},
		indicator: {
			active: {
				base: DEFAULT.primary,
				hover: DEFAULT.primary2,
			},
			inactive: {
				base: DEFAULT.neutral6,
				hover: DEFAULT.neutral8,
			},
		},
		loader: {
			primary: DEFAULT.primary2,
		},
		navigation: {
			footer: {
				background: DEFAULT.neutral6,
			},
			header: {
				background: DEFAULT.neutral10,
				backgroundNav: DEFAULT.semiTransparent1,
				logoFill: DEFAULT.neutral11,
			},
		},
		notification: {
			success: DEFAULT.positive,
			warning: DEFAULT.negative,
			neutral: DEFAULT.neutral,
		},
		overlay: {
			primary: DEFAULT.overlay1,
		},
		orderLine: {
			confirmed: {
				background: DEFAULT.neutral7,
			},
			default: {
				background: DEFAULT.neutral1,
			},
			header: {
				background: DEFAULT.neutral2,
			},
			ownerLine: {
				background: DEFAULT.neutral9,
			},
			pending: {
				background: DEFAULT.neutral2,
			},
			subheader: {
				background: DEFAULT.neutral1,
			},
		},
		shadow: {
			primary: DEFAULT.neutral9,
		},
		table: {
			placeholder: {
				background: DEFAULT.neutral9,
				backgroundStart: DEFAULT.transparent,
				backgroundSlide: DEFAULT.semiTransparent1,
				backgroundEnd: DEFAULT.transparent,
			},
			row: {
				active: {
					background: DEFAULT.neutral16,
					border: DEFAULT.primary4,
				},
			},
		},
		tabs: {
			active: DEFAULT.alt1,
			inactive: DEFAULT.neutral3,
			hover: DEFAULT.neutral3,
			alt1: {
				active: DEFAULT.alt1,
			},
		},
		transparent: DEFAULT.transparent,
		view: {
			background: DEFAULT.neutral6,
		},
		warning: DEFAULT.negative,
	},
	typography: {
		family: {
			primary: `'Inter', sans-serif`,
			alt1: `'Quantico', sans-serif`,
		},
		size: {
			h1: 'clamp(38px, 4.5vw, 62px)',
			h2: 'clamp(26px,3.15vw,38px)',
			lg: 'clamp(18px, 1.75vw, 26px)',
			base: '16px',
			small: '15px',
			xSmall: '14px',
			xxSmall: '13px',
		},
		weight: {
			thin: '100',
			extraLight: '200',
			light: '300',
			regular: '400',
			medium: '500',
			bold: '700',
		},
	},
};
