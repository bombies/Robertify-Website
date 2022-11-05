import {NextApiRequest, NextApiResponse} from "next";
import {ImageResponse} from "@vercel/og";
import {getParamFromSearch} from "../../../../utils/APIUtils";

const getMontserratBold = fetch(new URL('../../../../assets/fonts/montserrat/Montserrat-Bold.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getMontserratRegular = fetch(new URL('../../../../assets/fonts/montserrat/Montserrat-Regular.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getMontserratLight = fetch(new URL('../../../../assets/fonts/montserrat/Montserrat-Light.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getMontserratMedium = fetch(new URL('../../../../assets/fonts/montserrat/Montserrat-Medium.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(400).json({ error: `You cannot ${req.method} this route!` })

    const { searchParams } = new URL(req.url ?? '');
    const montserratBold = await getMontserratBold;
    const montserratRegular = await getMontserratRegular;
    const montserratMedium = await getMontserratMedium;
    const montserratLight = await getMontserratLight;

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
        defaultResult: 'https://i.robertify.me/images/syy1c.jpg'
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
    })

    return new ImageResponse(
        (
            <div tw='flex flex-col h-full w-full bg-neutral-800'>
                <img style={{
                    objectFit: 'cover',
                    filter: 'blur(15px) brightness(70%)',
                    zIndex: '0',
                    height: '200%',
                    width: '200%',
                }} tw='absolute' src={albumImage} alt='' />
                <div tw='flex flex-col px-16 py-12 w-full h-full'>
                    <div tw='flex h-full w-full justify-between px-6'>
                        <h1 tw='flex flex-col text-white'>
                            <span style={{ fontFamily: '"MontserratRegular'}} tw='uppercase mb-6'>Robertify is now playing</span>
                            <span style={{ fontFamily: '"MontserratBold"'}} tw='text-6xl'>{songTitle}</span>
                            <span style={{ fontFamily: '"MontserratMedium"'}} tw='text-4xl text-green-500'>{artistName}</span>
                        </h1>
                        <img
                            style={{
                                objectFit: 'cover'
                            }}
                            src={albumImage} width={150} height={150} alt=''
                            tw='rounded-2xl border-2 border-opacity-50 border-neutral-200'
                        />
                    </div>
                    <div tw='flex w-full justify-between text-white'>
                        <p style={{ fontFamily: '"MontserratRegular'}}>0:00</p>
                        <div tw='flex w-3/4 self-center h-[.35rem] border-[0.25px] border-white rounded-full'>
                            <div style={{ width: `${(Number(currentTime) / Number(duration)) * 100}%`}} tw='flex h-full bg-white rounded-full'></div>
                        </div>
                        <p style={{ fontFamily: '"MontserratRegular'}}>{new Date(Number(duration)).toISOString().slice(14, 19)}</p>
                    </div>

                </div>
            </div>
        ),
        {
            width: 900,
            height: 300,
            fonts: [
                {
                    name: 'MontserratBold',
                    data: montserratBold,
                    style: 'normal'
                },
                {
                    name: 'MontserratRegular',
                    data: montserratRegular,
                    style: 'normal'
                },
                {
                    name: 'MontserratMedium',
                    data: montserratMedium,
                    style: 'normal'
                },
                {
                    name: 'MontserratLight',
                    data: montserratLight,
                    style: 'normal'
                },
            ]
        }
    )
}

export default handler;

export const config = {
    runtime: 'experimental-edge'
}