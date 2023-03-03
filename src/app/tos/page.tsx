import Card from "@/components/card";
import HeadingSection from "@/components/heading-section";
import SkeletonCard from "@/components/skeletons/skeleton-card";

export default function TermsOfService() {
    return (
        <main className='min-h-screen'>
            <HeadingSection heading='Terms of Service'>
            </HeadingSection>
            <div className='p-12 tablet:p-6 flex flex-col gap-y-6 mx-auto justify-center'>
                <Card
                    className='mx-auto'
                    title='Accepting these terms'
                    description='These Terms of Service (&quot;Terms&quot;, &quot;ToS&quot;) are an agreement between Robertify (&quot;us&quot;, &quot;we&quot;, &quot;our&quot;) and you (&quot;you&quot;, &quot;your&quot;). Upon the invitation, use, or distribution of Robertify (&quot;the Service&quot;), any source code associated with us and our website, you agree if you are over the age of majority in your jurisdiction or over, that you have read, understood, and accept to be bound by these Terms of Service. If you are below the age of majority in your jurisdiction, ensure that your legal guardian has reviewed and agreed to these Terms of Service.\n\n
                    At any time do we reserve the right to update these Terms of Service with reasons including (but not limited to) adhering to new Discord Terms of Service, or improving the user experience Robertify provides. If the aforementioned changes affect your usage of Robertify, we will be sure to notify all at least 5-7 days before the proposed changes. If you object to any of the changes proposed, your course of action shall be to cease usage of Robertify.'
                    size='lg'
                    spacers
                />
                <Card
                    className='mx-auto'
                    title='The terms'
                    description='Ajani Green (bombies) has developed the Service in connection with the Discord™ API (&quot;the Platform&quot;).\nBy using the Service you agree to be bounded by these Terms of Service to all of its extent.'
                    size='lg'
                    spacers
                >
                    <div className='p-6 flex flex-col gap-y-6'>
                        <Card
                            hoverable
                            title='Support'
                            description='Support for the Service is only provided in our support server.\nSupport via another method is NOT in any way official.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='General Statement'
                            description='Robertify is a Discord music bot and its service is provided for free with no guarantees.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Music'
                            description='You are responsible for the streaming of any form of copyrighted material.<br />
                            The music streaming services provided by the Service are always subject to change without prior notice. <br />
                            The quality of the Service will be tried to be kept at its highest, however, this may be subject to the usage of the Service and the quantity of concurrent users.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Rules of Conduct and Usage Guidelines'
                            description='We have no obligation or motive to monitor any means of communication using the Service, but it may do so in connections with providing the Service. We may also ban you from the Service at any time, without notice, without reason.<br /><br />
                            You acknowledge the fact that any user-based content (including but not limited to chats and images) through the Service is neither endorsed nor controlled by us. We will not, under any circumstances, be liable for any activity on the Service. We are not responsible for what you choose to share through the Service, or the actions of other users.<br /><br />
                            We reserve the right to deem what we consider a violation of these Terms of Service or improper usage. On such judgement we reserve the right to take action which includes the termination of your account from the Service.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Donation'
                            description='A donation is a gift - usually one of a charitable nature. A donation is a voluntary transfer of property (often money) from the transferor (donor) to the transferee (donee) with no exchange of value (consideration) on the part of the recipient (donee). (The recipient gives nothing in exchange for the donated property.) When a donor knowingly, intentionally, and unconditionally conveys property (or a symbol of the intended property) to a donee, the donation goes into effect and becomes irrevocable upon the donee&apos;s acceptance thereof.<br /><br />
                            You take full responsibility for the money transferred to us.<br />
                            You agree that the money that you sent is yours to be sent, and that you have full rights over it.<br />
                            You agree that you are of the legal age to donate in your country and/or the permission to legally dispose of the funds.'
                            size='md'
                        />
                    </div>
                </Card>
            </div>
        </main>
    )
}