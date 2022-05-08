import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { fetchDiscordUserInfo } from '../utils/APIUtils';

export default function TermsOfService({ token, discordInfo }) {
    return (
        <Layout token={token} discordInfo={discordInfo} title='Robertify - Terms of Service'>
            <Hero
                title='Terms of Service'
            />
            <main className='plain_text'>
                <section>
                    <h1>Accepting These Terms</h1>
                    <p>These Terms of Service ("Terms", "ToS") are an agreement between Robertify ("us", "we", "our") and you ("you", "your"). Upon the invitation, use, or distribution of Robertify ("the Service"), any source code associated with us and our website, you agree if you are over the age of majority in your jurisdiction or over, that you have read, understood, and accept to be bound by these Terms of Service. If you are below the age of majority in your jurisdiction, ensure that your legal guardian has reviewed and agreed to these Terms of Service.<br/><br/>At any time do we reserve the right to update these Terms of Service with reasons including (but not limited to) adhering to new Discord Terms of Service, or improving the user experience Robertify provides. If the aforementioned changes affect your usage of Robertify, we will be sure to notify all at least 5-7 days before the proposed changes. If you object to any of the changes proposed, your course of action shall be to cease all usage of Robertify.</p>
                </section>
                <section>
                    <h1>The Terms</h1>
                    <p>Ajani Green (bombies) has developed the Service in connection with the Discord™ API ("the Platform").<br />By using the Service you agree to be bounded by these Terms of Service to all of its extent.</p>
                    <ol>
                        <li><span className='plain_text--list-heading'>Support</span><br />Support for the Service is only provided in our <a href='https://robertify.me/support'>support server</a>. Support via another method is NOT in any way official.</li>
                        <li><span className='plain_text--list-heading'>General Statement</span><br />Robertify is a Discord music bot and its service is provided for free with no guarantees.</li>
                        <li><span className='plain_text--list-heading'>Music</span><br />You are responsible for the streaming of any form of copyrighted material.<br />
                            The music streaming services provided by the Service are always subject to change without prior notice. <br />
                            The quality of the Service will be tried to be kept at its highest, however, this may be subject to the usage of the Service and the quantity of concurrent users.</li>
                        <li><span className='plain_text--list-heading'>Rules of Conduct and Usage Guidelines</span><br />We have no obligation or motive to monitor any means of communication using the Service, but it may do so in connections with providing the Service. We may also ban you from the Service at any time, without notice, without reason.<br /><br />
                            You acknowledge the fact that any user-based content (including but not limited to chats and images) through the Service is neither endorsed nor controlled by us. We will not, under any circumstances, be liable for any activity on the Service. We are not responsible for what you choose to share through the Service, or the actions of other users.<br /><br />
                            We reserve the right to deem what we consider a violation of these Terms of Service or improper usage. On such judgement we reserve the right to take action which includes the termination of your account from the Service.</li>
                        <li><span className='plain_text--list-heading'>Donations</span><br />A donation is a gift - usually one of a charitable nature. A donation is a voluntary transfer of property (often money) from the transferor (donor) to the transferee (donee) with no exchange of value (consideration) on the part of the recipient (donee). (The recipient gives nothing in exchange for the donated property.) When a donor knowingly, intentionally, and unconditionally conveys property (or a symbol of the intended property) to a donee, the donation goes into effect and becomes irrevocable upon the donee's acceptance thereof.<br /><br />
                            You take full responsibility for the money transferred to us.<br />
                            You agree that the money that you sent is yours to be sent, and that you have full rights over it.<br />
                            You agree that you are of the legal age to donate in your country and/or the permission to legally dispose of the funds.</li>
                    </ol>
                </section>
            </main>
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    return fetchDiscordUserInfo(req);
}