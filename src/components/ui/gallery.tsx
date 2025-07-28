"use client"

import * as React from "react"
import { AnimatePresence, motion, PanInfo } from "framer-motion"
import { ArrowLeft, MoreHorizontal, X } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface GalleryProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  startIndex?: number
}

export function Gallery({ images, isOpen, onClose, startIndex = 0 }: GalleryProps) {
  const [index, setIndex] = React.useState(startIndex)

  React.useEffect(() => {
    if (isOpen) {
      setIndex(startIndex)
    }
  }, [isOpen, startIndex])

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrev()
    } else if (info.offset.x < -100) {
      handleNext()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={onClose}
        >
          <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 text-white bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2">
                <ArrowLeft size={24} />
              </button>
              <div className="flex flex-col">
                <span className="font-bold">Qozon</span>
                <span>
                  {index + 1} / {images.length}
                </span>
              </div>
            </div>
            <button className="p-2">
              <MoreHorizontal size={24} />
            </button>
          </header>

          <div className="flex-1 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
              >
                <Image
                  src={images[index]}
                  alt={`Image ${index + 1}`}
                  width={1080}
                  height={1920}
                  className="object-contain max-w-full max-h-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
