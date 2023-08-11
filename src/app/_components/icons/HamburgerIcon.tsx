import * as React from "react"
import clsx from "clsx";
import {IconProps} from "@/app/_components/icons/icons-utils";

const HamburgerIcon = ({width, height, className, fill}: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("self-center", className)}
        width={width ?? 24}
        height={height ?? width ?? 24}
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            stroke={clsx(fill ?? "#000")}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 17h14M5 12h14M5 7h14"
        />
    </svg>
)
export default HamburgerIcon