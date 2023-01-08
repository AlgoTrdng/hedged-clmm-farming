module.exports = {
	apps: [
		{
			name: 'surf-farming',
			script: 'dist/entrypoints/bot.js',
			error_file: './logfiles/bot/err.log',
			out_file: './logfiles/bot/out.log',
			log_date_format: 'YYYY-MM-DD HH:mm',
		},
	],
}
