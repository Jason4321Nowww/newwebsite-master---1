export interface Contact {
  _id?: string; // if using MongoDB
  name: string;
  email: string;
  participation: string;
  createdAt?: string | Date ;
}
