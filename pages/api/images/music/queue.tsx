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
    })

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

        const generateTrackList = jsonTracks.tracks.map(obj => {
            return (
                <tr
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                    key={`${obj.track_name}#${obj.track_artist}`}
                    tw='w-full py-2'
                >
                    <td style={{
                        fontFamily: '"MontserratMedium"',
                        textOverflow: 'ellipsis',
                    }} tw=' w-2/5 text-2xl p-2'>{obj.track_name}</td>
                    <td style={{
                        fontFamily: '"MontserratMedium"',
                        textOverflow: 'ellipsis',
                    }} tw='w-2/5 text-2xl p-2'>{obj.track_artist}</td>
                    <td style={{
                        fontFamily: '"MontserratMedium"',
                        textOverflow: 'ellipsis',
                        textAlign: 'right'
                    }} tw='w-1/5 text-2xl p-2'>{new Date(Number(obj.track_duration)).toISOString().slice(14, 19)}</td>
                </tr>
            )
        })
        
        return new ImageResponse(
            (
                <div tw='flex flex-col bg-neutral-800 h-full w-full p-12'>
                    <h1 tw='flex items-center mb-6'>
                        <span tw='text-6xl text-white mr-5'>Queue</span>
                        <span tw='text-3xl text-green-400'>{`(Page ${jsonTracks.page})`}</span>
                    </h1>
                    <div tw='flex flex-col bg-neutral-900 rounded-2xl h-7/8 w-full p-12'>
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

export default handler;

export const config = {
    runtime: 'experimental-edge'
}