import HeadingSection from "@/components/heading-section";
import Card from "@/components/card";
import Button from "@/components/button/Button";

export default function Vote() {
    return (
        <main>
            <HeadingSection heading='Vote' subheading='Thank you for taking interest in supporting us!' />
            <div className='p-12'>
                <Card
                    title='Vote For Us!'
                    description='So you&apos;d like to support us eh? Well who are we to stop you? Go right ahead!'
                    size='md'
                    className='mx-auto'
                >
                    <div className='flex justify-center gap-6 mt-6'>
                        <Button label='Top.gg' href='https://top.gg/bot/893558050504466482/vote' width={10} height={5} />
                        <Button label='Discord Bot List' href='https://discordbotlist.com/bots/robertify/upvote' width={10} height={5} />
                    </div>

                </Card>
            </div>
        </main>
    )
}