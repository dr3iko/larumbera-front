'use server';

import { PostEdge } from "@/types";
import { getPaginatedPosts } from '@/lib/api'; // Importamos getPaginatedPosts

// El tipo de datos que esperamos de la API con paginación
export type PaginatedPostsResponse = {
  edges: PostEdge[];
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
  }
}

/**
 * Carga un lote de 5 posts a partir de una posición (cursor).
 * Esta es una Server Action, se ejecuta de forma segura en el servidor.
 */
export async function loadMorePosts(cursor: string | null): Promise<PaginatedPostsResponse> {
  const query = `
    query GetMorePosts($first: Int!, $after: String) {
      posts(first: 5, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  try {
    // Usamos getPaginatedPosts de @/lib/api.ts para cargar 5 posts adicionales
    const data = await getPaginatedPosts(5, cursor);
    return data;
  } catch (error) {
    console.error("loadMorePosts: Error fetching data:", error);
    return { edges: [], pageInfo: { endCursor: null, hasNextPage: false } };
  }
}