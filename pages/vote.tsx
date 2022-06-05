import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function Vote({ token, discordInfo }) {
    const buttons = [
        {
            href: 'https://top.gg/bot/893558050504466482/vote',
            src: 'https://i.robertify.me/images/guuhj.png',
            alt: 'Top.gg Vote Button',
            name: 'Top.gg'
        },
        {
            href: 'https://discordbotlist.com/bots/robertify/upvote',
            src: 'https://i.robertify.me/images/2uc7i.png',
            alt: 'Discord Bot List Vote Button',
            name: 'Discord Bot List'
        }
    ]

    return (
        <Layout token={token} discordInfo={discordInfo} title='Robertify - Vote'>
            <Hero
                title='Vote'
                subTitle='Thank you for taking an interest in supporting us!'
                imageButtons={buttons}
            />
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    return fetchDiscordUserInfo(req);
}