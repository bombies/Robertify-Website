import HeadingSection from "@/components/heading-section";
import Card from "@/components/card";

export default function Support() {
    return (
        <main>
            <HeadingSection heading='Support' subheading='All the help you need!' />
            <div className='p-12'>
                <Card description='hey 😏' />
            </div>
        </main>
    )
}