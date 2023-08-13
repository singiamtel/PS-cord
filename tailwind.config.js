/** @type {import('tailwindcss').Config} */
	module.exports = {
		content: [
			'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		],
		theme: {
			colors: {
				primary: '#0F4C81',
				secondary: '#F2F2F2',
				white: '#FFFFFF',
				black: '#000000',
				blue: {
					100: '#5865F2',
					200: '#404EED',
				},
				gray: {
					100: '#F6F6F6',
					150: '#B5B8BB',
					200: '#99AAB5',
					300: '#313338',
					350: '#36373D',
					375: '#383A40',
					400: '#23272A',
					450: '#404249',
					500: '#BDBDBD',
					600: '#2B2D31',
          700: '#1F2023',
				},
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Inter', 'sans-serif'],
				mono: ['Inter', 'sans-serif'],
			},
		},
		plugins: [],
	}
