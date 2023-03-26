import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AscentFormComponent } from '../components/ascent-form/ascent-form.component';
import { ClimbFormComponent } from '../components/climb-form/climb-form.component';
import { AuthService } from '../services/auth.service';
import { GlobalsService } from '../services/globals.service';
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
    private globalsService: GlobalsService
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
    if (event.value.climbCount > 0) {
      this.getClimbs(event.value.id)
    } else {
      this.searchChildren(event.value.id);
    }
  }

  onTableEvent(event: any): void {
    if (event.type === 'climb') {
      this.openLogModal(event.climb);
    } else if (event.type === 'area') {
      if (event.area.climbCount > 0) {
        this.getClimbs(event.area.id, event.area.name);
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
    this.rstApiService.getAllAreaChildren(id).subscribe({
      next: (resp) => {
        if (resp.length === 0) {
          this.notifierService.notify('default', 'looks like this area doesn\'t have any climbs yet')
        } else {
          if (name) {
            this.breadcrumbs.push({ id, name });
          }
          this.climbResults = [];
          this.areaResults = resp;
        }
      },
      error: () => {
       this.notifierService.notify('default', 'sorry something went wront, please try again later.') 
      }
    })
  }

  getClimbs(id: number, name?: string): void {
    this.rstApiService.getClimbsByArea(id).subscribe({
      next: resp => {
        if (resp.length === 0) {
          this.notifierService.notify('default', 'looks like this area doesn\'t have any climbs yet')
        } else {
          if (name) {
            this.updateBreadcrumbs({ action: 'push', value: { id, name } })
          }
          this.areaResults = [];
          this.climbResults = resp.map((result: any) => {
            const { name, id } = result;
            const grade = this.globalsService.translateGrade(result.grade);
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
    });
  }

  onBreadcrumbClick(id: number): void {
    if (this.breadcrumbs[this.breadcrumbs.length - 1].id === id) {
      this.notifierService.notify('default', 'this area is already selected');
      return;
    }
    this.climbResults = [];
    this.searchChildren(id);
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
