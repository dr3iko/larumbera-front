export interface WPImage {
  sourceUrl: string;
}

export interface PostNode {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: {
    node: WPImage;
  };
}

export interface PostEdge {
  node: PostNode;
}

export interface WPMenuItem {
  ID: number;
  title: string;
  url: string;
  // Puedes añadir 'children' aquí si en el futuro necesitas sub-menús
}

export interface WPMenu {
  term_id: number;
  name: string;
  slug: string;
  items: WPMenuItem[];
}
