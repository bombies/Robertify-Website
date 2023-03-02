import HeadingSection from "@/components/heading-section";
import Button from "@/components/button/Button";
import {ButtonType} from "@/components/button/ButtonType";

export default function Loading() {
    return (
        <main className={'min-h-screen'}>
            <HeadingSection heading='Robertify' subheading='A discord music bot that with a multitude of features that will fit your liking.'>
                <div className='flex phone:flex-col gap-6 pointer-events-auto justify-center'>
                    <Button label='INVITE' className='phone:mx-auto' type={ButtonType.INVERTED} width={10} height={3} href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK} />
                    <Button label='LEARN MORE' className='phone:mx-auto' type={ButtonType.INVERTED} width={10} height={3} href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK} />
                </div>
            </HeadingSection>

            <div className='p-32 laptop:p-16 tablet:p-4 phone:p-2'></div>
        </main>
    )
}