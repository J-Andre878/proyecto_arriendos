"use client";
import Image from "next/image";
import PropertyImageLightbox from "./PropertyImageLightbox";

interface PropertyGalleryClientProps {
  images: Array<{ id: number; image_url: string; is_main: boolean | null }>;
  title: string;
}

export default function PropertyGalleryClient({ images, title }: PropertyGalleryClientProps) {
  if (!images || images.length === 0) return null;
  const mainImage = images.find((img) => img.is_main) || images[0];
  const otherImages = images.filter((img) => !img.is_main);

  return (
    <PropertyImageLightbox images={images} title={title}>
      {(open) => (
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Imagen principal */}
          {mainImage && (
            <div className="relative h-96 w-full overflow-hidden rounded-lg lg:col-span-1 lg:row-span-2 cursor-pointer" onClick={() => open(0)}>
              <Image
                src={mainImage.image_url}
                alt={title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Ver en grande</div>
            </div>
          )}

          {/* Imágenes secundarias */}
          {otherImages.slice(0, 4).map((image, idx) => (
            <div
              key={image.id}
              className="relative h-44 w-full overflow-hidden rounded-lg cursor-pointer"
              onClick={() => open(idx + 1)}
            >
              <Image
                src={image.image_url}
                alt={`${title} - imagen ${idx + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </PropertyImageLightbox>
  );
}
