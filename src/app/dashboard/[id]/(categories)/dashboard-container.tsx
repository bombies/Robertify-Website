import React from "react";
import Card from "@/components/card";
import {useGuildDashboard} from "@/app/dashboard/[id]/dashboard-context-wrapper";

interface Props extends React.PropsWithChildren {
}

const DashboardContainer = ({children}: Props) => {
    const [dashboardInfo] = useGuildDashboard();

    return (
        <div
            className='relative mx-auto space-y-6 mb-12 p-12 tablet:p-6 bg-primary/10 shadow-md dark:bg-neutral-900 w-full min-h-42 rounded-2xl border-2 border-primary/90'>
            {!dashboardInfo.userHasPermission &&
                <div
                    className="absolute z-50 w-full h-full bg-dark/80 top-0 left-0 rounded-2xl p-12 tablet:p-6 phone:p-3">
                    <Card
                        centered
                        hoverable
                        size='lg'
                        title="No Permission"
                        description="It looks like you don't have enough permission to interact with the dashboard. You need to have administrative permissions in this server to edit bot settings here."
                    />
                </div>}
            {children}
        </div>
    )
}

export default DashboardContainer