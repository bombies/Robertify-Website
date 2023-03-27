import GuildDashboardGeneralContext from "@/app/dashboard/[id]/(categories)/general/guild-dashboard-general-context";

export default async function GuildDashboard({params}: { params: { id: string } }) {
    const {id} = params;

    return (
        <GuildDashboardGeneralContext id={id}/>
    )
}