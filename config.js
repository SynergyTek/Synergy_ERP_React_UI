const colors = require("tailwindcss/colors");
const primary = colors.blue,
	secondary = colors.gray,
	info = colors.indigo,
	danger = colors.red,
	success = colors.green

module.exports = {
	app: {
		name: "DMS"
	},
	safelist: [
		{
			pattern: /bg-(info|success|danger)+/,
			variants: ["dark"],
		},
		{
			pattern: /text-(info|success|danger)+/,
			variants: ["dark"],
		},
		{
			pattern: /border-(info|success|danger)+/,
			variants: ["dark"],
		},
	],
	theme: {
		extend: {
			colors: {
				primary, secondary, info, danger,  success
			},
			
			animation: {
				fade: "fadeIn .3s ease-in-out",
				slide: "slideIn .3s ease-in-out",
			},
			
			keyframes: {
				fadeIn: {
					from: {opacity: 0},
					to: {opacity: 1},
				},
				slideIn: {
					from: {opacity: 0, translate: "0 -5pt"},
					to: {opacity: 1, translate: "0 0"},
				},
			},
		},
	},
	plugins: [],
	darkMode: ["selector"],
}