import Layout from "../components/Layout";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {DiscordInfo} from "../utils/Types";
import {fetchDiscordUserInfo} from "../utils/APIUtils";
import Hero from "../components/Hero";
import GenericCard from "../components/GenericCard";
import Button from "../components/Button";

type Props = {
    token: string,
    discordInfo: DiscordInfo,
    discordLoginLink: string
}

export default function Premium(props: Props) {
    return (
        <Layout token={props.token} title='Robertify - Premium' discordInfo={props.discordInfo} discordLoginLink={props.discordLoginLink} >
            <main className='bg-neutral-900 overflow-hidden'>
                <Hero title='Premium' subTitle='Coming soon...'></Hero>
                <fieldset className='border-gradient-green px-6 pb-6 rounded-2xl bg-blurred'>
                    <legend className='text-center font-bold text-9xl tablet:text-8xl phone:text-6xl drop-shadow-lg uppercase tracking-[.45em] text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-lime-500'>Tiers</legend>
                    <div className='grid grid-cols-5 tablet:grid-cols-2 phone:grid-cols-1 place-items-center gap-6'>
                        <GenericCard
                            coverImage='https://i.imgur.com/qYPa0Cd.png'
                            title='Card Title'
                            titleColor='text-green-300'
                            subTitle='Card SubTitle'
                            content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem eu tellus tempor accumsan ut in augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum lobortis volutpat dignissim. Integer at nulla quis dui accumsan maximus. In aliquam egestas blandit. Suspendisse at enim pharetra, dignissim sem eget, sodales ante. Maecenas malesuada ex est, sit amet rutrum nisi tincidunt id. Nam nec neque vel risus feugiat faucibus in at massa. Nullam diam odio, tincidunt vitae lectus ut, imperdiet facilisis diam. Morbi nec nisl pretium, ultricies ante sed, mollis ante. Duis faucibus dapibus mi, nec venenatis augue vulputate sodales.\n\nFusce vitae lacinia odio. Morbi ut tortor in tellus rhoncus convallis sed non libero. Vivamus fermentum vestibulum lacus, tempor porta est euismod in. Fusce molestie suscipit nisl, sit amet lacinia erat sagittis eget. Sed tellus nisi, euismod sit amet venenatis nec, maximus quis tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius enim nisi. Sed orci erat, dapibus sit amet semper et, semper auctor sem. Nulla dui ligula, consectetur sed eros ac, accumsan sollicitudin enim. Sed eu felis eu metus cursus porttitor at eu metus. Mauris nec vestibulum ante, a aliquet purus. Pellentesque vel augue at neque mattis rhoncus. Nam a faucibus ex. Morbi id aliquet tellus.'
                            maxHeight='h-[35rem]'
                            buttons={[
                                {
                                    id: 'buttonTest1',
                                    text: 'SUBSCRIBE',
                                    href: 'nowhere',
                                    colour: 'bg-green-500',
                                    size: 'md'
                                }
                            ]}
                        />
                        <GenericCard
                            coverImage='https://i.imgur.com/qYPa0Cd.png'
                            title='Card Title'
                            titleColor='text-green-300'
                            subTitle='Card SubTitle'
                            content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem eu tellus tempor accumsan ut in augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum lobortis volutpat dignissim. Integer at nulla quis dui accumsan maximus. In aliquam egestas blandit. Suspendisse at enim pharetra, dignissim sem eget, sodales ante. Maecenas malesuada ex est, sit amet rutrum nisi tincidunt id. Nam nec neque vel risus feugiat faucibus in at massa. Nullam diam odio, tincidunt vitae lectus ut, imperdiet facilisis diam. Morbi nec nisl pretium, ultricies ante sed, mollis ante. Duis faucibus dapibus mi, nec venenatis augue vulputate sodales.\n\nFusce vitae lacinia odio. Morbi ut tortor in tellus rhoncus convallis sed non libero. Vivamus fermentum vestibulum lacus, tempor porta est euismod in. Fusce molestie suscipit nisl, sit amet lacinia erat sagittis eget. Sed tellus nisi, euismod sit amet venenatis nec, maximus quis tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius enim nisi. Sed orci erat, dapibus sit amet semper et, semper auctor sem. Nulla dui ligula, consectetur sed eros ac, accumsan sollicitudin enim. Sed eu felis eu metus cursus porttitor at eu metus. Mauris nec vestibulum ante, a aliquet purus. Pellentesque vel augue at neque mattis rhoncus. Nam a faucibus ex. Morbi id aliquet tellus.'
                            maxHeight='h-[35rem]'
                            buttons={[
                                {
                                    id: 'buttonTest1',
                                    text: 'SUBSCRIBE',
                                    href: 'nowhere',
                                    colour: 'bg-green-500',
                                    size: 'md'
                                }
                            ]}
                        />
                        <GenericCard
                            coverImage='https://i.imgur.com/qYPa0Cd.png'
                            title='Card Title'
                            titleColor='text-green-300'
                            subTitle='Card SubTitle'
                            content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem eu tellus tempor accumsan ut in augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum lobortis volutpat dignissim. Integer at nulla quis dui accumsan maximus. In aliquam egestas blandit. Suspendisse at enim pharetra, dignissim sem eget, sodales ante. Maecenas malesuada ex est, sit amet rutrum nisi tincidunt id. Nam nec neque vel risus feugiat faucibus in at massa. Nullam diam odio, tincidunt vitae lectus ut, imperdiet facilisis diam. Morbi nec nisl pretium, ultricies ante sed, mollis ante. Duis faucibus dapibus mi, nec venenatis augue vulputate sodales.\n\nFusce vitae lacinia odio. Morbi ut tortor in tellus rhoncus convallis sed non libero. Vivamus fermentum vestibulum lacus, tempor porta est euismod in. Fusce molestie suscipit nisl, sit amet lacinia erat sagittis eget. Sed tellus nisi, euismod sit amet venenatis nec, maximus quis tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius enim nisi. Sed orci erat, dapibus sit amet semper et, semper auctor sem. Nulla dui ligula, consectetur sed eros ac, accumsan sollicitudin enim. Sed eu felis eu metus cursus porttitor at eu metus. Mauris nec vestibulum ante, a aliquet purus. Pellentesque vel augue at neque mattis rhoncus. Nam a faucibus ex. Morbi id aliquet tellus.'
                            maxHeight='h-[35rem]'
                            buttons={[
                                {
                                    id: 'buttonTest1',
                                    text: 'SUBSCRIBE',
                                    href: 'nowhere',
                                    colour: 'bg-green-500',
                                    size: 'md'
                                }
                            ]}
                        />
                        <GenericCard
                            coverImage='https://i.imgur.com/qYPa0Cd.png'
                            title='Card Title'
                            titleColor='text-green-300'
                            subTitle='Card SubTitle'
                            content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem eu tellus tempor accumsan ut in augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum lobortis volutpat dignissim. Integer at nulla quis dui accumsan maximus. In aliquam egestas blandit. Suspendisse at enim pharetra, dignissim sem eget, sodales ante. Maecenas malesuada ex est, sit amet rutrum nisi tincidunt id. Nam nec neque vel risus feugiat faucibus in at massa. Nullam diam odio, tincidunt vitae lectus ut, imperdiet facilisis diam. Morbi nec nisl pretium, ultricies ante sed, mollis ante. Duis faucibus dapibus mi, nec venenatis augue vulputate sodales.\n\nFusce vitae lacinia odio. Morbi ut tortor in tellus rhoncus convallis sed non libero. Vivamus fermentum vestibulum lacus, tempor porta est euismod in. Fusce molestie suscipit nisl, sit amet lacinia erat sagittis eget. Sed tellus nisi, euismod sit amet venenatis nec, maximus quis tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius enim nisi. Sed orci erat, dapibus sit amet semper et, semper auctor sem. Nulla dui ligula, consectetur sed eros ac, accumsan sollicitudin enim. Sed eu felis eu metus cursus porttitor at eu metus. Mauris nec vestibulum ante, a aliquet purus. Pellentesque vel augue at neque mattis rhoncus. Nam a faucibus ex. Morbi id aliquet tellus.'
                            maxHeight='h-[35rem]'
                            buttons={[
                                {
                                    id: 'buttonTest1',
                                    text: 'SUBSCRIBE',
                                    href: 'nowhere',
                                    colour: 'bg-green-500',
                                    size: 'md'
                                }
                            ]}
                        />
                        <GenericCard
                            coverImage='https://i.imgur.com/qYPa0Cd.png'
                            title='Card Title'
                            titleColor='text-green-300'
                            subTitle='Card SubTitle'
                            content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lorem eu tellus tempor accumsan ut in augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum lobortis volutpat dignissim. Integer at nulla quis dui accumsan maximus. In aliquam egestas blandit. Suspendisse at enim pharetra, dignissim sem eget, sodales ante. Maecenas malesuada ex est, sit amet rutrum nisi tincidunt id. Nam nec neque vel risus feugiat faucibus in at massa. Nullam diam odio, tincidunt vitae lectus ut, imperdiet facilisis diam. Morbi nec nisl pretium, ultricies ante sed, mollis ante. Duis faucibus dapibus mi, nec venenatis augue vulputate sodales.\n\nFusce vitae lacinia odio. Morbi ut tortor in tellus rhoncus convallis sed non libero. Vivamus fermentum vestibulum lacus, tempor porta est euismod in. Fusce molestie suscipit nisl, sit amet lacinia erat sagittis eget. Sed tellus nisi, euismod sit amet venenatis nec, maximus quis tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius enim nisi. Sed orci erat, dapibus sit amet semper et, semper auctor sem. Nulla dui ligula, consectetur sed eros ac, accumsan sollicitudin enim. Sed eu felis eu metus cursus porttitor at eu metus. Mauris nec vestibulum ante, a aliquet purus. Pellentesque vel augue at neque mattis rhoncus. Nam a faucibus ex. Morbi id aliquet tellus.'
                            maxHeight='h-[35rem]'
                            buttons={[
                                {
                                    id: 'buttonTest1',
                                    text: 'SUBSCRIBE',
                                    href: 'nowhere',
                                    colour: 'bg-green-500',
                                    size: 'md'
                                }
                            ]}
                        />
                    </div>
                </fieldset>
            </main>
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