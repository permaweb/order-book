import React from 'react';

export interface IProps {
	title: string;
	data: React.ReactElement[] | null;
	callback?: {
		fn: any;
		disabled: boolean;
	};
}
