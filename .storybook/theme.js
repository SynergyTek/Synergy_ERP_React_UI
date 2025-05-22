import { create } from '@storybook/theming/create'

const config = require('../config')
const colors = config.theme.extend.colors
export const light = create({
    base: 'light',
    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    brandTitle: config.app.name,
    brandUrl: config.app.url,
    brandTarget: '_self',

    //
    colorPrimary: colors.primary[950],
    colorSecondary: colors.primary[500],

    // UI
    appBg: colors.primary[50],
    appContentBg: colors.primary[50],
    appPreviewBg: colors.primary[50],
    appBorderColor: colors.primary[100],
    appBorderRadius: 4,

    // Text colors
    textColor: colors.primary[950],
    textInverseColor: colors.primary[50],

    // Toolbar default and active colors
    barTextColor: colors.primary[950],
    barSelectedColor: colors.primary[950],
    barHoverColor: colors.primary[500],
    barBg: colors.primary[100],

    // Form colors
    inputBg: colors.primary[50],
    inputBorder: colors.primary[100],
    inputTextColor: colors.primary[950],
    inputBorderRadius: 2,
})

export const dark = create({
    base: 'dark',
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    brandTitle: config.app.name,
    brandUrl: config.app.url,
    brandTarget: '_self',
    //
    colorPrimary: colors.primary[50],
    colorSecondary: colors.primary[500],

    // UI
    appBg: colors.secondary[800],
    appContentBg: colors.secondary[950],
    appPreviewBg: colors.secondary[950],
    appBorderColor: colors.secondary[900],
    appBorderRadius: 4,

    // Text colors
    textColor: colors.primary[50],
    textInverseColor: colors.primary[50],

    // Toolbar default and active colors
    barTextColor: colors.primary[50],
    barSelectedColor: colors.primary[500],
    barHoverColor: colors.primary[200],
    barBg: colors.primary[950],

    // Form colors
    inputBg: colors.secondary[950],
    inputBorder: colors.primary[950],
    inputTextColor: colors.primary[50],
    inputBorderRadius: 2,
})
