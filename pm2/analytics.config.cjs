module.exports = {
	apps: [
		{
			name: 'surf-analytics',
			script: 'dist/entrypoints/analytics.js',
			error_file: './logfiles/analytics/err.log',
			out_file: './logfiles/analytics/out.log',
			log_date_format: 'YYYY-MM-DD HH:mm',
		},
	],
}
