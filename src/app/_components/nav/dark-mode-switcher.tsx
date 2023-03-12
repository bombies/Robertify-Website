'use client';

import {useDarkMode} from "@/app/_components/dark-mode-context";
import moon from '/public/moon.svg';
import sun from '/public/sun.svg';
import Image from "next/image";

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
            <div className='relative w-5 h-5'>
                <Image
                    draggable={false}
                    src={darkMode ? sun : moon}
                    alt='Dark mode toggle'
                    fill={true}
                    sizes='1.25rem'
                />
            </div>
        </div>
    )
}