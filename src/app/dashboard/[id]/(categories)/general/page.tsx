import DashboardGeneralContext from "@/app/dashboard/[id]/(categories)/general/dashboard-general-context";

export default async function GuildDashboard({params}: { params: { id: string } }) {
    const {id} = params;

    return (
        <DashboardGeneralContext id={id}/>
    )
}