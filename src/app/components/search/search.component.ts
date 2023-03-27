import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
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
  public loading = false;
  public searchForm = new FormGroup({
    searchControl: new FormControl('')
  });

  private searchAreaTimeout: NodeJS.Timeout | undefined;

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
      this.loading = false;
      this.dropdownResults.forEach(result => {
        if (result === query || result.name === query) {
          this.updateBreadcrumbs.emit({action: 'update', value: result.path});
          this.onSearch.emit({ value: result });
        }
      });
    }
  }

  searchAreas(query: string): void {
    this.loading = true;
    if (this.searchAreaTimeout) {
      clearTimeout(this.searchAreaTimeout);
    }
    this.searchAreaTimeout = setTimeout(() => {
      forkJoin({
        areas: this.rstApiService.getAllAreas(query),
        climbs: this.rstApiService.getClimbNames(query)
      }).subscribe({
        next: (responses) => {
          this.loading = false;
          const { areas, climbs } = responses;
          if (areas.length === 0 && climbs.length === 0) {
            this.notifierService.notify('default', `we didn\'t find any results similar to "${query}"`)
          }
          this.dropdownResults = [...climbs, ...areas.map((area: any) => {
            const path = [...area.path]; // not a deep clone
            path.pop();
            return {
              ...area,
              pathForDisplay: path.map((a: any) => a.name).join(' > ')
            } 
          })]
        },
        error: () => {
          this.loading = false;
          this.notifierService.notify('default', 'sorry something went wront, please try again later.') 
        }
      })
    }, 1000)
  }

  onDropdownSelect(result: any): void {
    if (result.name) {
      this.updateBreadcrumbs.emit({action: 'update', value: result.path})
      this.onSearch.emit({ value: result });
    } else {
      this.onSearch.emit({ value: result });
    }
    this.loading = false;
    clearTimeout(this.searchAreaTimeout);
  }
}
