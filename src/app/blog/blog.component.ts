import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RstApiService } from '../services/rst-api.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.sass']
})
export class BlogComponent implements OnInit {

  public content?: {
    id: number
    title: string,
    author: string,
    createdDate: string,
    image: any,
    body: string,
    comments: any[],
    likes: string[]
  };
  public image: any;
  public likedByUser = false;
  public loggedIn = false;
  public notFound = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private rstApiService: RstApiService) { }

  ngOnInit(): void {
    // this.openBlogForm(); // FOR TESTING CONVENIENCCE

    this.authService.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn 
      this.setLikedByUser(this.content ? this.content.likes : []);
    })
  
    this.route.params.subscribe(params => {
      if (params['id'] >= 0) {
        this.setBlogContent(params['id']);
      } else {
        this.notFound = true;
      }
    });
  }

  setBlogContent(id: number) {
    this.rstApiService.getBlogById(id)
      .subscribe({
        next: (resp) => {
          resp.image = 'data:image/jpg;base64,' + resp.image;
          resp.body = resp.body.replaceAll('*NL*', '<br>');
          this.content = resp;
          if (this.loggedIn) {
            this.setLikedByUser(resp.likes);
          }
        },
        error: () => {
          this.notFound = true;
        }
      })
  }

  submitLike(id: number) {
    if (this.likedByUser && confirm("You already liked this blog, would you like to retract your like?")) {
      this.rstApiService.deleteLike(id)
        .subscribe({
          next: () => {
            this.likedByUser = false;
          },
          error: () => {
            console.warn('failed to remove like')
          }
        })
    } else {
      this.rstApiService.addLike(id)
        .subscribe({
          next: () => {
            this.likedByUser = true; 
          },
          error: () => {
            console.warn('failed to save like')
          }
        });
    }
  }

  setLikedByUser(likes: any[]): void {
    const username = this.authService.getUsername();
    likes.forEach(like => {
      if (like === username) {
        this.likedByUser = true;
      }
    })
  }
}
