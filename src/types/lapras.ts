/**
 * Lapras Public API Type Definitions
 * Based on: https://github.com/lapras-inc/public-api-schema
 */

export interface LaprasPublicPageData {
  name: string;
  user_name: string;
  icon_url: string;
  description: string;
  e_score: number;
  b_score: number;
  i_score: number;
  activities: LaprasActivity[];
  github_repositories: LaprasGitHubRepository[];
  qiita_articles: LaprasArticle[];
  note_articles: LaprasArticle[];
  zenn_articles: LaprasArticle[];
  blog_articles: LaprasArticle[];
  hatena_articles: LaprasArticle[];
  speaker_deck_slides: LaprasSpeakerDeckSlide[];
  events: LaprasEvent[];
  teratail_replies: LaprasTeratailReply[];
}

export interface LaprasActivity {
  date: string;
  description: string;
  url: string;
}

export interface LaprasGitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  contribution: {
    commits_count: number;
    additions_count: number;
    deletions_count: number;
  };
  languages: {
    name: string;
    rate: number;
  }[];
}

export interface LaprasArticle {
  title: string;
  url: string;
  published_at: string;
  tags?: string[];
  likes_count?: number;
  stocks_count?: number;
}

export interface LaprasSpeakerDeckSlide {
  title: string;
  url: string;
  published_at: string;
  views_count?: number;
  stars_count?: number;
}

export interface LaprasEvent {
  title: string;
  url: string;
  start_at: string;
  is_organizer: boolean;
  is_presenter: boolean;
  status: 'attended' | 'cancelled' | 'upcoming';
}

export interface LaprasTeratailReply {
  question_title: string;
  question_url: string;
  replied_at: string;
  is_best_answer: boolean;
}

export interface LaprasApiError {
  error: boolean;
  message: string;
}
