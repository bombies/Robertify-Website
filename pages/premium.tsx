import Layout from "../components/Layout";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {DiscordInfo} from "../utils/Types";
import {fetchDiscordUserInfo} from "../utils/APIUtils";
import Hero from "../components/Hero";

type Props = {
    token: string,
    discordInfo: DiscordInfo,
    discordLoginLink: string
}

export default function Premium(props: Props) {
    return (
        <Layout token={props.token} title='Robertify - Premium' discordInfo={props.discordInfo} discordLoginLink={props.discordLoginLink} >
            <main>
                <Hero title='Premium' subTitle='Coming soon...'></Hero>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const data = await fetchDiscordUserInfo(req);
    const discordLoginLink = `https://discord.com/api/oauth2/authorize?client_id=${atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])}&redirect_uri=${encodeURI(process.env.LOCAL_API_HOSTNAME + '/callback/discord')}&response_type=code&scope=identify%20guilds`;

    return {
        props: {
            token: data.props.token || null,
            discordInfo: data.props.discordInfo || null,
            discordLoginLink: discordLoginLink
        }
    }
}