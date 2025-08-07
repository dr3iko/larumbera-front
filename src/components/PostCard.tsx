import Image from 'next/image';
import Link from 'next/link';
import { PostNode } from '@/types';

// Definimos los "props" que el componente espera recibir
type PostCardProps = {
  post: PostNode;
  isPriority?: boolean;
  className?: string; // Para pasar clases de la parrilla (grid)
}

const PostCard = ({ post, isPriority = false, className = '' }: PostCardProps) => {
  const { title, slug, featuredImage } = post;

  return (
    // 1. La clase `group` en el contenedor principal es la que activa el efecto en los hijos.
    // 2. `overflow-hidden` es clave para que la imagen ampliada no se salga de la tarjeta.
    <article className={`relative rounded-lg shadow-lg overflow-hidden group ${className}`}>
      <Image
        src={featuredImage?.node.sourceUrl || '/default-artwork.png'}
        alt={`Imagen para ${title}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={isPriority}
        // 3. `transition-transform` y `duration-300` animan el cambio de tamaño suavemente.
        // 4. `group-hover:scale-105` es la clase que hace el zoom cuando pasas el ratón por encima del `group`.
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />
      {/* Capa de superposición para el título, con un degradado para mejorar la legibilidad */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-md">
          {title}
        </h3>
      </div>
      {/* Enlace invisible que cubre toda la tarjeta para una mejor experiencia de usuario (UX) */}
      <Link href={`/blog/${slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Leer más sobre {title}</span>
      </Link>
    </article>
  );
};

export default PostCard;