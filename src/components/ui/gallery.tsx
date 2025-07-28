
"use client"

import React from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, MoreHorizontal, Download, Package } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './button';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export interface GalleryProps {
  images: string[];
  title?: string;
  layoutId: string;
  setGalleryData: React.Dispatch<React.SetStateAction<Omit<GalleryProps, 'setGalleryData'> | null>>;
}

export function Gallery({ images, title, layoutId, setGalleryData }: GalleryProps) {
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const imageIndex = page;

  const paginate = (newDirection: number) => {
    setPage([(page + newDirection + images.length) % images.length, newDirection]);
  };

  const handleClose = () => {
    setGalleryData(null);
  };
  
  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }

    if (offset.y > 100 && velocity.y > 200) {
        handleClose();
    }
  };
  
  const downloadImage = async (url: string, filename: string) => {
     try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error("Error downloading image:", error);
    }
  }

  const downloadAllImages = async () => {
    if(!title) return;
    setIsDownloading(true);
    for (let i = 0; i < images.length; i++) {
        await downloadImage(images[i], `${title.replace(/ /g, '_')}_${i + 1}.jpg`);
    }
    setIsDownloading(false);
  }

  return (
    <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
    >
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white bg-gradient-to-b from-black/60 to-transparent">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/10 hover:text-white">
                    <ArrowLeft size={24} />
                </Button>
                <div className="flex flex-col">
                    <span className="font-bold">{title}</span>
                    <span>{imageIndex + 1} / {images.length}</span>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                    <MoreHorizontal size={24} />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); downloadImage(images[imageIndex], `${title?.replace(/ /g, '_')}_${imageIndex + 1}.jpg`)}}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Rasmni yuklab olish</span>
                </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {e.stopPropagation(); downloadAllImages()}} disabled={isDownloading}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Barchasini yuklab olish ({images.length})</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
                 <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 z-20 text-white hover:bg-white/10 hover:text-white"
                        onClick={() => paginate(-1)}
                        >
                        <ArrowLeft size={32} />
                    </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 z-20 text-white hover:bg-white/10 hover:text-white"
                        onClick={() => paginate(1)}
                        >
                        <ArrowRight size={32} />
                    </Button>
                 </>
            )}
            
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    className="absolute h-full w-full flex items-center justify-center"
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                >
                    <motion.div
                        className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center cursor-grab active:cursor-grabbing"
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                         onDragEnd={(e, info) => {
                            if (info.offset.y > 150) {
                                handleClose();
                            }
                        }}
                        dragElastic={{top: 0, bottom: 0.2}}
                    >
                        <motion.div layoutId={layoutId} className="relative w-full h-full">
                           <Image
                                src={images[imageIndex]}
                                alt={`${title} image ${imageIndex + 1}`}
                                fill
                                style={{ objectFit: 'contain' }}
                                className="pointer-events-none"
                            />
                        </motion.div>
                   </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    </motion.div>
  );
}
