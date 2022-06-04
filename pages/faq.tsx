import Layout from "../components/Layout";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {fetchDiscordUserInfo} from "../utils/APIUtils";
import {DiscordInfo} from "../utils/Types";
import Hero from "../components/Hero";
import Link from "next/link";
import ArticleBubble from "../components/ArticleBubble";
import faqMsgs from '../static_messages/faq.msgs.json' assert {type: 'json'};

type Props = {
    token: string,
    discordInfo: DiscordInfo | null,
    discordLoginLink: string
}

export default function FAQ({ token, discordInfo, discordLoginLink }: Props) {
    const articleAuthor = {
        name: 'bombies#4445',
        avatar: 'https://cdn.discordapp.com/avatars/274681651945144321/a_278626ba681402814279de89e3da7fda.gif?size=512'
    };

    const cards = faqMsgs.cards.map(obj => <ArticleBubble key={obj.title} title={obj.title} content={obj.content} contentImg={obj.contentImg} />);

    return (
        <Layout title='Robertify - FAQ' discordLoginLink={discordLoginLink} discordInfo={discordInfo} token={token}>
            <main>
                <Hero title='FAQ' subTitle='Find out what&apos;s frequently asked about Robertify!' />
            </main>
            <div className='bg-stone-800 py-10 flex justify-center gap-x-32 laptop:gap-x-16'>
                <img className='w-64 laptop:w-32 drop-shadow-xl ease-in-out duration-1000 hover:scale-105' src='https://i.robertify.me/images/l8pdz.png' alt='Support Icon' />
                <p className='text-left self-center text-2xl max-w-lg drop-shadow-lg laptop:text-lg laptop:max-w-sm'>Need direct support from someone on our team? Join the <Link href='/support'><span className='text-green-500 ease-in-out duration-500 hover:brightness-125 cursor-pointer'>support server</span></Link>!</p>
            </div>
            <div className='bg-blurred py-10'>
                <h1 className='text-green-400 font-bold text-5xl phone:text-2xl uppercase drop-shadow-xl text-center mb-10'>Frequently Asked Questions</h1>
                <div className='grid grid-cols-3 laptop:grid-cols-2 phone:grid-cols-1 mx-auto gap-y-10 place-items-start'>
                    {cards}
                </div>
            </div>
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

