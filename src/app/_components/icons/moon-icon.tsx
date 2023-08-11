import * as React from "react"
import clsx from "clsx";
import {IconProps} from "@/app/_components/icons/icons-utils";

const MoonIcon = ({className, fill, width, height}: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("self-center", className)}
        width={width ?? 24}
        height={height ?? width ?? 24}
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            fill={clsx(fill ?? "#000")}
            d="M12.056 3.6a1 1 0 0 0-.908-1.564C6.024 2.469 2 6.764 2 12c0 5.523 4.477 10 10 10 5.236 0 9.531-4.024 9.964-9.148a1 1 0 0 0-1.564-.908A6 6 0 0 1 12.055 3.6Z"
        />
    </svg>
)
export default MoonIcon