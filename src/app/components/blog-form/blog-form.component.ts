import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RstApiService } from 'src/app/services/rst-api.service';
import { NotifierService } from 'angular-notifier';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.sass']
})
export class BlogFormComponent implements OnInit {

  private image?: any;

  public blogForm = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    image: new FormControl()
  });

  constructor(
    public dialogRef: MatDialogRef<BlogFormComponent>,
    private rstApiService: RstApiService,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
  }

  updateImage(e: any): void {
    if (e.target.files[0].name) {
      this.image = e.target.files[0];
    }
  }

  submitBlog(): void {
    // TODO: show image red if it's empty
    if (this.blogForm.valid) {
      const blog = {
        body: this.blogForm.get('body')?.value,
        title: this.blogForm.get('title')?.value
      }
      if (blog.body && blog.title && this.image) {
        this.rstApiService.addBlog(blog)
          .subscribe({
            next: resp => {
              this.saveBlogImage(this.image, resp.id);
            },
            error: () => {
              this.notifierService.notify('default', 'failed to save blog');
            }
        });
      }
    }
  }

  saveBlogImage(image: any, blogId: number): void {
    const fd = new FormData();
    fd.append('image', image);
    this.rstApiService.addBlogImage(fd, blogId)
      .subscribe({
        next: () => {
          this.notifierService.notify('default', 'Blog Added Succesfully');
          this.dialogRef.close({event: 'success'});
        },
        error: () => {
          // TODO: change form to update mode
          this.notifierService.notify('default', 'failed to save image');
        }
      });
      
  }
}
