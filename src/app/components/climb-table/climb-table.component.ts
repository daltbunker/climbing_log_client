import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-climb-table',
  templateUrl: './climb-table.component.html',
  styleUrls: ['./climb-table.component.sass']
})
export class ClimbTableComponent implements OnInit {

  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Output() tableEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onRowClick(row: any): void {
    if (row.grade) {
      this.tableEvent.emit({ type: 'climb', climb: row });
    } else {
      this.tableEvent.emit({ type: 'area', area: row });
    } 
  }

}
