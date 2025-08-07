import InfinitePostList from "@/components/InfinitePostList";
import { getPaginatedPosts } from "@/lib/api";

export default async function BlogArchivePage() {
  const initialData = await getPaginatedPosts(6);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-center text-rumbera-blue">Nuestro Blog</h1>
      
      {initialData.edges.length > 0 ? (
        <InfinitePostList 
          initialPosts={initialData.edges}
          initialCursor={initialData.pageInfo.endCursor}
          initialHasNextPage={initialData.pageInfo.hasNextPage}
        />
      ) : (
        <p className="text-center text-gray-500">No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.</p>
      )}
    </>
  );
}