export interface PressRelease {
  _id?: string;
  title: string;
  title_it?: string;
  title_fr?: string;
  title_en?: string;
  content: string;
  content_it?: string;
  content_fr?: string;
  content_en?: string;
  image: string;
  date: Date | string;
}
