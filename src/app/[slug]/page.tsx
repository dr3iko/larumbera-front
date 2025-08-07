import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/api';
import Image from 'next/image';

// 2. El componente de la página dinámica
export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);

  // Si WordPress no devuelve la página, mostramos un 404 de Next.js
  if (!page) {
    notFound();
  }

  return (
    <article>
      {page.featuredImage?.node.sourceUrl && (
        <div className="relative w-full h-[450px] mb-8">
          <Image
            src={page.featuredImage.node.sourceUrl}
            alt={page.title || 'Featured Image'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-8 text-center text-rumbera-blue">{page.title}</h1>
      {/* Usamos `dangerouslySetInnerHTML` para renderizar el HTML que viene de WordPress */}
      <div 
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </article>
  );
}