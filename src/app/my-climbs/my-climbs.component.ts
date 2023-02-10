import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AscentFormComponent } from '../components/ascent-form/ascent-form.component';
import { RstApiService } from '../services/rst-api.service';

@Component({
  selector: 'app-my-climbs',
  templateUrl: './my-climbs.component.html',
  styleUrls: ['./my-climbs.component.sass']
})
export class MyClimbsComponent implements OnInit {

  @Output() submitLogEmitter = new EventEmitter<boolean>();
  public climbs: any[] = [];
  public climbKeys: string[] = [];
  private dialogRef: MatDialogRef<unknown, any> | undefined;

  constructor(
    private rstApiService: RstApiService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.setClimbs();
    this.submitLogEmitter.subscribe(event => {
      if (event && this.dialogRef) {
        this.dialogRef.close();
        this.setClimbs();
      } else {
        console.warn('failed to close ascent form')
      }
    });
  }

  setClimbs(): void {
     this.rstApiService.getUserAscents()
      .subscribe({
        next: (resp: any[]) => {
          this.climbs = resp.map(ascent => {
            return {
              name: ascent.name,
              attempts: this.mapAttempt(ascent.attempts),
              date: new Date(ascent.date).toLocaleDateString(),
              comment: ascent.comment,
              ascentId: ascent.id
            }
          })
          this.climbKeys = Object.keys(this.climbs[0]);
          this.climbKeys.pop();
        }
      });
  }  

  mapAttempt(attempt: string): string {
    switch(attempt) {
      case('ONSIGHT'):
        return 'onsight';
      case('FLASH'):
        return 'flash';
      case('SECOND_GO'):
        return 'second go';
      case('PLUS_3'):
        return '+3 attempts';
      default:
        return '';
    }
  }

  openLogModal(climb: any): void {
    this.dialogRef = this.dialog.open(AscentFormComponent, {
      width: '400px',
      minHeight: '300px',
      data: { ...climb, submitLogEmitter: this.submitLogEmitter, formType: 'edit' }
    })
  }
}
