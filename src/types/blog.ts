export interface BlogElement {
  source: string;
  type: string;
  safeHTML: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  description: string;
  ogp_image: string;
  content: string;
  tag: string;
  content_url: string;
  markdown_url: string;
  update_date: string;
  created_date: string;
  publish: boolean;
  elements: BlogElement[];
}

export interface BlogListItem {
  id: string;
  title: string;
  description: string;
  ogp_image: string;
  tag: string;
  update_date: string;
  created_date: string;
}