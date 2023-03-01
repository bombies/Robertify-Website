import Card from "@/components/card";
import Button from "@/components/button/Button";
import HeadingSection from "@/components/heading-section";

export default function TermsOfService() {
    return (
        <main className='min-h-screen'>
            <HeadingSection heading='Terms of Service' >
                <div className='flex phone:flex-col gap-6 pointer-events-auto justify-center'>
                </div>
            </HeadingSection>
            <div className='p-12 flex flex-col gap-y-6 mx-auto justify-center'>
                <Card
                    className='mx-auto'
                    title='Test card'
                    description='Test descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest desc'
                    size='xl'
                    spacers
                >
                    <Button label='Test Component' width={12} height={3} />
                </Card>
                <Card
                    className='mx-auto'
                    title='Test card'
                    description='Test descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest desc'
                    size='xl'
                    spacers
                >
                    <Button label='Test Component' width={12} height={3} />
                </Card>
                <Card
                    className='mx-auto'
                    title='Test card'
                    description='Test descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest desc'
                    size='xl'
                    spacers
                >
                    <Button label='Test Component' width={12} height={3} />
                </Card>
                <Card
                    className='mx-auto'
                    title='Test card'
                    description='Test descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest descTest desc'
                    size='xl'
                    spacers
                >
                    <Button label='Test Component' width={12} height={3} />
                </Card>
            </div>

        </main>
    )
}