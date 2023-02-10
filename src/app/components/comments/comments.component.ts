import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { RstApiService } from 'src/app/services/rst-api.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.sass']
})
export class CommentsComponent implements OnInit {

  @Input() public comments: any[] = [];
  @Input() public blogId!: number;
  @Input() public loggedIn = false;

  public showReplyInput = false;

  public commentForm = new FormGroup({
    text: new FormControl('')
  });

  constructor(
    private rstApiService: RstApiService,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
  }

  toggleReply(showReplyInput: boolean): void {
    this.showReplyInput = showReplyInput;
  }

  submitComment(): void {
    const commentText = this.commentForm.get('text')?.value;
    if (commentText) {
      this.rstApiService.addComment(this.blogId, { text: commentText })
        .subscribe({
          next: (comment) => {
            this.commentForm.reset();
            this.comments.push(comment);
            this.toggleReply(false);
          },
          error: () => {
            this.notifierService.notify('default', 'failed to save comment')
          }
        })
    }
  }

}
