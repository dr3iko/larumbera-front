import Image from 'next/image';
import Link from 'next/link';
import { PostNode } from '@/types';

type BlogCardProps = {
  post: PostNode;
};

const BlogCard = ({ post }: BlogCardProps) => {
  const { title, slug, excerpt, featuredImage } = post;

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="relative w-full h-48">
        <Image
          src={featuredImage?.node.sourceUrl || '/default-artwork.png'}
          alt={`Imagen para ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold text-rumbera-blue mb-2">{title}</h2>
        {excerpt && (
          <div
            className="text-gray-700 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}
        <Link href={`/blog/${slug}`}>
          <button className="bg-rumbera-yellow hover:bg-rumbera-blue text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            Continuar leyendo
          </button>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
