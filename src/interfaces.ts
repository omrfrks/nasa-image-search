export interface searchResults {
  href: string;
  items: searchResult[];
  links: searchResultLinks[];
  metadata: searchResultMetadata;
  version: string;
}

export interface searchResult {
  href: string;
  data: searchResultData[];
  links: searchResultLinks;
}

export interface searchResultData {
  center: string;
  date_created: string;
  description: string;
  keywords: string[];
  location: string;
  media_type: string;
  nasa_id: string;
  photographer: string;
  title: string;
}

export interface searchResultLinks {
  href: string;
  rel: string;
  render: string;
}

export interface searchResultMetadata {
  total_hits: number;
}