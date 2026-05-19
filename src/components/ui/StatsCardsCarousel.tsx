"use client";

import { useEffect, useState, type ComponentType } from "react";
import Image from "next/image";

const VISIBLE_COUNT = 4;

interface StatsCardsCarouselProps<T extends string> {
    cards: T[];
    activeCard: T;
    onSelectCard: (card: T) => void;
    StatsCardComponent: ComponentType<{
        stats_endpoint: string;
        active?: boolean;
    }>;
    statsEndpointFor: (type: T) => string;
}

export default function StatsCardsCarousel<T extends string>({
    cards,
    activeCard,
    onSelectCard,
    StatsCardComponent,
    statsEndpointFor,
}: StatsCardsCarouselProps<T>) {
    const maxOffset = Math.max(0, cards.length - VISIBLE_COUNT);
    const [offset, setOffset] = useState(0);

    const activeIndex = cards.indexOf(activeCard);

    // Only adjust the window when the user selects a card — not when arrows change offset.
    useEffect(() => {
        if (activeIndex < 0) return;
        setOffset((current) => {
            if (activeIndex < current) return activeIndex;
            if (activeIndex >= current + VISIBLE_COUNT) {
                return activeIndex - VISIBLE_COUNT + 1;
            }
            return current;
        });
    }, [activeIndex]);

    const visibleCards = cards.slice(offset, offset + VISIBLE_COUNT);
    const canScrollBack = offset > 0;
    const canScrollForward = offset < maxOffset;

    const scrollBack = () => {
        const nextOffset = Math.max(0, offset - 1);
        setOffset(nextOffset);
        onSelectCard(cards[nextOffset]);
    };

    const scrollForward = () => {
        const nextOffset = Math.min(maxOffset, offset + 1);
        setOffset(nextOffset);
        const lastVisibleIndex = Math.min(
            nextOffset + VISIBLE_COUNT - 1,
            cards.length - 1,
        );
        onSelectCard(cards[lastVisibleIndex]);
    };

    const arrowButtonClass =
        'relative z-10 shrink-0 self-center flex h-[30px] w-[30px] items-center justify-center rounded-[30px] bg-secondary-second cursor-pointer';

    return (
        <div className="relative w-full flex items-stretch gap-2">
            {canScrollBack && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        scrollBack();
                    }}
                    className={arrowButtonClass}
                    aria-label="Show previous stats cards"
                >
                    <Image
                        src="/images/common/black_arrow.png"
                        width={20}
                        height={20}
                        alt=""
                        className="rotate-180"
                    />
                </button>
            )}

            <div className="flex flex-1 min-w-0 overflow-hidden gap-4 sm:gap-5 lg:gap-6">
                {visibleCards.map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onSelectCard(type)}
                        className="bg-transparent p-0 text-left flex-1 min-w-0"
                    >
                        <StatsCardComponent
                            stats_endpoint={statsEndpointFor(type)}
                            active={activeCard === type}
                        />
                    </button>
                ))}
            </div>

            {canScrollForward && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        scrollForward();
                    }}
                    className={arrowButtonClass}
                    aria-label="Show more stats cards"
                >
                    <Image
                        src="/images/common/black_arrow.png"
                        width={20}
                        height={20}
                        alt=""
                    />
                </button>
            )}
        </div>
    );
}

