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
                <div className="h-[30px] flex items-center rounded pr-2 cursor-pointer ">
                    <Image src="/home.png" width={22} height={22} alt="home" />
                </div>
            </Link>

            {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;

                return (
                    <div
                        key={index}
                        className="flex items-center gap-2"
                    >
                        <div className="w-[97px] h-[23px] flex font-medium text-[20px] text-black ">
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
