import {ImageResponse} from '@vercel/og';

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
        '../../../../../../public/fonts/inter/Inter-Bold.ttf',
        import.meta.url,
    ).toString(),
).then((res) => res.arrayBuffer());

export const getInterRegular = fetch(
    new URL(
        '../../../../../../public/fonts/inter/Inter-Regular.ttf',
        import.meta.url,
    ).toString(),
).then((res) => res.arrayBuffer());

export const getInterMedium = fetch(
    new URL(
        '../../../../../../public/fonts/inter/Inter-Medium.ttf',
        import.meta.url,
    ).toString(),
).then((res) => res.arrayBuffer());

type Requester = {
    user_name: string;
    user_image: string;
};

export async function GET(request: Request) {
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
                            filter: 'blur(15px) brightness(70%)',
                            zIndex: '0',
                            height: '200%',
                            width: '200%',
                        }}
                        tw="absolute"
                        src={albumImage}
                        width="100%"
                        height="200%"
                        alt=""
                    />
                    <div tw="flex flex-col px-16 py-12 w-full h-full">
                        <div tw="flex w-full justify-between px-6">
                            <h1
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                }}
                                tw="flex flex-col text-white w-[78%]"
                            >
                <span
                    style={{fontFamily: '"InterRegular"'}}
                    tw="uppercase mb-2 text-lg"
                >
                  Robertify is now playing
                </span>
                                <span
                                    style={{
                                        fontFamily: '"InterBold"',
                                        textOverflow: 'ellipsis',
                                    }}
                                    tw="text-6xl w-full"
                                >
                  {songTitle}
                </span>
                                <span
                                    style={{
                                        fontFamily: '"InterMedium"',
                                        textOverflow: 'ellipsis',
                                    }}
                                    tw="text-4xl text-green-500 w-full"
                                >
                  {artistName}
                </span>
                            </h1>
                            <img
                                style={{
                                    objectFit: 'cover',
                                    width: '150px',
                                    height: '150px',
                                }}
                                src={albumImage}
                                alt=""
                                tw="rounded-2xl border-2 border-opacity-50 border-neutral-200"
                                width="150px"
                                height="150px"
                            />
                        </div>
                        {userObj ? (
                            <div tw="flex flex-col">
                                <div tw="flex">
                                    <p
                                        style={{fontFamily: '"InterRegular"'}}
                                        tw="text-white text-2xl mr-2"
                                    >
                                        Requested by {userObj.user_name}
                                    </p>
                                    <img
                                        style={{
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
                                        <div tw="flex w-full justify-between text-white">
                                            <p style={{fontFamily: '"InterRegular"'}}>0:00</p>
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
                                            <p style={{fontFamily: '"InterRegular"'}}>{new Date(Number(duration)).toISOString().slice(14, 19)}</p>
                                        </div>
                                        <div tw='flex justify-center'>
                                            <p tw='text-white'
                                               style={{fontFamily: '"InterMedium"'}}>{`@ ${new Date(Number(currentTime)).toISOString().slice(14, 19)} | ${new Date(Number(duration) - Number(currentTime)).toISOString().slice(14, 19)} left `}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div tw="flex w-full justify-between text-white">
                                        <p
                                            style={{
                                                fontFamily: '"InterRegular"',
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
                        name: 'InterBold',
                        data: InterBold,
                        style: 'normal',
                        weight: 700,
                    },
                    {
                        name: 'InterRegular',
                        data: InterRegular,
                        style: 'normal',
                        weight: 400,
                    },
                    {
                        name: 'InterMedium',
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