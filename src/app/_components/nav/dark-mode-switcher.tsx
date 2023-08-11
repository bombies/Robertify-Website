'use client';

import moon from '/public/moon.svg';
import sun from '/public/sun.svg';
import GenericImage from "@/app/_components/GenericImage";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Switch} from "@nextui-org/react";
import MoonIcon from "@/app/_components/icons/moon-icon";
import SunIcon from "@/app/_components/icons/sun-icon";

export default function DarkModeSwitcher() {
    const {theme, setTheme} = useTheme()
    const [isSelected, setSelected] = useState(theme !== "light")

    useEffect(() => {
        setTheme(isSelected ? "dark" : "light")
    }, [isSelected, setTheme])

    return (
        <Switch
            isSelected={isSelected}
            onValueChange={setSelected}
            thumbIcon={({isSelected}) => (
                isSelected ?
                    <MoonIcon fill="#00D615" width={12} />
                    :
                    <SunIcon  width={12}/>
            )}
        />
    )
}