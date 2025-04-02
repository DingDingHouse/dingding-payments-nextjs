"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import c1image from '../../../../public/assets/c1.png'
import g1image from '../../../../public/assets/g1.jpg'
import p1 from '../../../../public/assets/dollar.jpeg'
import p2 from '../../../../public/assets/rupee.png'
import Link from "next/link";
import { Menu, Search, Star, X } from "lucide-react";



export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { toast } = useToast();


    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            toast({
                title: 'Success',
                description: 'Login successful'
            });
            router.push('/');


        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to login'
            });
        } finally {
            setIsLoading(false);
        }
    }


    const games = [
        { name: "FireKirin", image: "firekirin.png" },
        { name: "Orionstar", image: "orionstar.png" },
        { name: "Juwa", image: "juwa.png" },
        { name: "GameVault", image: "gamevault.png" },
        { name: "CasinoRoyale", image: "casinoroyale.png" },
        { name: "VegasSweep", image: "vegassweep.png" },
        { name: "MilkyWay", image: "milkyway.png" },
        { name: "Ultra Panda", image: "ultrapanda.png" },
        { name: "Cash Frenzy", image: "cashfrenzy.png" },
        { name: "Pandamaster", image: "pandamaster.png" },
        { name: "Vblink", image: "vblink.png" },
        { name: "River Sweeps", image: "riversweeps.png" },
        { name: "HighStake", image: "highstake.png" },
        { name: "VegasX", image: "vegasx.png" },
        { name: "Acebook", image: "acebook.png" },
        { name: "Blue Dragon", image: "bluedragon.png" },
        { name: "Para", image: "para.png" },
        { name: "River Monster", image: "rivermonster.png" },
        { name: "Moolah", image: "moolah.png" },
        { name: "Sims", image: "sims.png" },
        { name: "Meaga Spin", image: "meagaspin.png" },
        { name: "Egames", image: "egames.png" },
        { name: "Loot", image: "loot.png" },
        { name: "Ignite", image: "ignite.png" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white relative">
            {/* Header */}
            <header className="sticky top-0 bg-black/90 backdrop-blur-md z-50 py-3 border-b border-yellow-500/20">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-8">
                        <div className="relative inline-block text-base md:text-xl px-4 py-1.5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 border border-transparent bg-[length:100%_100%] bg-origin-border">
                            Ding Ding
                            <span className="absolute inset-0 rounded border border-yellow-300 border-gradient-to-r from-yellow-400 to-orange-500"></span>
                        </div>


                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative rounded-full bg-gray-800 px-3 py-1.5">
                            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search games..."
                                className="bg-transparent border-none focus:outline-none text-sm pl-7 pr-2 w-40 lg:w-60"
                            />
                        </div>

                        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-orange-500/20">
                            Login
                        </Button>
                    </div>
                </div>

            </header>

            {/* Hero Section */}
            <section className="relative">
                <Carousel
                    className="w-full"
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {[1, 2, 3, 4, 5].map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                                    <Card className="border-0">
                                        <CardContent className="p-0">
                                            <Image
                                                src={c1image}
                                                alt={`Banner ${index + 1}`}
                                                width={1200}
                                                height={600}
                                                className="w-full max-h-[100vh] object-cover"
                                            />

                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </section>



            {/* Game Links Section */}
            <section id="games" className="py-12 px-4 w-[95%] mx-auto">
                <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-300 to-orange-500 text-transparent bg-clip-text">
                    Play Exciting Games
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {games.map((game, ind) => (
                        <Link href={'#'} key={ind} className="group gamecard p-1.5">
                            <div className="bg-gray-800/30 backdrop-blur-sm !bg-black rounded-xl overflow-hidden border border-yellow-500/10 group-hover:border-yellow-500/30 transition-all duration-300 h-full flex flex-col">
                                <div className="relative pt-5 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"></div>
                                    <Image
                                        src={g1image}
                                        alt={game.name}
                                        width={400}
                                        height={300}
                                        className="w-full aspect-[4/3] object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium">
                                            Play Now
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-white group-hover:text-yellow-300 transition-colors">{game.name}</h3>
                                        <div className="flex items-center">
                                            <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
                                            <span className="text-xs text-gray-300">4.9</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Payment Methods */}
            <footer className="pt-6 lg:py-12 px-4 bg-black/50 border-t border-yellow-500/10">
                <div className="container mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-300 to-orange-500 text-transparent bg-clip-text">
                        We Accept
                    </h2>

                    <div className="flex justify-center flex-wrap gap-6 items-center mb-12">
                        <div className="bg-white rounded-full w-12 h-12 lg:w-16 lg:h-16 p-2 flex items-center justify-center hover:scale-110 transition-transform">
                            <Image
                                src={p2}
                                alt="Payment method"
                                width={60}
                                height={60}
                                className="rounded-full scale-125"
                            />
                        </div>
                        <div className="bg-white rounded-full w-12 h-12 lg:w-16 lg:h-16 p-2 flex items-center justify-center hover:scale-110 transition-transform">
                            <Image
                                src={p1}
                                alt="Payment method"
                                width={60}
                                height={60}
                                className="rounded-full"
                            />
                        </div>

                    </div>
                    <p className="text-gray-500 lg:text-sm text-xs pb-2 text-center">
                        © {new Date().getFullYear()}. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    )

}