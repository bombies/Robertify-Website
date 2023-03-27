'use client';

import DashboardContainer from "@/app/dashboard/[id]/(categories)/dashboard-container";

type Props = {
    id: string
}

export default function DashboardMiscContext(props: Props) {
    return (
        <div>
            <DashboardContainer>
                hello world
            </DashboardContainer>
        </div>
    )
}