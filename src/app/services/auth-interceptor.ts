import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private baseUrl = environment.baseUrl;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = this.baseUrl + req.url;
    const tokenId = localStorage.getItem("token_id");
    if (tokenId) {
      const cloned = req.clone({
          url,
          headers: req.headers.set("Authorization",
              "Bearer " + tokenId)
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}