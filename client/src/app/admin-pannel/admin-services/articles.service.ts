import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from 'src/app/_models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = 'http://localhost:5000/api/articles';

  constructor(private http: HttpClient) {}

  // ✅ Create Article
  createArticle(formData: FormData): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, formData);
  }

  // ✅ Get All Articles
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  // ✅ Get Single Article by ID
  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  // ✅ Delete Article by ID
  deleteArticle(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // ✅ Update Article by ID
  updateArticle(id: string, formData: FormData): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, formData);
  }
}
