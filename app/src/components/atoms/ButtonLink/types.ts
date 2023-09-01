import React from 'react';

import { ButtonType } from 'helpers/types';

export interface IProps {
	type: ButtonType;
	label: string | number | React.ReactNode;
	href: string;
	targetBlank?: boolean;
	disabled?: boolean;
	active?: boolean;
	loading?: boolean;
	icon?: string;
	iconLeftAlign?: boolean;
	noFocus?: boolean;
	fullWidth?: boolean;
	useMaxWidth?: boolean;
	noMinWidth?: boolean;
	width?: number;
	height?: number;
	useCallback?: () => void;
	testingCtx?: string;
}
