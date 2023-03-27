'use client';

import refreshIcon from "../../../../../public/refresh.svg";
import Button from "@/components/button/Button";

type Props = {
    refresh: () => void;
    isRefreshing: boolean;
    canInteract: boolean;

}

export default function DashboardRefreshButton(props: Props) {
    return (
        <Button
            label='Refresh'
            disabled={!props.canInteract}
            isWorking={props.isRefreshing}
            icon={refreshIcon}
            height={3}
            width={8}
            onClick={props.refresh}
        />
    )
}