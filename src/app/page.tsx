import AudioCleaning from "@/components/AudioCleaning";
import HeroSection from "@/components/Hero";
import Head from "./head";
import RemoveBg from "@/components/RemoveBg";
import ChatGPT from "@/components/ChatStudio";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

// import Image from "next/image";

export default function Home() {
  return (
    <>
    <Head/>
    <ShootingStars className="-z-10"/>
    <StarsBackground className="-z-10"/>
    <HeroSection/> 
        </>
  );
}
