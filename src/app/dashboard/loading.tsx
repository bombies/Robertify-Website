import InputContext from "@/components/input-context";
import Image from "next/image";
import searchIcon from "../../../public/search.svg";
import SkeletonCard from "@/components/skeletons/skeleton-card";
import GenericImage from "@/app/_components/GenericImage";

export default function Loading() {
    return (
        <main className='p-12 min-h-screen'>
            <h1 className='text-primary drop-shadow-glow-primary-lg text-center'>Welcome to your dashboard</h1>
            <div>
                <div className='flex justify-center'>
                    <InputContext
                        disabled={true}
                        size='xl'
                        placeholder='Search...'
                        contentRight={<GenericImage src={searchIcon} width={1.5} />}
                        aria-label='search-input'
                    />
                </div>
                <div
                    className='grid grid-cols-3 dark:bg-neutral-900/50 bg-neutral-600/5 backdrop-blur-lg rounded-xl p-6 laptop-big:grid-cols-2 phone:grid-cols-1  mt-6 place-items-center gap-12 phone:gap-3'>
                    <SkeletonCard size='xs'/>
                    <SkeletonCard size='xs'/>
                    <SkeletonCard size='xs'/>
                    <SkeletonCard size='xs'/>
                    <SkeletonCard size='xs'/>
                    <SkeletonCard size='xs'/>
                </div>
            </div>
        </main>
    )
}