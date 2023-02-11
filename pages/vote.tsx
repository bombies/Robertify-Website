import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function Vote({ token, discordInfo, discordLoginLink }) {
    const buttons = [
        {
            href: 'https://top.gg/bot/893558050504466482/vote',
            src: `${process.env.NEXT_PUBLIC_IMAGE_SERVER_HOSTNAME}/images/guuhj.png`,
            alt: 'Top.gg Vote Button',
            name: 'Top.gg'
        },
        {
            href: 'https://discordbotlist.com/bots/robertify/upvote',
            src: `${process.env.NEXT_PUBLIC_IMAGE_SERVER_HOSTNAME}/images/2uc7i.png`,
            alt: 'Discord Bot List Vote Button',
            name: 'Discord Bot List'
        }
    ]

    return (
        <Layout token={token} discordInfo={discordInfo} discordLoginLink={discordLoginLink} title='Robertify - Vote'>
            <Hero
                title='Vote'
                subTitle='Thank you for taking an interest in supporting us!'
                imageButtons={buttons}
            />
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    const discordLoginLink = `https://discord.com/api/oauth2/authorize?client_id=${atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])}&redirect_uri=${encodeURI(process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME + '/callback/discord')}&response_type=code&scope=identify%20guilds`;
    const discordUserInfo = await fetchDiscordUserInfo(req)
    return {
        props: {
            token: discordUserInfo.props.token ? discordUserInfo.props.token : null,
            discordInfo: discordUserInfo.props.discordInfo ? discordUserInfo.props.discordInfo : null,
            discordLoginLink: discordLoginLink
        }
    }
}