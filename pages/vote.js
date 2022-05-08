import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function Vote({ token, discordInfo }) {
    return (
        <Layout token={token} discordInfo={discordInfo} title='Robertify - Vote'>
            <Hero
                title='Vote'
                subTitle='Thank you for taking an interest in supporting us!'
            />
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    return fetchDiscordUserInfo(req);
}