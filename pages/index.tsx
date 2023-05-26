import getConfig from 'next/config';
import { useState } from 'react';
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Datasets", href: "/dataset" },
  { name: "Data Story", href: "/stories/case_1" },
];
  
  export default function Home() {
  
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-sky-100">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center p-6 lg:px-8" aria-label="Global">
                    <div className="flex flex-1 justify-center lg:gap-x-10">
                        {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            {item.name}
                        </a>
                        ))}
                    </div>
                </nav>
            </header>
            <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
                <h1 className="text-9xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Portal.js Data Portal 
                </h1>
                <p className="mt-8 text-lg leading-8 text-gray-600">
                My Data Portal Hackathon Using Ckan Backend
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/dataset"
                        className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
                    >
                        Datasets
                    </Link>
                    <Link
                        href="/stories/case_1"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Data Story<span aria-hidden="true">→</span>
                    </Link>
                </div>
                </div>
                </div>
            </div>
        </main>      
    );
  }
  