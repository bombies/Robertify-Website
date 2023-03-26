import React from "react";

export interface SvgProps extends React.PropsWithChildren {
    fill?: string,
    size?: number,
    height?: number,
    width?: number,
    label?: string,
    xmlns?: string
}

export const SvgContext = (props: SvgProps) => {

    return (
        <svg
            width={props.size || props.width || 24}
            height={props.size || props.height || 24}
            xmlns={props.xmlns || "http://www.w3.org/2000/svg"}
            viewBox="0 0 24 24"
        >
            <g>
                {props.children}
            </g>
        </svg>
    )
}