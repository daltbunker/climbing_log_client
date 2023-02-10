import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.sass']
})
export class NewsCardComponent implements OnInit {

  @Input() content: any;

  constructor() { }

  ngOnInit(): void {
  }

}
