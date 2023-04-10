import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
import { AscentFormComponent } from '../components/ascent-form/ascent-form.component';
import { ClimbFormComponent } from '../components/climb-form/climb-form.component';
import { AuthService } from '../services/auth.service';
import { GlobalsService } from '../services/globals.service';
import { LoaderService } from '../services/loader.service';
import { RstApiService } from '../services/rst-api.service';

@Component({
  selector: 'app-climbs',
  templateUrl: './climbs.component.html',
  styleUrls: ['./climbs.component.sass']
})
export class ClimbsComponent implements OnInit {

  @Output() submitLogEmitter = new EventEmitter<any>();

  public loggedIn = false;
  public role = '';
  public areaResults: any[] = [];
  public climbResults: any[] = [];
  public breadcrumbs: any[] = [];

  private climbDialogRef: MatDialogRef<ClimbFormComponent, any> | undefined;
  private ascentDialogRef: MatDialogRef<AscentFormComponent, any> | undefined;
  

  constructor(
    private dialog: MatDialog,
    private rstApiService: RstApiService,
    private notifierService: NotifierService,
    private authService: AuthService,
    private globalsService: GlobalsService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.authService.updateLoginState();
    this.authService.loggedIn$.subscribe(loggedIn => {
      const role = this.authService.getRole();
      this.role = role ? role : '';
      this.loggedIn = loggedIn 
    });

    this.submitLogEmitter.subscribe(event => {
      if (event && this.ascentDialogRef) {
        this.ascentDialogRef.close();
      } else {
        console.warn('failed to close ascent form');
      }
    });
  }

  onSearch(event: { value :any }): void {
    if (typeof event.value === 'string') {
      this.getClimbsByName(event.value);
    } else if (event.value.climbCount > 0 && event.value.childrenCount > 0) {
      this.getClimbsAndAreas(event.value.id); 
    }
    else if (event.value.climbCount > 0) {
      this.getClimbByArea(event.value.id)
    } else {
      this.searchChildren(event.value.id);
    }
  }

  onTableEvent(event: any): void {
    if (event.type === 'climb') {
      this.openLogModal(event.climb);
    } else if (event.type === 'area') {
      if (event.area.climbCount > 0 && event.area.childrenCount > 0) {
        this.getClimbsAndAreas(event.area.id, event.area.name);
      } else if (event.area.climbCount > 0) {
        this.getClimbByArea(event.area.id, event.area.name);
      } else {
        this.searchChildren(event.area.id, event.area.name);
      }
    }
  }
  
  openClimbForm(): void {
    this.climbDialogRef = this.dialog.open(ClimbFormComponent, {
      width: '400px',
      minHeight: '300px',
      position: {top: '10vh'}
    }) 
  }

  searchChildren(id: number, name?: string): void {
    this.loaderService.startLoading();
    this.rstApiService.getAllAreaChildren(id).subscribe({
      next: (resp) => {
        this.loaderService.stopLoading();
        if (resp.length === 0) {
          this.notifierService.notify('default', 'looks like this area doesn\'t have any climbs yet')
        } else {
          if (name) {
            this.breadcrumbs.push({ id, name });
          }
          this.climbResults = [];
          this.areaResults = resp;
        }
      }
    })
  }

  getClimbByArea(id: number, name?: string): void {
    this.loaderService.startLoading();
    this.rstApiService.getClimbsByArea(id).subscribe({
      next: resp => {
        this.loaderService.stopLoading();
        if (resp.length === 0) {
          this.notifierService.notify('default', 'looks like this area doesn\'t have any climbs yet');
        } else {
          if (name) {
            this.updateBreadcrumbs({ action: 'push', value: { id, name } });
          }
          this.areaResults = [];
          this.climbResults = resp.map((result: any) => {
            const { name, id, area } = result;
            return {
              name,
              grade: this.globalsService.translateGrade(result.grade),
              id,
              area
            }
          });
        }
      }
    });
  }

  getClimbsByName(name: string): void {
    this.loaderService.startLoading();
    this.rstApiService.getClimbsByName(name).subscribe(({
      next: (resp) => {
        this.loaderService.stopLoading();
        this.breadcrumbs = [];
        this.areaResults = [];
        this.climbResults = resp.map((climb: any) => {
          return {
            ...climb,
            grade: this.globalsService.translateGrade(climb.grade)
          }
        });
      }
    }))
  }

  getClimbsAndAreas(id: number, name?: string): void {
    console.log('start loading')
    this.loaderService.startLoading();
    forkJoin({
      climbs: this.rstApiService.getClimbsByArea(id),
      areas: this.rstApiService.getAllAreaChildren(id)
    }).subscribe({
      next: (responses) => {
        this.loaderService.stopLoading();
        if (name) {
          this.updateBreadcrumbs({ action: 'push', value: { id, name } });
        }
        const { climbs, areas } = responses;
        this.areaResults = [...areas];
        this.climbResults = [...climbs]; 
      }
    })
  }

  onBreadcrumbClick(id: number): void {
    if (this.breadcrumbs[this.breadcrumbs.length - 1].id === id) {
      this.notifierService.notify('default', 'this area is already selected');
      return;
    }
    this.climbResults = [];
    this.getClimbsAndAreas(id);
    while(this.breadcrumbs[this.breadcrumbs.length -1].id !== id) {
      this.breadcrumbs.pop();
    }
  }

  updateBreadcrumbs(event: { action: string, value: any }): void {
    switch(event.action) {
      case 'push':
        this.breadcrumbs.push(event.value);
        break;
      case 'update':
        this.breadcrumbs = event.value;
    }
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

}
