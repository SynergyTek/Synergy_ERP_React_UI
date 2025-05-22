import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoonStars, faSunBright} from "@awesome.me/kit-9b926a9ec0/icons/duotone/solid";

export default function ThemeToggle({setGlobalTheme, className}) {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            // Check the user's system preference on initial load
            const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = userPrefersDark ? 'dark' : 'light';

            setTheme(initialTheme);
            localStorage.setItem('theme', initialTheme);
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        setGlobalTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button onClick={toggleTheme} className={`px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg ${className}`}>
            {theme === 'dark' ? <FontAwesomeIcon icon={'fa-regular fa-sun-bright'}/> : <FontAwesomeIcon icon={'fa-regular fa-moon-stars'}/>}
        </button>
    );
}
