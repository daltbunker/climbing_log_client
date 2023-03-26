import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { RstApiService } from 'src/app/services/rst-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  @Output() onSearch = new EventEmitter<any>();
  @Output() updateBreadcrumbs= new EventEmitter<{ action: string, value: any }>();
  public dropdownResults: Array<any> = [];
  private searchAreaTimeout: NodeJS.Timeout | undefined;
  public loadingAreas = false;
  public searchForm = new FormGroup({
    searchControl: new FormControl('')
  });

  constructor(
    public rstApiService: RstApiService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(event => {
      if (event.searchControl) {
        this.searchAreas(event.searchControl);
      }
    });
  }

  onSearchEnter(): void {
    const query = this.searchForm.controls.searchControl.value;
    if (this.dropdownResults.length > 0 && query) {
      clearTimeout(this.searchAreaTimeout);
      this.loadingAreas = false;
      this.dropdownResults.forEach(result => {
        if (result.name === query) {
          this.updateBreadcrumbs.emit({action: 'update', value: result.path});
          this.onSearch.emit({ value: result });
        }
      });
    }
  }

  searchAreas(query: string): void {
    this.loadingAreas = true;
    if (this.searchAreaTimeout) {
      clearTimeout(this.searchAreaTimeout);
    }
    this.searchAreaTimeout = setTimeout(() => {
      this.rstApiService.getAllAreas(query).subscribe({
        next: (resp) => {
          if (resp.length === 0) {
            this.notifierService.notify('default', `we didn\'t find any results similar to "${query}"`)
          }
          this.loadingAreas = false;
          this.dropdownResults = resp.map((area: any) => {
            const path = [...area.path]; // not a deep clone
            path.pop();
            return {
              ...area,
              pathForDisplay: path.map((a: any) => a.name).join(' > ')
            }
          });
        },
        error: () => {
          this.loadingAreas = false;
          this.notifierService.notify('default', 'sorry something went wront, please try again later.') 
        }
      })
    }, 1000)
  }

  onDropdownSelect(area: any): void {
    this.updateBreadcrumbs.emit({action: 'update', value: area.path})
    this.loadingAreas = false;
    clearTimeout(this.searchAreaTimeout);
    this.onSearch.emit({ value: area });
  }
}
