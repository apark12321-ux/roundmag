export interface Story {
  id: string;
  num: string;
  title: string;
  sub: string;
  c: string; // Category, e.g. "Cover", "Editorial", "Fashion", "Beauty"
  imageUrl: string; // URL or Base64 string
  content?: string; // Rich article or layout text
  createdAt: string;
}

export interface NewsItem {
  id: string;
  c: string; // Category, e.g. "Interview", "Beauty", "Fashion", "Culture", "Place"
  t: string; // Title
  sub?: string; // Description or sub-headline
  imageUrl?: string; // Optional thumbnail preview image
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteDesc: string;
  snsInstagram: string;
  snsYoutube: string;
  snsPinterest: string;
  aboutUsText: string;
  homepageMediaUrl: string;
  homepageMediaType: string;
}
