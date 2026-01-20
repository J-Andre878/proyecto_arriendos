"use client";
import { useState } from "react";
import Image from "next/image";

interface PropertyImageLightboxProps {
  images: Array<{ id: number; image_url: string; is_main: boolean | null }>;
  title: string;
  children: (open: (idx: number) => void) => React.ReactNode;
}

export default function PropertyImageLightbox({ images, title, children }: PropertyImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const openLightbox = (idx: number) => {
    setCurrent(idx);
    setOpen(true);
  };

  const close = () => setOpen(false);
  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      {children(openLightbox)}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button className="absolute top-6 right-8 text-white text-3xl font-bold" onClick={close} aria-label="Cerrar">×</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl" onClick={prev} aria-label="Anterior">‹</button>
          <div className="relative w-[95vw] max-w-5xl md:max-w-[75vw] h-[80vh] flex items-center justify-center p-2">
            <Image
              src={images[current].image_url}
              alt={`${title} - imagen ${current + 1}`}
              fill
              className="object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl" onClick={next} aria-label="Siguiente">›</button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-gray-500"}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
