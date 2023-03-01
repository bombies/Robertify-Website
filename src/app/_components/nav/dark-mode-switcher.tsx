'use client';

import {useDarkMode} from "@/app/_components/dark-mode-context";
import moon from '/public/moon.svg';
import sun from '/public/sun.svg';
import Image from "next/image";
import {useAppDispatch} from "@/utils/redux/redux-store";

export default function DarkModeSwitcher() {
    const dispatch = useAppDispatch();
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
                <Image src={darkMode ? sun : moon} alt='Dark mode toggle' fill={true} />
            </div>
        </div>
    )
}