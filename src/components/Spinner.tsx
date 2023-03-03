'use client';

type Props = {
    size: number;
}

export default function Spinner(props: Props) {
    return (
        <div className="self-center" role="status">
            <div
                style={{
                    width: props.size + 'rem',
                    height: props.size + 'rem'
                }}
                className="animate-spin rounded-full border-[3px] border-white border-r-transparent"
            />
        </div>
    )
}