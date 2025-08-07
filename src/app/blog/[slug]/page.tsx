import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/api';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  const seo = post.seo;

  return {
    title: seo?.title || post.title,
    description: seo?.metaDesc,
    alternates: {
      canonical: seo?.canonical,
    },
    openGraph: {
      title: seo?.opengraphTitle || seo?.title || post.title,
      description: seo?.opengraphDescription || seo?.metaDesc,
      url: seo?.canonical || `https://larumbera.xyz/blog/${params.slug}`,
      images: seo?.opengraphImage?.mediaItemUrl ? [
        {
          url: seo.opengraphImage.mediaItemUrl,
          width: 1200,
          height: 630,
          alt: seo.opengraphTitle || seo.title || post.title,
        },
      ] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || seo?.title || post.title,
      description: seo?.twitterDescription || seo?.metaDesc,
      images: seo?.twitterImage?.mediaItemUrl ? [
        {
          url: seo.twitterImage.mediaItemUrl,
          alt: seo.twitterTitle || seo.title || post.title,
        },
      ] : [],
    },
  };
}

// 2. El componente de la página dinámica
export default async function Page({ params }: { params: { slug: string } }) {
    const page = await getPostBySlug(params.slug);

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
