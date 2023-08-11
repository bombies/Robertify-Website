import searchIcon from "../../../public/search.svg";
import SkeletonCard from "@/components/skeletons/skeleton-card";
import GenericImage from "@/app/_components/GenericImage";
import {Chip} from "@nextui-org/chip";
import React from "react";
import {Input} from "@nextui-org/input";

export default function Loading() {
    return (
        <main className='p-12 phone:px-6 min-h-screen'>
            <div className='flex justify-center gap-4 mb-6'>
                <h1 className='text-primary text-3xl phone:text-xl drop-shadow-glow-primary-lg self-center uppercase font-bold !m-0'>
                    Welcome to your dashboard
                </h1>
                <Chip
                    variant="flat"
                    color='primary'
                    size='sm'
                    className="self-center"
                >BETA</Chip>
            </div>
            <div className='mx-auto w-1/2'>
                <Input
                    disabled={true}
                    size='lg'
                    placeholder='Search...'
                    startContent={<GenericImage src={searchIcon} width={1.5}/>}
                    aria-label='Guild Search Input'
                    classNames={{
                        inputWrapper: "dark:bg-neutral-900/50 border-1 border-black/10 dark:border-white/10"
                    }}
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
        </main>
    )
}