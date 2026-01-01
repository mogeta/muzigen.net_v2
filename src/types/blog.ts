export interface BlogElement {
  source: string;
  type: string;
  safeHTML: string;
}

export interface BlogArticle {
  id: string;
  slug?: string;
  title: string;
  description: string;
  ogp_image: string;
  content: string;
  tag?: string; // Deprecated: use tags instead
  tags?: string[]; // Array of tags
  content_url: string;
  markdown_url: string;
  update_date: string;
  created_date: string;
  publish: boolean;
  elements: BlogElement[];
}

export interface BlogListItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  ogp_image: string;
  tag?: string; // Deprecated: use tags instead
  tags?: string[]; // Array of tags
  update_date: string;
  created_date: string;
}