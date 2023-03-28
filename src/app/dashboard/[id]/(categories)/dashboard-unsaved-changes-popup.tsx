'use client';

import Button from "@/components/button/Button";
import saveIcon from "../../../../../public/save.svg";
import {ButtonType} from "@/components/button/ButtonType";
import discardIcon from "../../../../../public/discard.svg";

type Props = {
    isSaving: boolean,
    changesMade: boolean,
    saveChanges: () => void
    discardChanges: () => void
    canInteract: boolean
}

export default function DashboardUnsavedChangesPopup(props: Props) {
    return (
        <div
            className={'fixed rounded-xl w-full bottom-0 right-0 mx-auto bg-primary/20 dark:bg-neutral-900/80 backdrop-blur-sm h-20 z-[51] p-6 flex phone:gap-2 justify-between transition-faster' + (!props.changesMade ? ' bottom-[-100px]' : '')}>
            <p className='text-black dark:text-primary dark:drop-shadow-glow-primary-lg font-semibold text-2xl phone:text-sm self-center'>You
                have unsaved changes!
            </p>
            <div className='flex gap-4'>
                <Button
                    isWorking={props.isSaving}
                    label='Save'
                    icon={saveIcon}
                    className='self-center !w-[8rem] !h-[3rem] phone:!w-[6rem]'
                    onClick={props.saveChanges}
                    disabled={!props.canInteract}
                />
                <Button
                    label='Discard'
                    type={ButtonType.WARNING}
                    icon={discardIcon}
                    className='self-center !w-[8rem] !h-[3rem] phone:!w-[6rem]'
                    onClick={props.discardChanges}
                    disabled={!props.canInteract}
                />
            </div>
        </div>
    )
}