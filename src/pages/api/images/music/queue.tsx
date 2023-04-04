import { ImageResponse } from "@vercel/og";
import { NextApiRequest } from "next";
import { getInterBold, getInterMedium, getParamFromSearch } from "./nowplaying";

export const config = {
    runtime: 'edge',
};

export default async function(request: NextApiRequest) {
    const { searchParams } = new URL(request.url ?? '');
    const [InterBold, InterMedium] = await Promise.all([getInterBold, getInterMedium]);

    const tracks = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'tracks',
        defaultResult: `${JSON.stringify({
            page: 1,
            tracks: [
                {
                    track_index: 0,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 1,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 2,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 3,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 4,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 5,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 6,
                    track_name: 'A track',
                    track_artist: 'An artist',
                    track_duration: '0'
                },
                {
                    track_index: 7,
                    track_name: 'A track with',
                    track_artist: 'An artist with',
                    track_duration: '10'
                },
                {
                    track_index: 8,
                    track_name: 'A track with a',
                    track_artist: 'An artist with a',
                    track_duration: '100'
                },
                {
                    track_index: 9,
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
                <div tw='flex flex-col bg-neutral-800 h-full w-full'>
                    {
                        nextUpImage &&
                        <img style={{
                            objectFit: 'cover',
                            filter: 'blur(70px) brightness(50%)',
                            opacity: '0.5',
                            zIndex: "-1",
                            width: '100%',
                            height: '100%',
                        }} tw='absolute m-0 p-0' src={nextUpImage} alt='' />
                    }
                    <div style={{
                        zIndex: "10",
                    }} tw="flex flex-col p-6">
                        <h1 tw='flex items-center mb-6'>
                            <span tw='text-6xl text-white mr-5'>Queue</span>
                            <span tw='text-3xl text-green-400 self-center'>{`(Page ${jsonTracks.page})`}</span>
                        </h1>
                        <div tw='flex flex-col bg-neutral-900/50 rounded-2xl h-7/8 w-full p-6'>
                            <table tw='text-white w-full h-full'>
                                <tbody tw='flex flex-col w-full'>
                                    {generateTrackList}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 900,
                height: 800,
                fonts: [
                    {
                        name: 'InterBold',
                        data: InterBold,
                        style: 'normal',
                        weight: 700
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
    } catch (err) {
        console.error(err)
        return new ImageResponse(
            (
                <div tw='flex h-full w-full'>
                    <p>There was an error generating this image. Please contact the developers.</p>
                </div>
            ),
            {
                width: 300,
                height: 100,
            }
        )
    }
}