import { DefaultTheme } from 'styled-components';

const DEFAULT = {
	neutral1: '#FFFFFF',
	neutral2: '#F8F7F7',
	neutral3: '#FCFAFA',
	neutral4: '#3A3A3A',
	neutral5: '#D0D7DE',
	neutral6: '#FFDECF',
	neutral7: '#757582',
	neutral8: '#757582',
	neutral9: '#FCFAFA',
	neutral10: '#757582',
	neutral11: '#757582',
	neutral12: '#FAFAFA',
	neutral13: '#F7F7F7',
	neutral14: '#FFFFFF',
	neutral15: '#757582',
	neutral16: '#FFF9F6',
	primary: '#444C62',
	primary2: '#3B4154',
	primary3: '#333848',
	primary4: '#2A2E3C',
	primary5: '#212530',
	alt1: '#FF7A41',
	alt2: '#FF621F',
	overlay1: 'rgba(255, 255, 255, 0.75)',
	negative: '#D24646',
	negativeHover: '#F26969',
	negativeShadow: '#F27979',
	positive: '#48D67C',
	positiveHover: '#37FB72',
	neutral: '#FFB600',
	transparent: 'rgba(255, 255, 255, 0)',
	semiTransparent1: 'rgba(255, 255, 255, 0.65)',
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
				background: DEFAULT.primary,
				border: DEFAULT.primary,
				hover: DEFAULT.primary2,
				label: DEFAULT.neutral1,
				active: {
					background: DEFAULT.primary,
					hover: DEFAULT.primary2,
					label: DEFAULT.neutral1,
				},
				disabled: {
					background: DEFAULT.neutral5,
					border: DEFAULT.neutral3,
					label: DEFAULT.neutral7,
				},
			},
			alt1: {
				background: DEFAULT.alt1,
				border: DEFAULT.transparent,
				hover: DEFAULT.alt2,
				label: DEFAULT.neutral1,
				active: {
					background: DEFAULT.alt2,
					hover: DEFAULT.alt1,
					label: DEFAULT.primary,
				},
				disabled: {
					background: DEFAULT.neutral5,
					border: DEFAULT.neutral3,
					label: DEFAULT.neutral7,
				},
			},
			alt2: {
				background: DEFAULT.neutral1,
				border: DEFAULT.neutral5,
				hover: DEFAULT.neutral2,
				label: DEFAULT.primary,
				active: {
					background: DEFAULT.primary3,
					hover: DEFAULT.primary2,
					label: DEFAULT.neutral1,
				},
				disabled: {
					background: DEFAULT.neutral13,
					border: DEFAULT.neutral3,
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
				background1: DEFAULT.neutral1,
				background2: DEFAULT.neutral6,
				background3: DEFAULT.primary,
				hover: DEFAULT.neutral9,
			},
			alt1: {
				background: DEFAULT.semiTransparent1,
			},
			alt2: {
				background: DEFAULT.neutral3,
			},
			alt3: {
				background: DEFAULT.neutral9,
			},
			alt4: {
				background: DEFAULT.neutral4,
			},
			alt5: {
				background: DEFAULT.neutral11,
			},
			alt6: {
				background: DEFAULT.neutral5,
			},
			alt7: {
				background: DEFAULT.primary5,
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
			border: DEFAULT.neutral6,
			invalid: {
				outline: DEFAULT.negative,
				shadow: DEFAULT.negativeShadow,
			},
			valid: {
				outline: DEFAULT.primary3,
				shadow: DEFAULT.primary4,
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
				fill: DEFAULT.neutral4,
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
				background: DEFAULT.neutral1,
			},
			header: {
				background: DEFAULT.primary,
				backgroundNav: DEFAULT.semiTransparent2,
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
			background: DEFAULT.neutral1,
		},
		warning: DEFAULT.negative,
	},
	typography: {
		family: {
			primary: `'Inter', sans-serif`,
			alt1: `'Orbitron', sans-serif;`,
		},
		size: {
			h1: 'clamp(38px, 4.5vw, 62px)',
			h2: 'clamp(26px,3.15vw,38px)',
			lg: '18px',
			base: '16px',
			small: '15px',
			xSmall: '14px',
			xxSmall: '13px',
		},
		weight: {
			regular: '400',
			medium: '500',
			bold: '600',
		},
	},
};
