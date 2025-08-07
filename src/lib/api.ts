const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://silpabon.com/back/graphql';
const WP_USER = process.env.WP_USER;
const WP_PASSWORD = process.env.WP_PASSWORD;

export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    throw new Error('The NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not set.');
  }

  if (WP_USER && WP_PASSWORD) {
    const auth = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: {
      revalidate: 3600 // Revalida cada 3600 segundos (1 hora)
    }
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function fetchRestAPI(path: string, { method = 'GET', headers = {}, body = null, revalidate = 3600 }: { method?: string, headers?: HeadersInit, body?: any, revalidate?: number } = {}) {
  const REST_API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace('/graphql', '') : 'https://silpabon.com/back';
  const url = `${REST_API_BASE_URL}${path}`;

  console.log(`Fetching REST API from base: ${REST_API_BASE_URL}, full URL: ${url}`);

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    next: {
      revalidate,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch REST API from ${url}: ${res.statusText} - ${errorText}`);
  }

  return res.json();
}

export async function getPageBySlug(slug: string) {
  const data = await fetchAPI(`
    query GetPageBySlug($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `, {
    variables: { id: slug }
  });
  return data?.page;
}

export async function getAllPostsForHome() {
  const data = await fetchAPI(`
    query GetAllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        content
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `,
    {
      variables: { id: slug },
    }
  );
  return data?.post;
}

export async function getPaginatedPosts(first: number = 5, cursor: string | null = null) {
  const data = await fetchAPI(
    `
    query GetPaginatedPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
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
  `,
    {
      variables: { first, after: cursor },
    }
  );
  return data.posts;
}