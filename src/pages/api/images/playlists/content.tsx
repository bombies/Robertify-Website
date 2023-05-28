import {NextApiRequest} from "next";
import {getInterBold, getInterMedium, getParamFromSearch} from "@/pages/api/images/music/nowplaying";
import {ImageResponse} from "@vercel/og/dist/index.edge";
import {parseTheme} from "@/pages/api/images/music/queue";

export const config = {
    runtime: 'edge',
};

export default async function handler(request: NextApiRequest) {
    const { searchParams } = new URL(request.url ?? '');
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