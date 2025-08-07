'use client';

import { useState } from 'react';
import { PostEdge } from '@/types';
import { loadMorePosts } from '@/app/blog/actions';
import BlogCard from './BlogCard'; // Importamos BlogCard

type InfinitePostListProps = {
  initialPosts: PostEdge[];
  initialCursor: string | null;
  initialHasNextPage: boolean;
};

export default function InfinitePostList({ initialPosts, initialCursor, initialHasNextPage }: InfinitePostListProps) {
  const [posts, setPosts] = useState<PostEdge[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const newPostsData = await loadMorePosts(cursor);
      if (newPostsData.edges.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPostsData.edges]);
        setCursor(newPostsData.pageInfo.endCursor);
        setHasNextPage(newPostsData.pageInfo.hasNextPage);
      } else {
        setHasNextPage(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(({ node }) => (
          <div key={node.slug}>
            <BlogCard post={node} />
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center items-center p-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-rumbera-blue hover:bg-rumbera-yellow text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            {isLoading ? 'Cargando...' : 'Cargar más noticias'}
          </button>
        </div>
      )}
    </>
  );
}