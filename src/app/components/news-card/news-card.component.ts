import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RstApiService } from 'src/app/services/rst-api.service';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.sass']
})
export class NewsCardComponent implements OnInit {

  @Input() content: any;
  public image!: Observable<any>;

  constructor(
    private rstApiService: RstApiService,
  ) { }

  ngOnInit(): void {
    if (this.content.imageId) {
      this.image = this.rstApiService.getBlogImage(this.content.imageId)
        .pipe(
          map((image: {id: number, bytes: string}) => 'data:image/jpg;base64,' + image.bytes)
        )
    }
    this.filterPartialHtml();
  }

  filterPartialHtml(): void {
    const brackets = ['<', '/', '>'];
    const bodyLength = this.content.body.length;
    const last10characters = this.content.body.slice(bodyLength - 10);
    for (let i = 0; i < last10characters.length; i++) {
      if (brackets.includes(last10characters[i])) {
        this.content.body = this.content.body.slice(0, bodyLength - i);
        return;
      }
    }
  }

}
