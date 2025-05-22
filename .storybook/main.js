module.exports = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    ],

    /** Expose public folder to storybook as static */
    staticDirs: ['../public'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-webpack5-compiler-babel',
        '@storybook/addon-themes',
        '@storybook/addon-styling-webpack',
        'storybook-dark-mode',
        '@chromatic-com/storybook',
        '@storybook/addon-mdx-gfm',
    ],

    framework: {
        name: '@storybook/nextjs',
        options: {
            builder: {
                useSwcCss: true,
            },
        },
    },

    docs: {
        toc: true,
        autodocs: true,
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
}
