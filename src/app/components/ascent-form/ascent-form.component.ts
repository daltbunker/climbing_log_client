import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RstApiService } from 'src/app/services/rst-api.service';
import { NotifierService } from 'angular-notifier';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-ascent-form',
  templateUrl: './ascent-form.component.html',
  styleUrls: ['./ascent-form.component.sass']
})
export class AscentFormComponent implements OnInit {

  public ascentForm = new FormGroup({
    dateControl: new FormControl(new Date()),
    attemptsControl: new FormControl(''),
    commentControl: new FormControl(''),
    gradeControl: new FormControl('#44a3e6'),
    weightControl: new FormControl('')
  });

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private rstApiService: RstApiService,
    private notifierService: NotifierService,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
    if (this.data.formType === 'edit') {
      this.ascentForm.setValue({
        dateControl: new Date(this.data.date),
        attemptsControl: this.mapAttempt(this.data.attempts),
        commentControl: this.data.comment,
        gradeControl: this.data.grade,
        weightControl: this.data["over 200 lbs"] === "yes" ? "over200lbs" : "under200lbs"
      });
    } else {
      this.ascentForm.patchValue({
        gradeControl: this.data.grade
      })
    }
  }

  onSubmit(): void {
    if (this.ascentForm.valid) {
      const ascent = {
        attempts: this.ascentForm.value.attemptsControl,
        date: this.ascentForm.value.dateControl,
        comment: this.ascentForm.value.commentControl,
        grade: this.ascentForm.value.gradeControl,
        over200lbs: this.ascentForm.value.weightControl === "over200lbs" ? true : false
      }
      if (this.data.formType === 'edit') {
        this.saveAscent(ascent);
      } else {
        this.logAscent(ascent);
      }
    }
  }

  logAscent(ascent: any): void {
    if (this.data.id) {
      this.loaderService.startLoading();
      this.rstApiService.addAscent(ascent, this.data.id)
        .subscribe({
          next: data => {
            this.loaderService.stopLoading();
            this.notifierService.notify('default', 'Ascent added!');
            this.data.submitLogEmitter.emit(data);
          }
        });
    }
  }

  saveAscent(ascent: any): void {
    if (this.data.ascentId) {
      this.loaderService.startLoading();
      this.rstApiService.updateAscent(ascent, this.data.ascentId)
        .subscribe({
          next: () => {
            this.loaderService.stopLoading();
            this.notifierService.notify('default', 'Ascent updated!');
            this.data.submitLogEmitter.emit(true);
          }
        })
    }
  }

  mapAttempt(attempt: string): string {
    switch(attempt) {
      case('onsight'):
        return 'ONSIGHT';
      case('flash'):
        return 'FLASH';
      case('second go'):
        return 'SECOND_GO';
      case('+3 attempts'):
        return 'PLUS_3';
      default:
        return '';
    }
  }
}
