import {ImageResponse} from "@vercel/og";
import {getParamFromSearch} from "@/app/api/images/music/nowplaying/route";

export const config = {
    runtime: 'edge',
};

const getInterBold = fetch(new URL('../../../../../../public/fonts/inter/Inter-Bold.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getInterRegular = fetch(new URL('../../../../../../public/fonts/inter/Inter-Regular.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

const getInterMedium = fetch(new URL('../../../../../../public/fonts/inter/Inter-Medium.ttf', import.meta.url).toString())
    .then(res => res.arrayBuffer());

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url ?? '');
    const [ InterBold, InterRegular, InterMedium ] = await Promise.all([getInterBold, getInterRegular, getInterMedium]);

    const tracks = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'tracks',
        defaultResult: `${JSON.stringify({
            page: 1,
            tracks: [
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_name: 'A track with',
                    track_artist: 'An artist with',
                    track_duration: '10'
                },
                {
                    track_name: 'A track with a',
                    track_artist: 'An artist with a',
                    track_duration: '100'
                },
                {
                    track_name: 'A track with a long name',
                    track_artist: 'An artist with a lone name',
                    track_duration: '10000'
                }
            ]
        })}`,
    });

    const nextUpImage = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'next_img'
    });

    try {
        const jsonTracks = JSON.parse(tracks);

        if (Array.isArray(jsonTracks))
            throw new Error('Track object type error');

        if (!('page' in jsonTracks))
            throw new Error('Missing page field');
        if (!('tracks' in jsonTracks))
            throw new Error('Missing tracks field');
        if (!Array.isArray(jsonTracks.tracks))
            throw new Error('Track array type error');

        const generateTrackList = jsonTracks.tracks.map((obj: any) => {
            return (
                <tr
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                    key={`${obj.track_index}#${obj.track_name}#${obj.track_artist}`}
                    tw='w-full py-2'
                >
                    <td style={{
                        fontFamily: '"InterBold"',
                        textOverflow: 'ellipsis',
                    }} tw=' w-1/6 text-2xl p-2'>{obj.track_index}</td>
                    <td style={{
                        fontFamily: '"InterMedium"',
                        textOverflow: 'ellipsis',
                    }} tw=' w-2/6 text-2xl p-2'>{obj.track_name}</td>
                    <td style={{
                        fontFamily: '"InterMedium"',
                        textOverflow: 'ellipsis',
                    }} tw='w-2/6 text-2xl p-2'>{obj.track_artist}</td>
                    <td style={{
                        fontFamily: '"InterMedium"',
                        textOverflow: 'ellipsis',
                        textAlign: 'right'
                    }} tw='w-1/6 text-2xl p-2'>{new Date(Number(obj.track_duration)).toISOString().slice(14, 19)}</td>
                </tr>
            )
        })

        return new ImageResponse(
            (
                <div tw='flex flex-col bg-neutral-800 h-full w-full p-6'>
                    {
                        nextUpImage &&
                        <img style={{
                            objectFit: 'cover',
                            filter: 'blur(15px) brightness(70%)',
                            zIndex: '0',
                            height: '200%',
                            width: '200%',
                        }} tw='absolute' src={nextUpImage} width='100%' height='200%' alt='' />
                    }

                    <h1 tw='flex items-center mb-6'>
                        <span tw='text-6xl text-white mr-5'>Queue</span>
                        <span tw='text-3xl text-green-400'>{`(Page ${jsonTracks.page})`}</span>
                    </h1>
                    <div tw='flex flex-col bg-neutral-900/50 rounded-2xl h-7/8 w-full p-6'>
                        <table tw='text-white w-full h-full'>
                            <tbody tw='flex flex-col w-full'>
                            {generateTrackList}
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
            {
                width: 1000,
                height: 1000,
                emoji: 'twemoji',
                fonts: [
                    {
                        name: 'InterBold',
                        data: InterBold,
                        style: 'normal',
                        weight: 700
                    },
                    {
                        name: 'InterRegular',
                        data: InterRegular,
                        style: 'normal',
                        weight: 400
                    },
                    {
                        name: 'InterMedium',
                        data: InterMedium,
                        style: 'normal',
                        weight: 500
                    },
                ]
            }
        )
    } catch(err) {
        return new ImageResponse(
            (
                <div tw='flex h-full w-full'>
                    <p>There was an error generating this image</p>
                </div>
            ),
            {
                width: 300,
                height: 100,
            }
        )
    }
}