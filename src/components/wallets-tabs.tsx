"use client";

import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import { getWallets } from "@/actions/wallets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { WalletDetails } from "@/components/wallet-details";
import { QRCodeGrid } from "@/components/qr-code-grid";
import { useSidebar } from "./ui/sidebar";

interface Wallet {
    _id: string;
    name: string;
    logo: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    status: string;
}

export function WalletTabs() {
    const [allWallets, setAllWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const { state: sidebarState } = useSidebar();

    // Scroll control
    const tabsBoxRef = useRef<HTMLUListElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Add a lastSidebarState ref to track sidebar state changes
    const lastSidebarStateRef = useRef(sidebarState);

    useEffect(() => {
        fetchAllWallets();
    }, []);

    // A dedicated function to update dimensions that can be called from multiple places
    const updateDimensions = () => {
        if (containerRef.current) {
            const newWidth = containerRef.current.offsetWidth;
            console.log("Container width updated:", newWidth);
            setContainerWidth(newWidth);

            // Force a reflow of tab elements
            if (tabsBoxRef.current) {
                // Reset scroll position to prevent any unintended positioning
                if (lastSidebarStateRef.current !== sidebarState) {
                    tabsBoxRef.current.scrollLeft = 0;
                }

                // Update last sidebar state
                lastSidebarStateRef.current = sidebarState;

                // Check arrows immediately
                requestAnimationFrame(() => {
                    checkScrollArrows();
                });
            }
        }
    };

    // Set up ResizeObserver to handle container width changes
    useEffect(() => {
        // Update container width measurement
        updateDimensions();

        // Set up ResizeObserver for more reliable size tracking
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            resizeObserverRef.current = new ResizeObserver(() => {
                updateDimensions();
            });

            resizeObserverRef.current.observe(containerRef.current);
        }

        // Standard resize event as backup
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);

            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, []);  // Empty dependency array - we're using refs instead

    // Handle sidebar state changes specifically with multiple timers
    useEffect(() => {
        console.log("Sidebar state changed:", sidebarState);

        // Series of timers to catch the layout at different points of animation
        const timers = [100, 200, 400, 600].map(delay =>
            setTimeout(() => {
                console.log("Checking layout at", delay, "ms");
                updateDimensions();
            }, delay)
        );

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [sidebarState]);

    // Function to check if we should show scroll arrows
    const checkScrollArrows = () => {
        if (tabsBoxRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsBoxRef.current;

            // Show left arrow if scrolled right
            setShowLeftArrow(scrollLeft > 1);

            // Show right arrow if more content to scroll
            // Add a larger buffer to prevent arrow flashing near the edge
            const hasMoreContent = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5;
            setShowRightArrow(hasMoreContent);

            console.log("Arrow visibility:", {
                left: scrollLeft > 1,
                right: hasMoreContent,
                scrollLeft,
                clientWidth,
                scrollWidth,
                totalScroll: scrollLeft + clientWidth,
                hasMore: Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5
            });
        }
    };

    // Improved scroll calculation based on container size
    const scrollTabs = (direction: 'left' | 'right') => {
        if (tabsBoxRef.current) {
            // Use a fixed amount for consistent scrolling
            const scrollFactor = 0.5; // Scroll half the container width
            const scrollAmount = direction === 'left'
                ? -(containerWidth * scrollFactor)
                : (containerWidth * scrollFactor);

            tabsBoxRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });

            // Update arrow visibility after animation
            setTimeout(checkScrollArrows, 350);
        }
    };

    // Rest of your component remains unchanged...
    // Start dragging
    const handleMouseDown = (e: ReactMouseEvent) => {
        if (tabsBoxRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - tabsBoxRef.current.offsetLeft);
            setScrollLeft(tabsBoxRef.current.scrollLeft);

            // Apply grabbing cursor to the whole document during drag
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
    };

    // Handle mouse move during drag
    const handleMouseMove = (e: ReactMouseEvent) => {
        if (!isDragging || !tabsBoxRef.current) return;

        e.preventDefault(); // Prevent text selection during drag

        const x = e.pageX - tabsBoxRef.current.offsetLeft;
        // Use a fixed multiplier for consistency
        const multiplier = 1.5;
        const walk = (x - startX) * multiplier;

        tabsBoxRef.current.scrollLeft = scrollLeft - walk;
        checkScrollArrows();
    };

    // End dragging
    const handleDragStop = () => {
        setIsDragging(false);
        // Reset cursor and user-select
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    // Fetch wallet data
    const fetchAllWallets = async () => {
        try {
            setLoading(true);
            const { data, error } = await getWallets({
                limit: 100,
                status: 'active'
            });

            if (error) {
                toast({
                    title: "Error",
                    description: error,
                    variant: "destructive",
                });
            } else if (data?.data) {
                const activeWallets = data.data.filter(
                    (wallet: Wallet) => wallet.status === "active"
                );
                setAllWallets(activeWallets);

                // Select first wallet by default
                if (activeWallets.length > 0) {
                    setSelectedWallet(activeWallets[0]);
                }

                // Check scroll arrows after wallets load - use multiple timers
                [100, 300, 500].forEach(delay => {
                    setTimeout(() => {
                        updateDimensions();
                    }, delay);
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load wallets",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle wallet selection
    const handleWalletSelect = (wallet: Wallet) => {
        setSelectedWallet(wallet);
    };

    const handleViewRequests = () => {
        router.push('/requests');
    };

    if (loading && allWallets.length === 0) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (allWallets.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <h2 className="text-xl font-medium mb-2">No Payment Methods Available</h2>
                    <p className="text-muted-foreground">
                        Please contact support to set up payment methods.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full max-w-full overflow-x-hidden"
            // Force redraw on sidebar state changes
            key={`wallet-tabs-${sidebarState}`}
        >
            <Tabs
                defaultValue={selectedWallet?._id || allWallets[0]?._id}
                value={selectedWallet?._id}
                onValueChange={(value) => {
                    const wallet = allWallets.find(w => w._id === value);
                    if (wallet) handleWalletSelect(wallet);
                }}
                className="w-full"
            >
                {/* Custom draggable tab slider */}
                <Card className="mb-6 border-b-0 rounded-b-none overflow-hidden">
                    <CardContent className="p-0 overflow-hidden">
                        <div className="relative bg-muted/30 py-2 overflow-hidden">
                            {/* Left arrow */}
                            {showLeftArrow && (
                                <div className="absolute left-0 top-0 h-full w-[60px] md:w-[80px] flex items-center bg-gradient-to-r from-background/90 to-transparent z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-1 md:ml-2 h-8 w-8 rounded-full bg-background shadow"
                                        onClick={() => scrollTabs('left')}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Right arrow */}
                            {showRightArrow && (
                                <div className="absolute right-0 top-0 h-full w-[60px] md:w-[80px] flex items-center justify-end bg-gradient-to-l from-background/90 to-transparent z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-1 md:mr-2 h-8 w-8 rounded-full bg-background shadow"
                                        onClick={() => scrollTabs('right')}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Tabs container - ensure it doesn't expand beyond parent */}
                            <div className="overflow-hidden w-full">
                                {/* Tabs box - draggable */}
                                <ul
                                    ref={tabsBoxRef}
                                    className={cn(
                                        "flex gap-2 list-none overflow-x-auto py-1 px-4 no-scrollbar scroll-smooth w-full",
                                        isDragging && "cursor-grabbing select-none"
                                    )}
                                    onScroll={checkScrollArrows}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleDragStop}
                                    onMouseLeave={handleDragStop}
                                    // Touch support
                                    onTouchStart={(e) => {
                                        if (tabsBoxRef.current) {
                                            setIsDragging(true);
                                            setStartX(e.touches[0].clientX - tabsBoxRef.current.offsetLeft);
                                            setScrollLeft(tabsBoxRef.current.scrollLeft);
                                        }
                                    }}
                                    onTouchMove={(e) => {
                                        if (!isDragging || !tabsBoxRef.current) return;
                                        const x = e.touches[0].clientX - tabsBoxRef.current.offsetLeft;
                                        const multiplier = 1.5;
                                        const walk = (x - startX) * multiplier;
                                        tabsBoxRef.current.scrollLeft = scrollLeft - walk;
                                        checkScrollArrows();
                                    }}
                                    onTouchEnd={handleDragStop}
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        msOverflowStyle: 'none',
                                        scrollbarWidth: 'none'
                                    }}
                                >
                                    {allWallets.map((wallet) => (
                                        <li
                                            key={wallet._id}
                                            onClick={() => handleWalletSelect(wallet)}
                                            className={cn(
                                                "cursor-pointer whitespace-nowrap bg-secondary/40 py-2 px-3 rounded-full",
                                                "flex items-center gap-1 transition-all border text-sm",
                                                "flex-shrink-0 min-w-[120px]", // Set a minimum width for all screens 
                                                "md:min-w-[140px]",
                                                selectedWallet?._id === wallet._id
                                                    ? "bg-primary text-primary-foreground border-transparent"
                                                    : "hover:bg-secondary border-border"
                                            )}
                                            role="tab"
                                            aria-selected={selectedWallet?._id === wallet._id}
                                            tabIndex={0}
                                        >
                                            <div className="relative h-5 w-5 shrink-0">
                                                <Image
                                                    src={wallet.logo}
                                                    alt={wallet.name}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                            <span className="truncate">{wallet.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tab content */}
                <div className="overflow-hidden">
                    {allWallets.map((wallet) => (
                        <TabsContent key={wallet._id} value={wallet._id} className="m-0">
                            <Card>
                                <WalletDetails wallet={wallet} />
                                <CardContent className="space-y-6">
                                    <QRCodeGrid walletId={wallet._id} />

                                    <div className="flex justify-center pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleViewRequests}
                                        >
                                            View My Payment Requests
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}