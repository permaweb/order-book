module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['import', '@typescript-eslint', 'simple-import-sort'],
	extends: [],
	rules: {
		'import/no-duplicates': 'error',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
	},
	overrides: [
		{
			files: ['*.js', '*.ts'],
			rules: {
				'simple-import-sort/imports': [
					'error',
					{
						groups: [
							['^((?!\\.).)*$'],
							[
								'^(@|clients)(/.*|$)',
								'^(@|collections)(/.*|$)',
								'^(@|filters)(/.*|$)',
								'^(@|gql)(/.*|$)',
								'^(@|helpers)(/.*|$)',
								'^(@|search)(/.*|$)',
								'^(@|tests)(/.*|$)',
								'^(@|workers)(/.*|$)',
							],
							['^\\u0000'],
							['^\\.\\.(?!/?$)', '^\\.\\./?$'],
							['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						],
					},
				],
				'react-hooks/exhaustive-deps': 'off',
			},
		},
	],
};
