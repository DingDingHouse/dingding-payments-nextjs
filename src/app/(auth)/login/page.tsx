"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import c1image from '../../../../public/assets/c1.png'
import g1image from '../../../../public/assets/g1.jpg'
import p1 from '../../../../public/assets/dollar.jpeg'
import p2 from '../../../../public/assets/rupee.png'
import Link from "next/link";
import { Star, X } from "lucide-react";
import { getBanners, getPlatform } from "@/lib/actions";
import { Banner, IPlatform } from "@/lib/types";



export default function LoginPage() {
    const [isopen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [banner, setBanner] = useState([])
    const [platform, setPlatform] = useState([])
    console.log(banner)
    const router = useRouter();
    const { toast } = useToast();

    const handelOpen = () => {
        setIsOpen(!isopen);
    }

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


    //Get Banner
    const HandelGetBanner = async () => {
        try {
            const response = await getBanners()
            if (response?.data?.data?.length > 0) {
                setBanner(response?.data?.data)
            }
        } catch (error) {

        }
    }

    //Get Platform
    const HandelGetPlatform = async () => {
        try {
            const response = await getPlatform()
            console.log(response, "Platform")
            if (response?.data?.data?.length > 0) {
                setPlatform(response?.data?.data)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        HandelGetBanner()
        HandelGetPlatform()
    }, [])

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
        <>
            <div className="min-h-screen bg-gradient-to-br z-[10] from-black to-gray-900 text-white relative">
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

                            <Button onClick={handelOpen} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-orange-500/20">
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
                            {banner?.map((image: Banner, index: number) => (
                                image?.isActive && <CarouselItem key={index}>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                                        <Card className="border-0">
                                            <CardContent className="p-0">
                                                <Image
                                                    src={image?.image}
                                                    alt={image?.title}
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
                <section id="games" className="py-12 px-4 w-[95%] mx-auto min-h-screen">
                    <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-300 to-orange-500 text-transparent bg-clip-text">
                        Play Exciting Games
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {platform?.map((platform: IPlatform, ind: number) => (
                            <Link href={platform?.url} key={ind} className="group gamecard p-[2px] lg:p-1.5">
                                <div className="bg-gray-800/30 backdrop-blur-sm !bg-black rounded-xl overflow-hidden border border-yellow-500/10 group-hover:border-yellow-500/30 transition-all duration-300 h-full flex flex-col">
                                    <div className="relative pt-5 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"></div>
                                        <Image
                                            src={platform?.image}
                                            alt={platform?.name}
                                            width={400}
                                            height={300}
                                            className="w-full aspect-[4/3] p-2 object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-3 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium">
                                                Play Now
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-center items-center mb-1">
                                            <h3 className="font-bold text-white group-hover:text-yellow-300  capitalize transition-colors">{platform?.name}</h3>
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
            {isopen && (<Card className="w-[95%] md:w-[70%] p-5 z-[12] border-[2px] border-yellow-600  lg:w-[40%] xl:w-[30%] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
                <Button onClick={handelOpen} className="bg-transparent text-white absolute right-0 top-1 hover:bg-transparent hover:scale-125 transition-all"><X className="scale-150" /></Button>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Welcome</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <Icons.eyeOff className="h-4 w-4" />
                                    ) : (
                                        <Icons.eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-5">
                        <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600" type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign in
                        </Button>
                    </CardFooter>
                </form>
            </Card>)}
            {isopen && (<button onClick={handelOpen} className="fixed top-0 left-0 w-full h-screen bg-black z-[11] bg-opacity-30"></button>)}
        </>
    )

}