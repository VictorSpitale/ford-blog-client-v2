module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		},
		fontFamily: {
			'title': ['Josefin Sans', 'sans-serif'],
			'text': ['Varela Round', 'sans-serif']
		},
		extend: {
			colors: {
				'primary': {
					100: '#ccd6e4',
					200: '#99aec9',
					300: '#6685ae',
					400: '#335d93',
					500: '#003478',
					600: '#023375',
				},
				'secondary': {
					100: '#f2eadd',
					200: '#e5d5bc',
					300: '#d9c19a',
					400: '#ccac79',
					500: '#bf9757',
					600: '#b79156',
				},
				'dark': {
					100: '#023375',
					200: '#09326a',
					300: '#103260',
					400: '#173055',
					500: '#343d4f',
					600: '#222f45',
				}
			},
		},
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
	],
};
