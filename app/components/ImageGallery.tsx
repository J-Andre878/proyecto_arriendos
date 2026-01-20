"use client";
import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: Array<{ id: number; image_url: string; is_main: boolean | null }>;
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      {/* Grid gallery layout */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="relative col-span-2 h-96 rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
          <Image
            src={images[0].image_url}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Ver en grande</div>
        </div>
        {images.slice(1, 5).map((img, idx) => (
          <div
            key={img.id}
            className="relative h-44 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(idx + 1)}
          >
            <Image
              src={img.image_url}
              alt={`${title} - imagen ${idx + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Lightbox/Slider */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl"
            onClick={prevImage}
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="relative w-[90vw] max-w-3xl h-[70vh] flex items-center justify-center">
            <Image
              src={images[currentIndex].image_url}
              alt={`${title} - imagen ${currentIndex + 1}`}
              fill
              className="object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl"
            onClick={nextImage}
            aria-label="Siguiente"
          >
            ›
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                className={`w-3 h-3 rounded-full ${idx === currentIndex ? "bg-white" : "bg-gray-500"}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
