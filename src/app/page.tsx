import AudioCleaning from "@/components/AudioCleaning";
import Header from "@/components/Header";
import HeroSection from "@/components/Hero";
import RemoveBg from "@/components/RemoveBg";

// import Image from "next/image";

export default function Home() {
  return (
    <>
    <Header/> 
    <HeroSection/>   
    <RemoveBg/>
    <AudioCleaning/>
    </>
  );
}
