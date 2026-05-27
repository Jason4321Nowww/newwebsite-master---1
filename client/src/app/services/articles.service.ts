import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../_models/article';




@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private baseUrl = '/api/articles';

  constructor(private http:HttpClient) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl);
  }

 getArticleById(id: string): Observable<Article> {
  return this.http.get<Article>(`${this.baseUrl}/${id}`);
  
}

}
