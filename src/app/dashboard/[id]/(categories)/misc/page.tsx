import DashboardMiscContext from "@/app/dashboard/[id]/(categories)/misc/dashboard-misc-context";

export default async function GuildDashboard({params}: { params: { id: string } }) {
    const {id} = params;

    return (
        <DashboardMiscContext id={id}/>
    )
}