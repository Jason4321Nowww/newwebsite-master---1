export interface Action {
  _id?: string;
  title: string;
  title_it?: string;
  title_fr?: string;
  title_en?: string;
  description: string;
  description_it?: string;
  description_fr?: string;
  description_en?: string;
  media: string[];
  createdAt?: string;
}