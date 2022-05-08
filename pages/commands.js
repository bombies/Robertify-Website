import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function Commands({ token, discordInfo }) {
    return (
        <Layout token={token} discordInfo={discordInfo} title='Robertify - Commands'>
            <Hero
                title='Commands'
                subTitle='So... many... commands...'
            />
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    return fetchDiscordUserInfo(req);
}