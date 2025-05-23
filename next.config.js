const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer({
	compiler: {
		styledComponents: true,
	},

	images: {
		domains: ['placehold.co', 'images.unsplash.com'],
	},

	webpack: (config, { isServer }) => {
		config.resolve.alias['#outline'] = path.resolve(__dirname, 'node_modules/@awesome.me/kit-9b926a9ec0/icons/modules/classic/thin');
		config.resolve.alias['#duotone'] = path.resolve(__dirname, 'node_modules/@awesome.me/kit-9b926a9ec0/icons/modules/duotone/solid');
		config.resolve.alias['#solid'] = path.resolve(__dirname, 'node_modules/@awesome.me/kit-9b926a9ec0/icons/modules/classic/solid');
		if (!isServer) {
			config. optimization.splitChunks.cacheGroups = {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			}
		}
		return config;
	},
})
