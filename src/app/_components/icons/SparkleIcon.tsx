import * as React from "react"
import {IconProps} from "@/app/_components/icons/icons-utils";
import clsx from "clsx";

const SparkleIcon = ({width, height, className, fill}: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("self-center", className)}
        width={width ?? 24}
        height={height ?? width ?? 24}
        viewBox="0 0 256 256"
    >
        <path fill={clsx(fill ?? "#000")}
              d="M208.858 144a15.856 15.856 0 0 1-10.467 15.014l-52.16 19.216-19.217 52.16a16 16 0 0 1-30.028 0L77.77 178.23l-52.16-19.216a16 16 0 0 1 0-30.028l52.16-19.216 19.216-52.16a16 16 0 0 1 30.028 0l19.216 52.16 52.16 19.216A15.856 15.856 0 0 1 208.859 144ZM152 48h16v16a8 8 0 0 0 16 0V48h16a8 8 0 0 0 0-16h-16V16a8 8 0 0 0-16 0v16h-16a8 8 0 0 0 0 16Zm88 32h-8v-8a8 8 0 0 0-16 0v8h-8a8 8 0 0 0 0 16h8v8a8 8 0 0 0 16 0v-8h8a8 8 0 0 0 0-16Z"/>
    </svg>
)
export default SparkleIcon
