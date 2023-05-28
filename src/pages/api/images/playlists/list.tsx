import {NextApiRequest} from "next";
import {getInterBold, getInterMedium, getParamFromSearch} from "@/pages/api/images/music/nowplaying";
import {parseTheme} from "@/pages/api/images/music/queue";
import {ImageResponse} from "@vercel/og";

export const config = {
    runtime: 'edge',
};

type PlaylistModel = {
    playlist_title: string,
    playlist_track_count: string,
    playlist_artwork_url: string,
    playlist_index: string,
}

export default async function handler(request: NextApiRequest) {
    const {searchParams} = new URL(request.url ?? '');
    const [InterBold, InterMedium] = await Promise.all([getInterBold, getInterMedium]);

    const theme = parseTheme(getParamFromSearch({
        searchParams: searchParams,
        paramName: 'theme'
    }))

    const page = parseInt(getParamFromSearch({
        searchParams: searchParams,
        paramName: 'page',
        defaultResult: '0'
    }))

    const playlists: PlaylistModel[] = JSON.parse(getParamFromSearch({
        searchParams: searchParams,
        paramName: 'playlists',
        defaultResult: JSON.stringify([
            {
                playlist_title: 'Playlist Title',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Title',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Title',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Title',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Title',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Titleeeeeeeeeeeeee',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Titleee',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Titleeeeeeeeeeeeeeeeeeeeeeeee',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Titleeeeeeeeeeeeee',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            },
            {
                playlist_title: 'Playlist Titleeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                playlist_track_count: '100',
                playlist_artwork_url: 'https://i.pinimg.com/originals/f4/d0/68/f4d06886fca46d12183ee8cbb75d2c21.jpg',
            }
        ])
    }))

    const playlistElements = playlists.map((playlist =>
        <tr
            tw='flex w-full p-2'
            key={playlist.playlist_title + playlist.playlist_index}
            style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}
        >
            <td
                tw='self-center text-white w-1/6'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{playlist.playlist_index ?? '???'}</td>
            <td
                tw='w-1/6'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >
                <img
                    tw='rounded-2xl'
                    src={playlist.playlist_artwork_url}
                    width={64}
                    height={64}
                    alt=''
                    style={{
                        objectFit: 'cover',
                        borderWidth: '2px',
                        borderColor: theme + 75,
                    }}
                />
            </td>
            <td
                tw='w-1/3 self-center text-white'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{playlist.playlist_title}</td>
            <td
                tw='w-1/3 self-center text-white'
                style={{
                    textOverflow: 'ellipsis',
                }}
            >{`${playlist.playlist_track_count} tracks`}</td>
        </tr>
    ))

    return new ImageResponse((
        <div tw='flex flex-col h-full w-full bg-neutral-900 p-6'>
            <div
                tw='flex w-full rounded-2xl p-3 mb-3'
                style={{
                    borderWidth: '2px',
                    borderColor: theme + 50,
                    backgroundColor: theme + "10"
                }}
            >
                <p tw='font-bold text-5xl text-white'>
                    Your Playlists
                    <span
                        tw='text-xl self-center ml-6'
                        style={{
                            color: theme
                        }}
                    >{`(Page ${page})`}</span>
                </p>
            </div>
            <div
                tw='flex w-full rounded-2xl p-3'
                style={{
                    borderWidth: '2px',
                    borderColor: theme + 50,
                    backgroundColor: theme + "05"
                }}
            >
                <table tw='flex flex-col text-white w-full h-full'
                    style={{
                        tableLayout: 'auto'
                    }}
                >
                    <thead>
                        <tr tw='mb-2'>
                            <th tw='w-1/6 font-bold text-lg'>ID</th>
                            <th tw='w-1/6 font-bold text-lg'>Playlist Image</th>
                            <th tw='w-1/3 font-bold text-lg'>Playlist Name</th>
                            <th tw='w-1/3 font-bold text-lg'>Track Count</th>
                        </tr>
                    </thead>
                    <tbody tw='flex flex-col w-full'>
                        {playlistElements}
                    </tbody>
                </table>
            </div>
        </div>
    ), {
        width: 1000,
        height: 1100,
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