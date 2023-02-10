import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BouldersComponent } from './boulders/boulders.component';
import { RouteClimbsComponent } from './route-climbs/route-climbs.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SearchComponent } from './components/search/search.component';
import { MyClimbsComponent } from './my-climbs/my-climbs.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ClimbFormComponent } from './components/climb-form/climb-form.component';
import { AscentFormComponent } from './components/ascent-form/ascent-form.component';
import { BlogComponent } from './blog/blog.component';
import { BlogFormComponent } from './components/blog-form/blog-form.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NotifierModule } from 'angular-notifier';
import { SuggestedAreasComponent } from './components/suggested-areas/suggested-areas.component';
import { CommentsComponent } from './components/comments/comments.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NewsCardComponent,
    HomeComponent,
    BouldersComponent,
    RouteClimbsComponent,
    SideNavComponent,
    SearchComponent,
    MyClimbsComponent,
    LoginComponent,
    ClimbFormComponent,
    AscentFormComponent,
    BlogComponent,
    BlogFormComponent,
    SuggestedAreasComponent,
    CommentsComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatIconModule,
    LazyLoadImageModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'middle'
        },
        vertical: {
          position: 'top'
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 2500
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
