import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { SearchModel } from 'src/app/models/Search.model';
import { AuthService } from 'src/app/services/auth.service';
import { RstApiService } from 'src/app/services/rst-api.service';
import { AscentFormComponent } from '../ascent-form/ascent-form.component';
import { ClimbFormComponent } from '../climb-form/climb-form.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  @Output() submitLogEmitter = new EventEmitter<boolean>();
  @Input() data: Array<{value: string, type: string}> = [];
  private ascentDialogRef: MatDialogRef<AscentFormComponent, any> | undefined;
  private climbDialogRef: MatDialogRef<ClimbFormComponent, any> | undefined;
  public filteredData: Observable<SearchModel[]> | undefined;
  public searchForm = new FormGroup({
    searchControl: new FormControl('')
  }) 
  public searchResults: Array<any> = [];
  public searchResultKeys: Array<string> = [];
  private searchType = '';
  public suggestedAreas: string[] = [];
  public selectedArea = '';
  public selectedSector = '';
  public loggedIn = false;
  public role = '';

  constructor(
    public rstApiService: RstApiService,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn => {
      const role = this.authService.getRole();
      this.role = role ? role : '';
      this.loggedIn = loggedIn 
    })
    this.authService.updateLoginState();
    this.setSuggestedAreas();
    this.filteredData = this.searchForm.get('searchControl')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    ); 

    this.submitLogEmitter.subscribe(event => {
      if (event && this.ascentDialogRef) {
        this.ascentDialogRef.close();
      } else {
        console.warn('failed to close ascent form')
      }
    });
  }

  private _filter(value: string): {value: string, type: string}[] {
    const filterValue = value.toLowerCase();
    return this.data.filter(d => d.value.toLowerCase().includes(filterValue));
  }

  setSuggestedAreas(): void {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].type === 'area') {
        this.suggestedAreas.push(this.data[i].value);
      }
      if (this.suggestedAreas.length === 6) {
        break;
      }
    }
  }

  onSearch(): void {
    if (this.searchForm.value.searchControl) {
      const searchValue = this.searchForm.value.searchControl;
      if (this.searchType === 'climb') {
        this.searchClimbs(searchValue)
      } else {
        this.searchLocations(searchValue)
      }
    } else {
      // focus search box
    }
  }

  searchClimbs(searchValue: string) {
    this.selectedArea = '';
    this.selectedSector = '';
    this.rstApiService.getClimbsByName(searchValue)
    .subscribe({
      next: resp => {
        this.searchResults = resp.map((result: any) => {
          const { name, id, sector, area } = result;
          const grade = this.translateGrade(result.grade);
          return {
            name,
            grade,
            sector,
            area,
            id
          }
        })
        this.searchResultKeys = Object.keys(this.searchResults[0]);
        this.searchResultKeys.pop();
      }
    });
  }

  searchLocations(searchValue: any) {
    this.selectedArea = this.searchType !== 'sector' ? searchValue : '';
    this.selectedSector = '';
    this.rstApiService.getLocationsByParam(searchValue)
    .subscribe({
      next: resp => {
        this.searchResults = resp.map((result: any) => {
          const { id, country, state, sector, area } = result;
          return {
            country,
            state,
            sector,
            area,
            id
          }
        })
        if (this.searchType === 'sector') {
          this.selectedArea = this.searchResults[0]?.area;
        }
        this.searchResultKeys = Object.keys(this.searchResults[0]);
        this.searchResultKeys.pop();
      }
    })
  }

  onBreadcrumbClick(searchType: string, searchValue: string): void {
    this.setSearchType(searchType);
    this.searchLocations(searchValue);
  }

  getClimbs(location: any): void {
    this.selectedArea = location.area;
    this.selectedSector = location.sector;
    this.rstApiService.getClimbsByLocation(location.id)
      .subscribe({
        next: resp => {
          this.searchResults = resp.map((result: { name: string, grade: string, sector: string, area: string, id: number }) => {
            const grade = this.translateGrade(result.grade)
            return {
              name: result.name,
              grade,
              sector: result.sector,
              area: result.area,
              climbId: result.id
            }
          })
          this.searchResultKeys = Object.keys(this.searchResults[0]);
          this.searchResultKeys.pop();
        }
      })
  }

  setSearchType(type: string): void {
    this.searchType = type;
  }

  translateGrade(grade: string): string { // TODO: make this global
    if (grade.includes('R')) {
      const routeMap = ['5.4', '5.5', '5.6', '5.7', '5.8',
                        '5.9', '5.10a', '5.10b', '5.10c',
                        '5.10d', '5.11a', '5.11b', '5.11c',
                        '5.11d', '5.12a', '5.12b', '5.12c', 
                        '5.12d', '5.13a', '5.13b', '5.13c',
                        '5.13d', '5.14a', '5.14b', '5.14c',
                        '5.14d', '5.15a', '5.15b', '5.15c',
                      ]
      const gradeIndex = parseInt(grade.split('R')[1]);
      return routeMap[gradeIndex];
    } else if (grade.includes('B')) {
      return grade.replace('B', 'V'); 
    }
    return '';
  }

  openLogModal(climb: any): void {
    this.ascentDialogRef = this.dialog.open(AscentFormComponent, {
      width: '400px',
      minHeight: '300px',
      position: {top: '10vh'},
      data: { ...climb, submitLogEmitter: this.submitLogEmitter, formType: 'new' }
    })
  }

  openClimbForm(): void {
    this.climbDialogRef = this.dialog.open(ClimbFormComponent, {
      width: '400px',
      minHeight: '300px',
      position: {top: '10vh'}
    }) 
  }

}
