'use client';

import {Tooltip} from '@nextui-org/react';
import {TooltipOnVisibleChange, TooltipProps} from '@nextui-org/react/types/tooltip/tooltip';

type Props =
    Partial<{
        initialVisible: boolean;
        hideArrow: boolean;
        animated: boolean;
        shadow: boolean;
        rounded: boolean;
        keepMounted: boolean;
        isDisabled: boolean;
        trigger: "hover" | "click";
        enterDelay: number;
        leaveDelay: number;
        className: string;
        portalClassName: string;
        onVisibleChange: TooltipOnVisibleChange;
    }>
    & Omit<TooltipProps, "rounded" | "shadow" | "className" | "animated" | "isDisabled" | "hideArrow" | "initialVisible" | "trigger" | "enterDelay" | "leaveDelay" | "keepMounted" | "portalClassName" | "onVisibleChange">

const ToolTipWrapper = (props: Props) => {
    return (<Tooltip {...props} />)
}

export default ToolTipWrapper