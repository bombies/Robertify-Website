'use client';

type Props = {
    size: number,
    className?: string,
    centered?: boolean
}

const Spinner = (props: Props) => {
    return (
        <div className={`self-center ${props.centered ? 'mx-auto' : ''} ${props.className || ''}`} role="status">
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

export default Spinner