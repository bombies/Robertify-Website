import Card from "@/components/card";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className='h-screen flex justify-center items-center'>
            <div className='text-center'>
                <h1 className='text-9xl font-bold text-primary tracking-widest drop-shadow-glow-primary-lg'>404</h1>
                <h3>I couldn't find what you were looking for. :(</h3>
                <p className='trakcing-wide'>Need help? Check out our <Link href='/docs'>documentation</Link></p>
            </div>
        </main>
    )
}