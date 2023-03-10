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
          map((image: {id: number, image: string}) => 'data:image/jpg;base64,' + image.image)
        )
    }
  }

}
