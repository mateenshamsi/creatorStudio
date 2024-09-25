'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Edit3, Menu, MessageCircle, Send, Plus, X } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'

type Message = {
  text: string;
  sender: 'user' | 'bot';
}

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatGPT() {
  const [input, setInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations')
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true)
      const newMessage: Message = { text: input, sender: 'user' }
      let updatedConversation: Conversation

      if (currentConversation) {
        updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, newMessage]
        }
      } else {
        updatedConversation = {
          id: Date.now().toString(),
          title: input.slice(0, 30),
          messages: [newMessage]
        }
      }

      setCurrentConversation(updatedConversation)
      setInput('')

      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(input)
        const botMessage: Message = { text: result.response.text(), sender: 'bot' }
        updatedConversation.messages.push(botMessage)
      } catch (error) {
        const errorMessage: Message = { text: "Something went wrong.", sender: 'bot' }
        updatedConversation.messages.push(errorMessage)
      } finally {
        setIsLoading(false)
        setCurrentConversation(updatedConversation)
        setConversations(prev =>
          currentConversation
            ? prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
            : [updatedConversation, ...prev]
        )
      }
    }
  }

  const startNewConversation = () => {
    if (currentConversation && currentConversation.messages.length > 0) {
      setConversations(prev => [currentConversation, ...prev.filter(c => c.id !== currentConversation.id)])
    }
    setCurrentConversation(null)
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Hamburger Menu */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-[#2A2A2A] p-0 border-r border-gray-700">
          <div className="p-6 flex items-center justify-between border-b border-gray-700">
            <Button variant="ghost" className="text-white text-xl font-bold" onClick={startNewConversation}>
              Creator Studio
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-10rem)] px-4">
            <div className="py-6 space-y-4">
              {conversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => {
                    setCurrentConversation(conv)
                    setIsSidebarOpen(false)
                  }}
                >
                  <div>
                    <div className="font-medium">{conv.title}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {conv.messages[conv.messages.length - 1].text.slice(0, 50)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-700">
            <Button variant="outline" className="w-full">
              Upgrade plan
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Top buttons */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800/50 backdrop-blur-sm"
            onClick={startNewConversation}
          >
            <Edit3 className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4 py-6">
          {currentConversation ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {currentConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
                    } max-w-[80%]`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <center>
                <svg className="mx-auto h-16 w-16 mb-2 text-blue-500" viewBox="0 0 780 780" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M401.755 0H377.553L360.266 0.69395L344.362 2.08185L316.011 6.9395L290.426 12.4911L266.915 19.4306L246.17 27.0641L226.117 35.3915L206.064 45.8007L193.617 52.7402L181.17 60.3737L162.5 72.8648L152.128 80.4982L142.447 88.1317L134.84 95.0712L127.234 101.317L103.032 125.605L94.0425 136.014L86.4362 145.036L78.8298 154.751L71.9149 163.772L65 173.488L57.3936 185.285L48.4043 200.552L41.4894 213.737L33.1915 231.085L24.2021 252.598L19.3617 265.783L13.8298 283.826L8.29787 305.338L4.14894 326.851L1.38298 346.281L0 365.712V403.879L1.38298 431.637L4.84043 457.313L9.68085 481.601L15.2128 502.42L22.8191 525.32L29.734 543.363L35.266 556.548L42.8723 571.815L49.7872 584.306L58.0851 598.185L71.9149 619.004L79.5213 629.413L86.4362 638.434L92.6596 646.068L100.957 655.089L105.798 660.641L116.862 671.744L133.457 687.011L142.447 694.644L150.053 700.89L163.191 710.605L174.947 718.932L187.394 726.566L202.606 735.587L217.819 743.221L237.181 751.548L257.234 759.875L275.904 766.121L301.489 773.061L326.383 777.918L345.053 780H434.255L441.862 779.306L457.074 777.224L484.043 771.673L513.085 763.345L529.681 757.1L551.117 748.078L569.787 739.057L585 730.73L604.362 718.932L614.734 711.993L628.564 701.584L638.245 693.95L647.926 685.623L653.457 680.765L673.511 660.641L678.351 655.089L685.957 646.762L692.181 639.128L699.787 629.413L706.011 621.085L715.691 607.206L726.755 589.858L735.745 573.897L745.426 553.772L753.032 535.73L759.947 516.993L766.17 496.868L771.011 477.438L775.16 456.619L777.926 436.495L780 410.819V380.285L778.617 361.548L776.543 341.423L773.085 319.217L768.936 299.786L764.787 283.826L759.255 265.783L753.032 248.434L744.043 226.922L736.436 211.655L728.138 196.388L716.383 176.957L708.085 165.16L698.404 151.975L690.798 142.26L682.5 132.544L677.66 126.993L652.766 102.011L645.16 95.7651L637.553 88.8256L626.489 79.8043L614.043 70.7829L601.596 62.4555L586.383 52.7402L573.936 45.8007L560.106 38.8612L543.511 31.2278L524.149 23.5943L499.255 15.2669L477.819 9.7153L444.628 3.46975L428.032 1.3879L401.755 0ZM461.915 224.841H325L318.777 230.392L313.936 235.944L299.415 250.517L293.883 255.374L290.426 259.538L284.894 264.396V265.784H283.511V267.172H282.128L281.436 268.559L277.287 272.029V273.417H275.904L227.5 321.994V460.784L232.34 464.947L237.872 470.499L242.713 476.051H244.096V477.438H245.479V478.826L246.862 479.52L286.968 519.769L291.809 525.321H293.191V526.709L297.34 530.179L302.181 535.73H303.564V537.118L304.947 537.812L324.309 557.243L330.532 557.937H457.074L462.606 557.243L516.543 503.115L522.074 498.257V496.869H523.457V495.481H524.84V494.093H526.223V492.705H527.606L559.415 460.784V321.994L467.447 229.698L461.915 224.841ZM374.096 31.9224H408.67L435.638 34.0042L455.691 36.78L464.681 38.8619L463.298 41.6377L457.766 46.4953L229.574 275.499H227.5V72.8654L234.415 68.7017L246.862 63.1501L257.234 58.2925L273.83 52.0469L301.489 43.7195L323.617 38.1679L344.362 34.6982L363.723 32.6163L374.096 31.9224ZM430.107 589.858H94.7347V590.552L98.1922 595.409L116.862 620.392L124.469 628.719L130.692 636.352L137.607 643.292L143.139 648.15L148.671 653.701L154.203 658.559L163.192 666.886L170.799 673.132L179.096 679.377L192.235 689.093L207.448 698.808L216.437 704.359L233.033 713.381L258.618 725.178L282.128 733.505L286.969 734.199L425.958 594.715L430.107 589.858ZM195 92.2962L195.692 94.378V426.086L194.309 426.78L188.777 421.923L53.2449 285.908L51.1704 284.52L51.8619 281.745L58.7768 261.62L65.6917 244.965L75.3725 224.841L85.7449 206.104L91.9683 196.389L98.8832 185.979L106.49 175.57L114.096 165.855L122.394 156.14L129.309 148.506L134.149 142.955L150.745 126.3L158.351 120.054L168.032 111.727L177.713 104.093L186.702 97.1538L195 92.2962ZM559.416 507.278H558.033L541.437 523.933L535.905 528.791L531.065 533.648L526.224 539.2L488.192 577.367L482.661 582.225V583.613H481.278L327.767 737.67L322.235 741.833V743.915L329.15 745.303L351.278 748.773L371.331 750.855H414.203L429.416 749.467L454.309 745.997L472.288 742.527L498.565 735.588L520.001 727.954L536.597 721.015L555.958 711.994L559.416 709.912V507.278ZM42.1815 320.605L46.3304 323.381L279.362 557.242L278.671 557.936H77.4475L73.99 554.467L65.0006 535.73L57.3943 516.299L49.0964 491.317L43.5645 469.805L39.4155 448.292L37.3411 433.719L35.2666 407.349V376.121L36.6496 355.303L39.4155 333.79L41.49 321.299L42.1815 320.605ZM710.16 224.841H507.553L508.245 226.922L513.777 231.78L732.288 451.068L742.66 460.784H745.426L750.266 426.086L751.649 396.94V386.531L750.958 368.488L749.575 353.221L746.809 332.403L741.968 308.115L736.436 287.99L729.522 267.172L721.224 246.353L713.617 230.392L710.16 224.841ZM591.223 355.302L594.68 357.384L735.052 498.255L734.361 503.113L728.829 517.686L720.531 537.811L710.85 557.935L701.861 573.896L693.563 587.081L686.648 597.49L676.967 610.675L668.669 620.391L663.138 627.33L654.84 636.352L649.999 641.209L645.159 646.761L638.244 653.7L632.712 658.558L624.414 666.191L614.733 673.825L603.669 682.152L593.297 689.786H591.223V355.302ZM505.48 49.2705L500.639 48.5766L493.033 56.21L480.586 68.7011L475.054 73.5588L462.607 86.0499L457.767 91.6015L454.309 94.3773V95.7652H452.926L366.49 182.509L360.958 187.367L356.809 192.224L398.99 192.918H687.341L691.49 192.224L690.799 190.142L685.958 183.897L667.98 160.303L658.99 149.893L654.15 144.342L648.618 138.79L645.852 137.402V136.014L644.469 135.32L638.245 129.075L631.331 122.829L622.341 114.502L612.66 106.868L599.522 97.1531L586.384 88.1317L571.171 79.1104L555.267 70.089L540.745 63.1495L522.767 55.5161L505.48 49.2705Z" fill="#3EAAF3" />
                </svg>
                </center>
                {/* <MessageCircle className="mx-auto h-16 w-16 mb-6 text-blue-500" /> */}
                <h2 className="text-3xl font-bold mb-4">Welcome to Creator Studio</h2>
                <p className="text-gray-400 text-lg">Start a new conversation or select an existing one from the sidebar.</p>
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center max-w-3xl mx-auto">
            <Input
              placeholder="Message ChatGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="flex-1 bg-[#2A2A2A] border-gray-600 focus:border-blue-500 text-lg py-6"
            />
            <Button className="ml-4 bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleSend} disabled={isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Creator Studio can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>
    </div>
  )
}