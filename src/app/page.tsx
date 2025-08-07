import PostCard from "@/components/PostCard";
import { getPaginatedPosts } from "@/lib/api";

// 3. El componente de la página de inicio ahora es asíncrono
export default async function Home() {
  const postData = await getPaginatedPosts();
  const posts = postData.edges;

  return (
    <>
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-rumbera-blue">Últimas Noticias</h1> */}

      {posts.length >= 5 ? (
        // Contenedor de la Bento Grid. `gap-2.5` equivale a 10px.
        // En móvil (por defecto) es una sola columna. En pantallas medianas y más grandes, es una parrilla de 3 columnas.
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto_auto] gap-5 md:h-[600px]">
          <PostCard
            post={posts[0].node}
            isPriority={true}
            className="h-80 md:h-auto md:col-span-2 md:row-span-2" // Post principal
          />
          <PostCard
            post={posts[1].node}
            isPriority={true}
            className="h-80 md:h-auto md:col-span-1 md:row-span-2" // Post vertical
          />
          {/* A las tarjetas pequeñas les damos una altura fija en móvil para que no se estiren demasiado */}
          <PostCard post={posts[2].node} className="h-60 md:h-auto" />
          <PostCard post={posts[3].node} className="h-60 md:h-auto" />
          <PostCard post={posts[4].node} className="h-60 md:h-auto" />
        </div>
      ) : (
        <p className="text-center text-gray-500">
          {posts.length > 0 
            ? "No hay suficientes noticias para mostrar el diseño destacado. Visita nuestro blog para ver más." 
            : "No se pudieron cargar las noticias. Inténtalo de nuevo más tarde."
          }
        </p>
      )}
    </>
  );
}
