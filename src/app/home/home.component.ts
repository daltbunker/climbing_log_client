import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { BlogFormComponent } from '../components/blog-form/blog-form.component';
import { SplitDate } from '../models/SplitDate.model';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { RstApiService } from '../services/rst-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  public blogs: any[] = [];
  public dates: SplitDate[] = [];
  public loggedIn = false;
  public role = '';
  public noBlogs = false;

  constructor(
    private rstApiService: RstApiService,
    private dialog: MatDialog,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.loaderService.startLoading();
    this.authService.loggedIn$.subscribe(loggedIn => {
      const role = this.authService.getRole();
      this.role = role ? role : '';
      this.loggedIn = loggedIn 
    })
    this.authService.updateLoginState();
    this.getAllBlogs();
  }

  getAllBlogs(): void {
    this.rstApiService.getAllBlogs()
      .subscribe({
        next: resp => {
          if (resp.length < 1) {
            this.noBlogs = true;
          }
          resp.forEach((blog: any) => {
            blog.image = 'data:image/jpg;base64,' + blog.image;
            blog.body = blog.body.replaceAll('*NL*', '<br>') + '...';
            this.addDate(blog.createdDate)
          });
          this.blogs = resp;
          this.sortBlogsAndDates();
          this.loaderService.stopLoading();
        },
        error: () => {
          this.notifierService.notify('default', 'Failed to load blogs :(');
          this.loaderService.startLoading();
        }
      })
  }

  addDate(date: string): void {
    if (date) {
      const { year, month, time } = this.splitDate(date);
      if (!this.dates.find(date => date.year === year && date.month === month)) {
        this.dates.push({ year, month, time })
      }
    }
  }

  splitDate(date: string): SplitDate {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = formattedDate.toLocaleString("en-US", { month: "long" });
    const time = formattedDate.getTime(); 
    return { year, month, time };
  }

  sortBlogsAndDates(): void {
    this.dates.sort((a, b) => b.time - a.time)
    this.blogs.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
  }

  openBlogForm(): void {
    const dialogRef = this.dialog.open(BlogFormComponent, {
      width: '90%',
      minHeight: '400px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'success') {
        this.getAllBlogs();
      }
    })
  }

  getBlogIdByDate(date: { month: string, year: number }): number {
    for (let i = 0; i < this.blogs.length; i++) {
      const blog = this.blogs[i];
      if (blog.createdDate) {
        const { year, month } = this.splitDate(blog.createdDate);
        if (date.year === year && date.month === month) {
          return blog.id;
        }
      }
    }
    return -1;
  }

  scrollToBlog(event: any): void {
    if (event.month && event.year) {
      const blogId = this.getBlogIdByDate(event);
      if (blogId >= 0) {
        const newsCardElement = document.getElementById(blogId.toString());
        const newsCardTop = newsCardElement ? newsCardElement.getBoundingClientRect().top : 0;
        const offsetPosition = newsCardTop + window.pageYOffset - 75;
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });
      } 
    }
  }
}
