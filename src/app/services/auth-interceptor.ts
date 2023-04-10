import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { LoaderService } from "./loader.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private errorHandler: ErrorHandlerService,
    private loaderService: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenId = localStorage.getItem("token_id");
    const addToken = tokenId && !req.url.includes('/auth') 
    let cloned: HttpRequest<any> | undefined;
    if (addToken) {
      cloned = req.clone({
          headers: req.headers.set("Authorization",
              "Bearer " + tokenId)
      });
    }
    return next.handle(cloned || req)
      .pipe(
        catchError((error: any) => {
          this.loaderService.stopLoading();
          this.errorHandler.handleError(error);
          return throwError(() => new Error(error.message));
        })
      )
  }
}
