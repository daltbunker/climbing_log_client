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
      const fd = new FormData();
      const body = this.blogForm.get('body')?.value;
      const title = this.blogForm.get('title')?.value;
      if (this.image && body && title) {
        fd.append('image', this.image);
        fd.append('body', body);
        fd.append('title', title);
        this.rstApiService.addBlog(fd)
          .subscribe({
            next: () => {
              this.notifierService.notify('default', 'Blog Added Succesfully');
              this.dialogRef.close({event: 'success'});
            },
            error: () => {
              this.notifierService.notify('default', 'failed to save blog');
            }
        });
      }
    }
  }
}
