import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { BouldersComponent } from './boulders/boulders.component';
import { HomeComponent } from './home/home.component';
import { MyClimbsComponent } from './my-climbs/my-climbs.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouteClimbsComponent } from './route-climbs/route-climbs.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'routes', component: RouteClimbsComponent },
  { path: 'boulders', component: BouldersComponent },
  { path: 'my-climbs', component: MyClimbsComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', pathMatch: 'full', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
