import '../public/styles/global.scss'
import { addons } from '@storybook/preview-api'
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode'
import { DocsContainer } from '@storybook/blocks'
import { dark, light } from './theme'
import { useEffect, useState } from 'react'
import { Toaster } from '~'

const ThemedDocsContainer = ({ context, children }) => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const channel = addons.getChannel()
        const updateMode = (isDarkMode) => {
            setIsDark(isDarkMode)
        }
        channel.on(DARK_MODE_EVENT_NAME, updateMode)

        // Cleanup
        return () => channel.off(DARK_MODE_EVENT_NAME, updateMode)
    }, [])

    return (
        <>
            <DocsContainer theme={isDark ? dark : light} context={context}>
                {children}
            </DocsContainer>
        </>
    )
}

export default {
    decorators: [
        (Story, context) => {
            return (
                <>
                    <Story {...context} />
                    <Toaster
                        richcolors
                        theme={context.globals.dark ? 'dark' : 'light'}
                    ></Toaster>
                </>
            )
        },
    ],
    parameters: {
        layout: 'centered',
        backgrounds: {
            disable: true,
        },
        darkMode: {
            dark,
            light,
            stylePreview: true,
            classTarget: 'html', // make sure your styles respond to dark mode via `html.dark`
        },
        docs: {
            container: ThemedDocsContainer,
            toc: {
                contentsSelector: '.sbdocs-content',
                headingSelector: 'h1, h2, h3',
                ignoreSelector: '#primary',
                title: 'Table of Contents',
                disable: false,
                unsafeTocbotOptions: {
                    orderedList: false,
                },
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    tags: ['autodocs'],
}
