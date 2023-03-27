import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RstApiService {

  private contentTypeHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=UTF-8');
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  // Areas
  getAllAreas(query: string, areaId?: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/area?query=${query}&area=${areaId || ''}`);
  }

  getCountries(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/area/country');
  }
  
  getAllAreaChildren(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/area/${id}/children`);
  }
  // Climbs
  getAllClimbs(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/climbs'); 
  }

  // TODO join this request with the one below and the one above
  getClimbsByArea(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/climbs?area_id=' + id);
  } 

  getClimbsByName(name: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/climbs?name=' + name)
  }

  getClimbNames(query: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/climbs/names?query=' + query)
  }

  addClimb(climb: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + '/api/climbs',
      climb,
      { headers: this.contentTypeHeaders }
    )
  }

  // Ascents
  addAscent(ascent: any, climbId: number): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + '/api/ascents?climb=' + climbId + '&user=' + this.authService.getUsername(),
      ascent,
      { headers: this.contentTypeHeaders }
    )
  }

  updateAscent(ascent: any, id: number): Observable<any> {
    return this.http.put<any>(
      this.apiUrl + `/api/ascents/${id}`,
      ascent,
      { headers: this.contentTypeHeaders });
  }

  getUserAscents(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/ascents?user=' + this.authService.getUsername());
  }

  // Blog
  addBlog(blog: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + `/api/blog?user=${this.authService.getUsername()}`,
      blog,
      { headers: this.contentTypeHeaders }
    )
  }

  updateBlog(blog: any, blogId: number): Observable<any> {
    return this.http.put<any>(
      this.apiUrl + `/api/blog/${blogId}`,
      blog,
      { headers: this.contentTypeHeaders }
    )
  }

  addBlogImage(form: any, blogId: number): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + `/api/blog/${blogId}/image`,
      form
    )
  }

  getAllBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/blog');
  }

  getBlogById(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/blog/${id}`)
  }

  getBlogImage(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/blog/image/${id}`)
  }

  addComment(blogId: number, comment: { text: string }): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + `/api/blog/${blogId}/comment?user=${this.authService.getUsername()}`,
      comment,
      { headers: this.contentTypeHeaders }
    )
  }

  addLike(blogId: number) {
    return this.http.post<any>(
      this.apiUrl + `/api/blog/${blogId}/like?user=${this.authService.getUsername()}`,
      null,
      { headers: this.contentTypeHeaders }
    )
  }
  
  deleteLike(blogId: number) {
    return this.http.delete<any>(
      this.apiUrl + `/api/blog/${blogId}/like?user=${this.authService.getUsername()}`
    )
  }
}
