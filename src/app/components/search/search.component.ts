import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
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
  public loggedIn = false;
  public role = '';
  public dropdownResults: Array<any> = [];
  public areaResults: Array<any> = [];
  public climbResults: Array<any> = [];
  public suggestedAreas: string[] = [];
  public areaPath: any[] = []; // breadcrumbs
  public tableDisplay = '';
  private ascentDialogRef: MatDialogRef<AscentFormComponent, any> | undefined;
  private climbDialogRef: MatDialogRef<ClimbFormComponent, any> | undefined;
  private searchAreaTimeout: NodeJS.Timeout | undefined;
  public loadingAreas = false;
  public searchForm = new FormGroup({
    searchControl: new FormControl('')
  })
  //TODO: add loader for table

  constructor(
    public rstApiService: RstApiService,
    public dialog: MatDialog,
    private authService: AuthService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn => {
      const role = this.authService.getRole();
      this.role = role ? role : '';
      this.loggedIn = loggedIn 
    })
    this.authService.updateLoginState();
    this.setSuggestedAreas();

    this.searchForm.valueChanges.subscribe(event => {
      if (event.searchControl) {
        this.searchAreas(event.searchControl);
      }
    });

    this.submitLogEmitter.subscribe(event => {
      if (event && this.ascentDialogRef) {
        this.ascentDialogRef.close();
      } else {
        console.warn('failed to close ascent form');
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
          this.onAreaClick(result);
        }
      });
    }
  }

  onAreaClick(area: any): void {
    if (area.climbCount > 0) {
      this.getClimbs(area.id, area.name);
    } else {
      this.searchChildren(area.id, area.name);
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
    this.areaPath = area.path;
    this.loadingAreas = false;
    clearTimeout(this.searchAreaTimeout);
    if (area.climbCount > 0) {
      this.getClimbs(area.id);
    } else {
      this.searchChildren(area.id);
    }
  }

  searchChildren(id: number, name?: string): void {
    this.rstApiService.getAllAreaChildren(id).subscribe({
      next: (resp) => {
        if (resp.length === 0) {
          this.notifierService.notify('default', 'looks like this area doesn\'t have any climbs yet')
        } else {
          if (name) {
            this.areaPath.push({ id, name });
          }
          this.tableDisplay = 'areas';
          this.areaResults = resp;
        }
      },
      error: () => {
       this.notifierService.notify('default', 'sorry something went wront, please try again later.') 
      }
    })
  }

  setAreaPath(area: any): void {
    const areas = [...area.path.split(/\s*>\s*/), area.name];
    const areaIds = area.pathIds.split(',');
    this.areaPath = areas.map((areaName: string, i: number) => {
      return {
        name: areaName,
        id: areaIds[i]
      }
    });
  }

  onBreadcrumbClick(id: number): void {
    this.searchChildren(id);
    while(this.areaPath[this.areaPath.length -1].id !== id) {
      this.areaPath.pop();
    }
  }

  getClimbs(id: number, name?: string): void {
    this.rstApiService.getClimbsByArea(id).subscribe({
      next: resp => {
        if (resp.length === 0) {
          this.notifierService.notify('default', 'looks like this area doesn\'t have any climbs yet')
        } else {
          if (name) {
            this.areaPath.push({ id, name });
          }
          this.tableDisplay = 'climbs';
          this.climbResults = resp.map((result: any) => {
            const { name, id } = result;
            const grade = this.translateGrade(result.grade);
            return {
              name,
              grade,
              id
            }
          });
        }
      },
      error: () => {
       this.notifierService.notify('default', 'sorry something went wront, please try again later.') 
      }
    })
  }

  setSuggestedAreas(): void {
    // for (let i = 0; i < this.dropdownResults.length; i++) {
    //   if (this.dropdownResults[i].type === 'area') {
    //     this.suggestedAreas.push(this.dropdownResults[i].value);
    //   }
    //   if (this.suggestedAreas.length === 6) {
    //     break;
    //   }
    // }
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
    if (this.loggedIn) {
      this.ascentDialogRef = this.dialog.open(AscentFormComponent, {
        width: '400px',
        minHeight: '300px',
        position: {top: '10vh'},
        data: { ...climb, submitLogEmitter: this.submitLogEmitter, formType: 'new' }
      })
    } else {
      this.notifierService.notify('default', 'You must be logged in to add an ascent.');
    }
  }

  openClimbForm(): void {
    this.climbDialogRef = this.dialog.open(ClimbFormComponent, {
      width: '400px',
      minHeight: '300px',
      position: {top: '10vh'}
    }) 
  }

}
