import {ImageResponse} from "@vercel/og";
import {getParamFromSearch} from "@/utils/api/api-utils";

export const config = {
    runtime: 'edge',
};

const getInterBold = fetch(new URL('../../../../../../assets/fonts/inter/Inter-Bold.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getInterRegular = fetch(new URL('../../../../../../assets/fonts/inter/Inter-Regular.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getInterLight = fetch(new URL('../../../../../../assets/fonts/inter/Inter-Light.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getInterMedium = fetch(new URL('../../../../../../assets/fonts/inter/Inter-Medium.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

type Requester = {
    user_name: string,
    user_image: string,
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url ?? '');
    const InterBold = await getInterBold;
    const InterRegular = await getInterRegular;
    const InterMedium = await getInterMedium;
    const InterLight = await getInterLight;

    const songTitle = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'title',
        defaultResult: 'A Song'
    });

    const artistName = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'artist',
        defaultResult: 'An artist'
    });

    const albumImage = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'album_image',
        defaultResult: `${process.env.NEXT_PUBLIC_IMAGE_SERVER_HOSTNAME}/images/syy1c.jpg`
    });

    const duration = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'duration',
        defaultResult: '1'
    });

    const currentTime = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'current_time',
        defaultResult: '1'
    });

    const user = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'requester',
    })

    const userObj: Requester = user ? JSON.parse(user) : undefined;

    return new ImageResponse(
        (
            <div tw='flex flex-col h-full w-full bg-neutral-800'>
                <img style={{
                    objectFit: 'cover',
                    filter: 'blur(15px) brightness(70%)',
                    zIndex: '0',
                    height: '200%',
                    width: '200%',
                }} tw='absolute' src={albumImage} width='100%' height='200%' alt='' />
                <div tw='flex flex-col px-16 py-12 w-full h-full'>
                    <div tw='flex w-full justify-between px-6'>
                        <h1
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                            tw='flex flex-col text-white w-[78%]'
                        >
                            <span style={{ fontFamily: '"InterRegular'}} tw='uppercase mb-2 text-lg'>Robertify is now playing</span>
                            <span style={{
                                fontFamily: '"InterBold"',
                                textOverflow: 'ellipsis',
                            }} tw='text-6xl w-full'>{songTitle}</span>
                            <span style={{
                                fontFamily: '"InterMedium"',
                                textOverflow: 'ellipsis',
                            }} tw='text-4xl text-green-500 w-full'>{artistName}</span>
                        </h1>
                        <img
                            style={{
                                objectFit: 'cover',
                                width: '150px',
                                height: '150px'
                            }}
                            src={albumImage} alt=''
                            tw='rounded-2xl border-2 border-opacity-50 border-neutral-200'
                            width='150px'
                            height='150px'
                        />
                    </div>
                    {
                        userObj ?
                            <div tw='flex flex-col'>
                                <div tw='flex'>
                                    <p style={{ fontFamily: '"InterRegular'}} tw='text-white text-2xl mr-2'>Requested by {userObj.user_name}</p>
                                    <img
                                        style={{
                                            objectFit: 'cover',
                                            width: '32px',
                                            height: '32px',
                                        }}
                                        src={userObj.user_image || 'https://support.discord.com/hc/user_images/l12c7vKVRCd-XLIdDkLUDg.png'} alt=''
                                        tw='rounded-full border-2 border-opacity-50 border-neutral-200 self-center'
                                        height='32px'
                                        width='32px'
                                    />
                                </div>
                            </div>
                            :
                            <div tw='flex w-full justify-between text-white'>
                                <p style={{ fontFamily: '"InterRegular'}}>0:00</p>
                                <div tw='flex w-3/4 self-center h-[.35rem] border-[0.25px] border-white rounded-full'>
                                    <div style={{ width: `${(Number(currentTime) / Number(duration)) * 100}%`}} tw='flex h-full bg-white rounded-full'></div>
                                </div>
                                <p style={{ fontFamily: '"InterRegular'}}>{new Date(Number(duration)).toISOString().slice(14, 19)}</p>
                            </div>
                    }
                </div>
            </div>
        ),
        {
            width: 900,
            height: 300,
            fonts: [
                {
                    name: 'InterBold',
                    data: InterBold,
                    style: 'normal'
                },
                {
                    name: 'InterRegular',
                    data: InterRegular,
                    style: 'normal'
                },
                {
                    name: 'InterMedium',
                    data: InterMedium,
                    style: 'normal'
                },
                {
                    name: 'InterLight',
                    data: InterLight,
                    style: 'normal'
                },
            ]
        }
    )
}