'use client';

import refreshIcon from "../../../../../public/refresh.svg";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";

type Props = {
    refresh: () => void;
    isRefreshing: boolean;
    canInteract: boolean;

}

export default function DashboardRefreshButton(props: Props) {
    return (
        <Button
            disabled={!props.canInteract}
            isWorking={props.isRefreshing}
            icon={refreshIcon}
            height={3}
            width={3}
            type={ButtonType.WARNING}
            onClick={props.refresh}
        />
    )
}