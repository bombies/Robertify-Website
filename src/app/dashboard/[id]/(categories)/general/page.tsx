import GuildDashboardContext from "@/app/dashboard/[id]/(categories)/general/guild-dashboard-context";

export default async function GuildDashboard({params}: { params: { id: string } }) {
    const {id} = params;

    return (
        <GuildDashboardContext id={id}/>
    )
}