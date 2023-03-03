import HeadingSection from "@/components/heading-section";
import Card from "@/components/card";

export default function Privacy() {
    return (
        <main>
            <HeadingSection heading='Privacy Policy' />
            <div className='p-12 tablet:p-6 flex flex-col gap-y-6 mx-auto justify-center'>
                <Card
                    centered
                    title='Accepting This Policy'
                    description='This Privacy Policy entails Our policies and procedures on the accumulation, use and disclosure of your provided information. We use your personal data to provide and improve Robertify. By using Robertify, you agree to this privacy policy.<br /><br />
                        This privacy policy was last updated on January 7, 2022 at 8:06 PM EST.'
                    size='lg'
                />
                <Card
                    centered
                    title='What Data Do We Store and Why Do We Need It?'
                    size='lg'
                >
                    <div className='space-y-3'>
                        <Card
                            hoverable
                            title='User IDs'
                            description='We store user IDs for various uses within the bot. These include (but will not be limited to): permissions, guild banned users, reports banned users, suggestions banned users.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Channel IDs'
                            description='Channel IDs are also stored to facilitate persistent functioning and support for certain features: These include (but not limited to): dedicated channels, restricted channels, and announcement channels.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Guild (Server) IDs'
                            description='We store guild IDs to easily locate the data associated with your guild.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Role IDs'
                            description='We store role IDs to accommodate permissions. In the future, role IDs may be used to support for features.'
                            size='md'
                        />
                        <Card
                            hoverable
                            title='Message IDs'
                            description='We store message IDs to facilitate persistent functioning for dedicated channels, announcement channels and log channels.'
                            size='md'
                        />
                    </div>
                </Card>
                <Card
                    centered
                    title='Where Is The Data Stored and Who Can Access It?'
                    description='All data is stored in a secure MongoDB database. The developer(s) of the Service can access this data and modify it at anytime.'
                    size='lg'
                />
                <Card
                    centered
                    title='How Can I Have My Data Removed?'
                    description='Once the bot has left your guild, all data regarding your guild will instantly be removed from the database.'
                    size='lg'
                />
                <Card
                    centered
                    title='How Can I Contact You If I Have Any Concerns?'
                    description='If you have any concerns, you may contact us through our support server'
                    size='lg'
                />
                <Card
                    centered
                    title='Changes To This Privacy Policy'
                    description='We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.\n\nWe will let you know via an announcement in our community server and/or a prominent notice on our Service, prior to the change becoming effective and update the “effective date” at the top of this Privacy Policy.<br />You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.'
                    size='lg'
                />
            </div>
        </main>
    )
}