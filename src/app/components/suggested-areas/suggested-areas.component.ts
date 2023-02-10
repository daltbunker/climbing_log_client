import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-suggested-areas',
  templateUrl: './suggested-areas.component.html',
  styleUrls: ['./suggested-areas.component.sass']
})
export class SuggestedAreasComponent implements OnInit {

  @Input() areas: string[] = [];
  @Output() onAreaClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  searchArea(area: string) {
    this.onAreaClicked.emit(area);
  } 


}
