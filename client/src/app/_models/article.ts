export interface Article {
  id: string;
  title: string;
  title_it?: string;
  title_fr?: string;
  title_en?: string;
  author: string;
  createdAt: string;

  body: {
    type: 'text' | 'image';
    value?: string;
    url?: string;
  }[];
  body_it?: string;
  body_fr?: string;
  body_en?: string;

  imageUrls: string[];
}





// export interface Article {
//   id: string;
//   title: string;
//   author: string;
//   createdAt: string;
//   imageUrls?: string[];
//   body: {
//     type: 'text' | 'image';
//     value?: string;
//     url?: string;
//   }[];
// }




// export interface Article {
//   id: string;
//   title: string;
//   body: string;
//   author: string;
//   imageUrls: string[];
//   createdAt: string; // ISO date string
//   updatedAt?: string;
// }
