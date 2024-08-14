import Link from 'next/link'
import RemoveBg from '@/components/RemoveBg';

const HeroSection = () => {
  return (
    <section className="w-full pt-12 flex flex-col justify-center items-center md:pt-24 lg:pt-32">
      <div className="container space-y-10 xl:space-y-16">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Unleash Your Creativity
            </h1>
            <p className="mx-auto  text-muted-foreground md:text-xl">
              Creator Studio is your ultimate tool for text-to-image and text-to-text transformation. Bring your
              ideas to life with our powerful AI-driven features.
            </p>
          </div>
          <div className="space-x-4">
            <Link
              href="/removebg"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none  z-1000"
             
            >
             Try  RemoveBg
            </Link>
            <Link
              href="/chat-gpt"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
             
            >
              Try ChatGPT
            </Link>
          </div>
        </div>
       
      </div>
    </section>
  )
}

export default HeroSection
