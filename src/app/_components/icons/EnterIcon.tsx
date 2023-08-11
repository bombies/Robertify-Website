import * as React from "react"
import {IconProps} from "@/app/_components/icons/icons-utils";
import clsx from "clsx";
const SvgComponent = ({width, height, className, fill}: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("self-center", className)}
        width={width ?? 24}
        height={height ?? width ?? 24}
        fill="none"
        viewBox="0 0 24 24"
    >
        <g fill={clsx(fill ?? "#000")}>
            <path d="M16.707 14.293a1 1 0 0 1-1.414 1.414l-2.913-2.913a1.112 1.112 0 0 1-.044-.046.998.998 0 0 1 0-1.496l.044-.046 2.913-2.913a1 1 0 1 1 1.414 1.414L15.414 11H21a1 1 0 1 1 0 2h-5.586l1.293 1.293Z" />
            <path d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h9.5a2.5 2.5 0 0 0 2.5-2.5v-2.767a2 2 0 0 1-2.414-.319l-2.913-2.913a1.847 1.847 0 0 1-.044-.045 1.997 1.997 0 0 1 0-2.912c.014-.016.029-.03.044-.045l2.913-2.913A2 2 0 0 1 17 7.267V4.5A2.5 2.5 0 0 0 14.5 2H5Z" />
            <path d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h9.5a2.5 2.5 0 0 0 2.5-2.5v-2.767a2 2 0 0 1-2.414-.319l-2.913-2.913a1.847 1.847 0 0 1-.044-.045 1.997 1.997 0 0 1 0-2.912c.014-.016.029-.03.044-.045l2.913-2.913A2 2 0 0 1 17 7.267V4.5A2.5 2.5 0 0 0 14.5 2H5Z" />
        </g>
    </svg>
)
export default SvgComponent
