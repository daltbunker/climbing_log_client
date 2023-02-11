import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RstApiService {

  private contentTypeHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  // Locations
  getAllLocations(climbType: string): Observable<any> {
    return this.http.get<any>('api/locations/all?type=' + climbType);
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get<any>('api/locations?id=')
  }

  getLocationsByParam(name: string): Observable<any> {
    return this.http.get<any>('api/locations/search?name=' + name);
  }

  // Climbs
  getAllClimbs(): Observable<any> {
    return this.http.get<any>('api/climbs/all'); 
  }

  getClimbsByLocation(id: number): Observable<any> {
    return this.http.get<any>('api/climbs/all?location_id=' + id);
  } 

  getClimbsByName(name: string): Observable<any> {
    return this.http.get<any>('api/climbs/all?name=' + name)
  }

  // Ascents
  addAscent(ascent: any, climbId: number): Observable<any> {
    return this.http.post<any>(
      'api/ascents/add?climb=' + climbId + '&user=' + this.authService.getUsername(),
      ascent,
      { headers: this.contentTypeHeaders }
    )
  }

  updateAscent(ascent: any, id: number): Observable<any> {
    return this.http.put<any>('api/ascents/edit?id=' + id, ascent, { headers: this.contentTypeHeaders });
  }

  getUserAscents(): Observable<any> {
    return this.http.get<any>('api/ascents/all?user=' + this.authService.getUsername());
  }

  // Blog
  addBlog(blog: any): Observable<any> {
    return this.http.post<any>(
      `api/blog/add?user=${this.authService.getUsername()}`,
      blog
    )
  }

  getAllBlogs(): Observable<any> {
    return this.http.get<any>('api/blog/all');
  }

  getBlogById(id: number): Observable<any> {
    return this.http.get<any>(`api/blog/${id}`)
  }

  addComment(blogId: number, comment: { text: string }): Observable<any> {
    return this.http.post<any>(
      `api/blog/${blogId}/comment?user=${this.authService.getUsername()}`,
      comment,
      { headers: this.contentTypeHeaders }
    )
  }

  addLike(blogId: number) {
    return this.http.post<any>(
      `api/blog/${blogId}/like?user=${this.authService.getUsername()}`,
      null,
      { headers: this.contentTypeHeaders }
    )
  }
  
  deleteLike(blogId: number) {
    return this.http.delete<any>(
      `api/blog/${blogId}/like?user=${this.authService.getUsername()}`
    )
  }
}
