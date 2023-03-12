import { Component, Inject, OnInit, Optional } from '@angular/core';
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
  public formType = '';

  public blogForm = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    image: new FormControl()
  });

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BlogFormComponent>,
    private rstApiService: RstApiService,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    if (this.data.formType = 'edit') {
      this.formType = 'edit';
      this.blogForm.setValue({
        title: this.data.title || '',
        body: this.data.body || '',
        image: ''
      })
    }
  }

  updateImage(e: any): void {
    if (e.target.files[0].name) {
      this.image = e.target.files[0];
    }
  }

  submitBlog(): void {
    if (!this.blogForm.valid) {
      this.notifierService.notify('default', 'body and title are required');
      return;
    }
    if (this.formType === 'edit') {
      this.saveEditedBlog();
    } else {
      this.saveNewBlog();
    }
  }
  
  saveNewBlog(): void {
    if (!this.image) {
      this.notifierService.notify('default', 'Image is required');
      return;
    }
    const blog = {
      body: this.blogForm.get('body')?.value,
      title: this.blogForm.get('title')?.value
    }
    if (blog.body && blog.title) {
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

  saveEditedBlog(): void {
    const blog = {
      title: this.blogForm.get('title')?.value,
      body: this.blogForm.get('body')?.value
    }
    if (blog.title && blog.body && this.data.id) {
      this.rstApiService.updateBlog(blog, this.data.id)
        .subscribe({
          next: resp => {
            if (this.image) {
              this.saveBlogImage(this.image, resp.id);
            } else {
              this.notifierService.notify('default', 'Blog Added Succesfully');
              this.dialogRef.close({event: 'success'});
            }
          },
          error: () => {
            this.notifierService.notify('default', 'failed to save blog');
          }
        });
    } else {
      this.notifierService.notify('default', 'failed saving blog, please try again later')
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
