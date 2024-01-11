import {ImageResponse} from '@vercel/og';
import {NextApiRequest} from 'next';

export const config = {
    runtime: 'edge',
};

type ParamSearchObject = {
    searchParams: URLSearchParams;
    paramName: string;
    defaultResult?: string;
};

export const getParamFromSearch = (options: ParamSearchObject): string => {
    const {searchParams, paramName, defaultResult} = options;
    if (!searchParams) return defaultResult ?? '';
    return searchParams.get(paramName) ?? defaultResult ?? '';
};

export const getInterBold = fetch(
    new URL(
        'public/fonts/inter/Inter-Bold.ttf',
        import.meta.url,
    ).toString(),
).then((res) => res.arrayBuffer());

export const getInterRegular = fetch(
    new URL(
        'public/fonts/inter/Inter-Regular.ttf',
        import.meta.url,
    ).toString(),
).then((res) => res.arrayBuffer());

export const getInterMedium = fetch(
    new URL(
        'public/fonts/inter/Inter-Medium.ttf',
        import.meta.url,
    ).toString(),
).then((res) => res.arrayBuffer());

type Requester = {
    user_name: string;
    user_image: string;
};

export default async function handler(request: NextApiRequest) {
    const {searchParams} = new URL(request.url ?? '');
    const [InterBold, InterRegular, InterMedium] = await Promise.all([
        getInterBold,
        getInterRegular,
        getInterMedium,
    ]);

    const songTitle = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'title',
        defaultResult: 'A Song',
    });

    const artistName = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'artist',
        defaultResult: 'An artist',
    });

    const albumImage = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'album_image',
        defaultResult: `${process.env.NEXT_PUBLIC_IMAGE_SERVER_HOSTNAME}/images/syy1c.jpg`,
    });

    const duration = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'duration',
        defaultResult: '1',
    });

    const currentTime = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'current_time',
        defaultResult: '1',
    });

    const user = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'requester',
    });

    const isLiveStream = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'livestream',
    }) === 'true';

    const userObj: Requester = user ? JSON.parse(user) : undefined;

    try {
        return new ImageResponse(
            (
                <div tw="flex flex-col h-full w-full bg-neutral-800">
                    <img
                        style={{
                            objectFit: 'cover',
                            filter: 'blur(20px)',
                            opacity: '0.5',
                            zIndex: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        tw="absolute"
                        src={albumImage}
                        alt=""
                    />
                    <div tw="flex flex-col px-16 py-6 w-full h-full">
                        <div tw="flex w-full justify-between px-6">
                            <h1
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                }}
                                tw="flex flex-col text-white w-[78%]"
                            >
                <span
                    tw="uppercase mb-2 text-lg font-normal"
                    style={{
                        boxSizing: "border-box",
                        margin: 0,
                    }}
                >
                  Robertify is now playing
                </span>
                                <span
                                    style={{
                                        textOverflow: 'ellipsis',
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        boxSizing: "border-box",
                                        margin: 0,
                                    }}
                                    tw="text-6xl w-full font-bold"
                                >
                  {songTitle}
                </span>
                                <span
                                    style={{
                                        textOverflow: 'ellipsis',
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        boxSizing: "border-box",
                                        margin: 0,
                                    }}
                                    tw="text-4xl text-green-500 w-full font-medium pb-2"
                                >
                  {artistName}
                </span>
                            </h1>
                            <img
                                style={{
                                    objectFit: 'cover',
                                    width: '150px',
                                    height: '150px',
                                    boxSizing: "border-box",
                                    margin: 0,
                                }}
                                src={albumImage}
                                alt=""
                                tw="rounded-2xl border border border-neutral-200"
                                width="150px"
                                height="150px"
                            />
                        </div>
                        {userObj ? (
                            <div tw="flex flex-col">
                                <div tw="flex ml-6">
                                    <p
                                        tw="text-white text-2xl font-normal"
                                        style={{
                                            boxSizing: "border-box",
                                            margin: 0,
                                        }}
                                    >
                                        Requested by {userObj.user_name}
                                    </p>
                                    <img
                                        style={{
                                            marginLeft: "10px",
                                            objectFit: 'cover',
                                            width: '32px',
                                            height: '32px',
                                        }}
                                        src={
                                            userObj.user_image ||
                                            'https://support.discord.com/hc/user_images/l12c7vKVRCd-XLIdDkLUDg.png'
                                        }
                                        alt=""
                                        tw="rounded-full border-2 border-opacity-50 border-neutral-200 self-center"
                                        height="32px"
                                        width="32px"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div tw="flex">
                                {!isLiveStream ? (
                                    <div tw='flex flex-col'>
                                        <div tw="flex w-full justify-between text-white mb-3">
                                            <p tw='font-normal'
                                               style={{
                                                   boxSizing: "border-box",
                                                   margin: 0,
                                               }}
                                            >0:00</p>
                                            <div
                                                tw="flex w-3/4 self-center h-[.35rem] border-[0.25px] border-white rounded-full">
                                                <div
                                                    style={{
                                                        width: `${
                                                            (Number(currentTime) / Number(duration)) * 100
                                                        }%`,
                                                    }}
                                                    tw="flex h-full bg-white rounded-full"
                                                ></div>
                                            </div>
                                            <p tw='font-normal'
                                               style={{
                                                   boxSizing: "border-box",
                                                   margin: 0,
                                               }}
                                            >{new Date(Number(duration)).toISOString().slice(14, 19)}</p>
                                        </div>
                                        <div tw='flex justify-center'
                                             style={{
                                                 gap: "6px"
                                             }}
                                        >
                                            <p
                                                style={{
                                                    boxSizing: "border-box",
                                                    margin: 0,
                                                }}
                                                tw='text-white font-medium bg-green-500 p-2 rounded-2xl'>{`Currently at ${new Date(Number(currentTime)).toISOString().slice(14, 19)}`}
                                            </p>
                                            <p
                                                style={{
                                                    boxSizing: "border-box",
                                                    margin: 0,
                                                }}
                                                tw='text-white font-medium bg-green-500 p-2 rounded-2xl'>{`${new Date(Number(duration) - Number(currentTime)).toISOString().slice(14, 19)} left`}
                                            </p>
                                            {/*<p >{`@ ${new Date(Number(currentTime)).toISOString().slice(14, 19)} | ${new Date(Number(duration) - Number(currentTime)).toISOString().slice(14, 19)} left `}</p>*/}
                                        </div>
                                    </div>
                                ) : (
                                    <div tw="flex w-full justify-between text-white">
                                        <p
                                            tw='font-normal'
                                            style={{
                                                letterSpacing: '.75em',
                                            }}
                                        >
                                            ⏺️ LIVESTREAM
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ),
            {
                width: 900,
                height: 300,
                fonts: [
                    {
                        name: 'Inter',
                        data: InterBold,
                        style: 'normal',
                        weight: 700,
                    },
                    {
                        name: 'Inter',
                        data: InterRegular,
                        style: 'normal',
                        weight: 400,
                    },
                    {
                        name: 'Inter',
                        data: InterMedium,
                        style: 'normal',
                        weight: 500,
                    },
                ],
            },
        );
    } catch (err) {
        console.error(err);
        return new ImageResponse(
            (
                <div tw="flex h-full w-full">
                    <p>
                        There was an error generating this image. Please contact the
                        developers.
                    </p>
                </div>
            ),
            {
                width: 300,
                height: 100,
            },
        );
    }
}