export interface Action {
  _id?: string;
  title: string;
  description: string;
   media: string[];     // 🔁 renamed from images
  createdAt?: string;
}