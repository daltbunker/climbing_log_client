import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SplitDate } from 'src/app/models/SplitDate.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})

export class SideNavComponent implements OnInit {

  @Input() dates: SplitDate[] = [];
  @Output() onDateSelect = new EventEmitter<SplitDate>();
  public showDates = false;

  constructor() { }

  ngOnInit(): void {
  }

  scrollToBlog(date: SplitDate): void {
    if (this.showDates) {
      this.showDates = false;
    }
    this.onDateSelect.emit(date);
  }

  toggleDates(): void {
    this.showDates = !this.showDates;
  }

}
