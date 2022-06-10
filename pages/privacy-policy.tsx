import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function PrivacyPolicy({ token, discordInfo, discordLoginLink }) {
    return (
        <Layout token={token} discordInfo={discordInfo} title='Robertify - Privacy Policy' discordLoginLink={discordLoginLink}>
            <Hero
                title='Privacy Policy'
            />
            <main className='plain_text'>
                <section>
                    <h1>Accepting This Policy</h1>
                    <p>This Privacy Policy entails Our policies and procedures on the accumulation, use and disclosure of your provided information. We use your personal data to provide and improve Robertify. By using Robertify, you agree to this privacy policy.<br /><br />
                        This privacy policy was last updated on January 7, 2022 at 8:06 PM EST.
                    </p>
                </section>
                <section>
                    <h1>What Data do we store and why do we need it?</h1>
                    <ol>
                        <li><span className='plain_text--list-heading'>User IDs</span><br />We store user IDs for various uses within the bot. These include (but will not be limited to): permissions, guild banned users, reports banned users, suggestions banned users.</li>
                        <li><span className='plain_text--list-heading'>Channel IDs</span><br />Channel IDs are also stored to facilitate persistent functioning and support for certain features: These include (but not limited to): dedicated channels, restricted channels, and announcement channels.</li>
                        <li><span className='plain_text--list-heading'>Guild (Server) IDs</span><br />We store guild IDs to easily locate the data associated with your guild.</li>
                        <li><span className='plain_text--list-heading'>Role IDs</span><br />We store role IDs to accommodate permissions. In the future, role IDs may be used to support for features.</li>
                        <li><span className='plain_text--list-heading'>Message IDs</span><br />We store message IDs to facilitate persistent functioning for dedicated channels, announcement channels and log channels.</li>
                    </ol>
                </section>
                <section>
                    <h1>Where is the data stored and who can access it?</h1>
                    <p>All data is stored in a secure MongoDB database. The developer(s) of the Service can access this data and modify it at anytime.</p>
                </section>
                <section>
                    <h1>How can I have my data removed?</h1>
                    <p>Once the bot has left your guild, all data regarding your guild will instantly be removed from the database.</p>
                </section>
                <section>
                   <h1>How can I contact you if I have any concerns?</h1>
                   <p>If you have any concerns, you may contact us through our <a href='https://robertify.me/support'>support server</a></p> 
                </section>
                <section>
                    <h1>Changes to this Privacy Policy</h1>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.<br />We will let you know via an announcement in our community server and/or a prominent notice on our Service, prior to the change becoming effective and update the “effective date” at the top of this Privacy Policy.<br />You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                </section>
            </main>
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    const discordLoginLink = `https://discord.com/api/oauth2/authorize?client_id=${atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])}&redirect_uri=${encodeURI(process.env.LOCAL_API_HOSTNAME + '/callback/discord')}&response_type=code&scope=identify%20guilds`;
    const discordUserInfo = await fetchDiscordUserInfo(req)
    return {
        props: {
            token: discordUserInfo.props.token ? discordUserInfo.props.token : null,
            discordInfo: discordUserInfo.props.discordInfo ? discordUserInfo.props.discordInfo : null,
            discordLoginLink: discordLoginLink
        }
    }
}