import {getParamFromSearch} from "../../../utils/APIUtils";
import {NextApiRequest, NextApiResponse} from "next";
import {ImageResponse} from "@vercel/og";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET')
        return res.status(400).json({ error: `You cannot ${req.method} this route!` })

    const { searchParams } = new URL(req.url ?? '');

    const title = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'title',
        defaultResult: 'Default Title'
    });

    const subTitle = getParamFromSearch({
        searchParams: searchParams,
        paramName: 'subtitle',
        defaultResult: 'Default Sub-Title'
    });


    return new ImageResponse(
        (
            <div tw='flex flex-col justify-center px-12 h-full w-full bg-neutral-800'>
                <div tw='flex'>
                    <h1 tw='flex flex-col text-2xl text-white font-bold'>
                        <span>{title}</span>
                        <span tw={'text-green-300'}>{subTitle}</span>
                    </h1>
                </div>
                <div tw ='flex bg-green-500 rounded-2xl w-3/4 p-6'>
                    <h1 tw='text-4xl text-white'>{`The current time is ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`}</h1>
                </div>
            </div>
        ),
        {
            width: 900,
            height: 300,
        }
    )
}

export default handler;

export const config = {
    runtime: 'experimental-edge'
}