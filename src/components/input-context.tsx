'use client';
import {Input} from "@nextui-org/react";
import {Props} from "@nextui-org/react/types/input/input-props";

const InputContext = (props: Props) => {
    return (
        <Input {...props} />
    )
}

export default InputContext