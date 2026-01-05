export interface Article {
  id: string;
  title: string;
  author: string;
  createdAt: string;

  // CHANGE THIS:
  body: {
    type: 'text' | 'image';
    value?: string;
    url?: string;
  }[];

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
