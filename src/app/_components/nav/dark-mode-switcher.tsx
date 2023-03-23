'use client';

import {useDarkMode} from "@/app/_components/dark-mode-context";
import moon from '/public/moon.svg';
import sun from '/public/sun.svg';
import Image from "next/image";
import GenericImage from "@/app/_components/GenericImage";

export default function DarkModeSwitcher() {
    const [ darkMode, setDarkMode ] = useDarkMode();
    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    }

    return (
        <div
            className='transition-fast hover:scale-105 self-center cursor-pointer'
            onClick={toggleDarkMode}
        >
            <GenericImage
                src={darkMode ? sun : moon}
                alt='Dark mode toggle'
                width={1.25}
            />
        </div>
    )
}