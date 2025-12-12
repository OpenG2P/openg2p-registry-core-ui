"use client";

import Image from "next/image";
import Link from "next/link";

type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface BreadcrumbBarProps {
    breadcrumb?: BreadcrumbItem[];
}

export default function BreadcrumbBar({ breadcrumb = [] }: BreadcrumbBarProps) {
    return (
        <div className="flex items-center gap-2">

            <Link href="/" passHref>
                <div className="h-[30px] flex items-center px-3 border rounded bg-white cursor-pointer hover:bg-gray-100">
                    <Image src="/home.png" width={20} height={20} alt="home" />
                </div>
            </Link>

            {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;

                return (
                    <div
                        key={index}
                        className="flex items-center gap-2"
                    >
                        <div className="h-[30px] flex items-center px-3 border rounded bg-white text-sm text-gray-700 hover:bg-gray-100">

                            {item.href && !isLast ? (
                                <Link href={item.href} passHref>
                                    {item.label}
                                </Link>
                            ) : (
                                <span>{item.label}</span>
                            )}

                        </div>
                    </div>
                );
            })}
        </div>
    );
}
