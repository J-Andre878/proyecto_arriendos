import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Soportar tanto "file" (para avatar) como "images" (para propiedades)
    let files = formData.getAll("images") as File[];
    if (!files || files.length === 0) {
      const singleFile = formData.get("file") as File | null;
      if (singleFile) {
        files = [singleFile];
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se enviaron imágenes" },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, error: "Máximo 10 imágenes permitidas" },
        { status: 400 }
      );
    }

    // Subir cada imagen a Cloudinary
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convertir buffer a base64
      const base64 = buffer.toString("base64");
      const dataURI = `data:${file.type};base64,${base64}`;

      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "arriendos-loja/properties",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 800, crop: "limit" }, // Redimensionar
          { quality: "auto" }, // Calidad automática
        ],
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      urls: uploadedImages.map((img) => img.url), // Para compatibilidad con perfil
    });
  } catch (error) {
    console.error("Error al subir imágenes:", error);
    return NextResponse.json(
      { success: false, error: "Error al subir imágenes" },
      { status: 500 }
    );
  }
}
