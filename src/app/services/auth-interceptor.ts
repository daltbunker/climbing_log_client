import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private baseUrl = environment.baseUrl;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = this.baseUrl + req.url;
    const headers = req.headers;
    const tokenId = localStorage.getItem("token_id");
    if (tokenId) {
      headers.set('Authorization', 'Bearer ' + tokenId)
    }
    const clonedReq = req.clone({
      url,
      headers: headers
    })
    return next.handle(clonedReq);
  }
}