import WebClient from "@/utils/api/web-client";
import NavBar from "@/app/_components/nav/navbar";
import {cookies} from "next/headers";

const getDiscordData = async (token?: string) => {
    if (!token)
        return {};
    const axiosResponse = await WebClient.getInstance()
        .get(`/api/discord/users/${token}`, {
            headers: {
                'Authorization': process.env.API_MASTER_PASSWORD
            }
        });
    return axiosResponse.data;
}

export default async function NavbarContainer() {
    const discordInfo = (await getDiscordData(cookies().get('login-token')?.value)).data;

    return (
        <NavBar discordInfo={discordInfo} />
    )
}