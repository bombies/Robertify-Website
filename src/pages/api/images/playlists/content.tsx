import {NextApiRequest} from "next";
import {getInterBold, getInterMedium, getParamFromSearch} from "@/pages/api/images/music/nowplaying";
import {ImageResponse} from "@vercel/og/dist/index.edge";
import {parseTheme} from "@/pages/api/images/music/queue";
import {ImageParams} from "@/pages/api/images/(utils)/ImageParams";

type PlaylistTrack = {
    track_title: string,
    track_author: string,
    track_duration: string,
    track_identifier: string,
    track_index: string,
}

enum SortingOrder {
    ASCENDING_DATE_ADDED,
    DESCENDING_DATE_ADDED,
    ASCENDING_NAME,
    ASCENDING_ARTIST,
    DESCENDING_NAME,
    DESCENDING_ARTIST,
    NONE
}

const parseSortingOrder = (ordinal: number) => {
    switch (ordinal) {
        case 0: return SortingOrder.ASCENDING_DATE_ADDED
        case 1: return SortingOrder.DESCENDING_DATE_ADDED
        case 2: return SortingOrder.ASCENDING_NAME
        case 3: return SortingOrder.ASCENDING_ARTIST
        case 4: return SortingOrder.DESCENDING_NAME
        case 5: return SortingOrder.DESCENDING_ARTIST
        case 6: return SortingOrder.NONE
    }
}

export const config = {
    runtime: 'edge',
};

export default async function handler(request: NextApiRequest) {
    const { searchParams } = new URL(request.url ?? '');
    const imageParams = new ImageParams(searchParams)
    const [InterBold, InterMedium] = await Promise.all([getInterBold, getInterMedium]);

    const theme = parseTheme(imageParams.get("theme"))
    const page = parseInt(imageParams.get("page", "0"))
    const title = imageParams.get("title", "A Playlist")
    const description = imageParams.get("description", "Default description")
    const artworkUrl = imageParams.get("artwork_url")
    const totalDuration = imageParams.get("total_duration", "10000")
    const trackCount = imageParams.get("track_count", "10")
    const tracks: PlaylistTrack[] = JSON.parse(imageParams.get("tracks", JSON.stringify([
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '0'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '1'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '2'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '3'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '4'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '5'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '6'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '7'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '8'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '9'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '10'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '11'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '12'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '13'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '14'
        },
        {
            track_title: 'A Track',
            track_author: 'Author',
            track_duration: '30000',
            track_identifier: 'track:uri:here',
            track_index: '15'
        },
    ])))
    const sortBy = parseSortingOrder(parseInt(imageParams.get("sort_by", "6")))

    const trackElements = tracks.map(track =>
        <tr
            tw='flex w-full py-2'
            key={track.track_title + track.track_index}
            style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}
        >
            <td
                tw='self-center text-white w-1/4'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{track.track_index ?? '???'}</td>
            <td
                tw='w-1/4 self-center text-white'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{track.track_title}</td>
            <td
                tw='w-1/4 self-center text-white'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{track.track_author}</td>
            <td
                tw='w-1/4 self-center text-white'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{`${track.track_duration} tracks`}</td>
        </tr>
    )

    return new ImageResponse((
        <div>

        </div>
    ), {
        width: 1000,
        height: 1000,
        fonts: [
            {
                name: 'Inter',
                data: InterBold,
                style: 'normal',
                weight: 700,
            },
            {
                name: 'Inter',
                data: InterMedium,
                style: 'normal',
                weight: 500,
            },
        ],
    })
}