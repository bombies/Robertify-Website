import Layout from "../components/Layout";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {fetchDiscordUserInfo} from "../utils/APIUtils";
import {DiscordInfo} from "../utils/Types";
import Hero from "../components/Hero";
import Link from "next/link";
import ArticleBubble from "../components/ArticleBubble";
import faqMsgs from '../static_messages/faq.msgs.json' assert {type: 'json'};
import Image from "next/image";

type Props = {
    token: string,
    discordInfo: DiscordInfo | null,
    discordLoginLink: string
}

export default function FAQ({ token, discordInfo, discordLoginLink }: Props) {
    const cards = faqMsgs.cards.map(obj => <ArticleBubble key={obj.title} title={obj.title} content={obj.content} contentImg={obj.contentImg} collapsable={true} />);

    return (
        <Layout title='Robertify - FAQ' discordLoginLink={discordLoginLink} discordInfo={discordInfo} token={token}>
            <main>
                <Hero title='FAQ' subTitle='Find out what&apos;s frequently asked about Robertify!' />
            </main>
            <div className='bg-neutral-800 py-10 flex justify-center gap-x-32 laptop:gap-x-16 phone:gap-x-8 phone:px-5'>
                <div className='relative w-64 h-64 laptop:w-32 laptop:w-32 drop-shadow-xl ease-in-out duration-1000 hover:scale-105'>
                    <Image src={`${process.env.NEXT_PUBLIC_HOSTED_IMAGE_SERVER_HOSTNAME}/images/l8pdz.png`} alt='Support Icon' fill={true} />
                </div>
                <p className='text-left self-center text-2xl max-w-lg drop-shadow-lg laptop:text-lg laptop:max-w-sm'>Need direct support from someone on our team? Join the <Link href='/support'><span className='text-lime-500 ease-in-out duration-500 hover:brightness-125 cursor-pointer'>support server</span></Link>!</p>
            </div>
            <div className='bg-blurred py-10'>
                <h1 className='text-lime-400 font-bold text-5xl phone:text-2xl uppercase drop-shadow-xl text-center mb-10'>Frequently Asked Questions</h1>
                <div className='grid grid-cols-3 laptop:grid-cols-2 phone:grid-cols-1 mx-auto gap-y-10 place-items-start'>
                    {cards}
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const data = await fetchDiscordUserInfo(req.cookies['login-token']);
    const discordLoginLink = `https://discord.com/api/oauth2/authorize?client_id=${atob(process.env.DISCORD_BOT_TOKEN.split('.')[0])}&redirect_uri=${encodeURI(process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME + '/callback/discord')}&response_type=code&scope=identify%20guilds`;

    return {
        props: {
            token: data.props.token || null,
            discordInfo: data.props.discordInfo || null,
            discordLoginLink: discordLoginLink
        }
    }
}

