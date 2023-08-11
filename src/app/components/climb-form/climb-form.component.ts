import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { LoaderService } from 'src/app/services/loader.service';
import { RstApiService } from 'src/app/services/rst-api.service';

@Component({
  selector: 'app-climb-form',
  templateUrl: './climb-form.component.html',
  styleUrls: ['./climb-form.component.sass']
})
export class ClimbFormComponent implements OnInit {

  @ViewChild('area') areaElementRef: ElementRef | undefined;
  public countries: any[] = [];
  public path: any[] = [];
  public climbForm = new FormGroup({
    typeControl: new FormControl('route'),
    nameControl: new FormControl(''),
    countryControl: new FormControl({id: 0, name: ''}),
    areaControl: new FormControl(''),
  });
  private oldFormState = {
    country: {id: 0, name: ''},
    area: ''
  }
  public areaResults: any[] = [];
  public loadingArea = false;
  private areaSearchTimeout: NodeJS.Timeout | undefined;

  constructor(
    private rstApiService: RstApiService,
    private notifierService: NotifierService,
    private dialogRef: MatDialogRef<ClimbFormComponent>,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.setCountries();
    this.climbForm.valueChanges.subscribe(event => {
      if (event.countryControl && event.countryControl.id !== this.oldFormState.country.id) {
        this.oldFormState.country = {...event.countryControl};
        this.path = [];
      }
      if (event.areaControl && event.areaControl !== this.oldFormState.area) {
        this.oldFormState.area = event.areaControl;
        this.findAreas(event.areaControl);
      }
    });
  }

  setCountries(): void {
    this.loaderService.startLoading();
    this.rstApiService.getCountries().subscribe({
      next: (resp) => {
        this.loaderService.stopLoading();
        this.countries = resp;
        this.setCountryControl('united states');
      },
    });
  }

  setCountryControl(country: string) {
    const indexOfCountry = this.countries.map(country => country.name).indexOf(country);
    this.climbForm.controls.countryControl.setValue(this.countries[indexOfCountry]);
  }
 
  findAreas(area: string): void {
    this.loadingArea = true;
    if (this.areaSearchTimeout) {
      clearTimeout(this.areaSearchTimeout);
    }
    this.areaSearchTimeout = setTimeout(() => {
      this.rstApiService.getAllAreas(area, this.getCountryId())
        .subscribe({
          next: resp => {
            if (resp.length > 0) {
              this.areaResults = resp.map((area: any) => {
                const path = [...area.path]; // not a deep clone
                path.pop();
                return {
                  ...area,
                  pathForDisplay: path.map((a: any) => a.name).join(' > ')
                }
              });
            } else {
              this.areaResults = [];
            }
            this.loadingArea = false;
          },
          error: () => {
            this.loadingArea = false;
          }
        });
    }, 1000)
  }

  getCountryId(): number {
    if (this.climbForm.controls.countryControl.value?.id) {
      return this.climbForm.controls.countryControl.value.id; 
    } else {
      return 0;
    }
  }

  onSubmit(): void {
    const areaValue = this.climbForm.value.areaControl; 
    if (areaValue?.length && confirm(`Would you like "${areaValue}" to be included in the area?`)) {
      this.path.push(areaValue);
    } 
    if (this.path.length === 0 && this.areaElementRef) {
      this.areaElementRef.nativeElement.focus();
      this.climbForm.controls.areaControl.setErrors({'incorrect': true});
    } else if (this.climbForm.valid) {
      const climb = {
        type: this.climbForm.value.typeControl,
        name: this.climbForm.value.nameControl,
        countryId: this.climbForm.value.countryControl?.id,
        path: this.path
      }
      this.addClimb(climb);
    }
  }

  addClimb(climb: any): void {
    this.loaderService.startLoading();
    this.rstApiService.addClimb(climb)
      .subscribe({
        next: () => {
          this.loaderService.stopLoading();
          this.notifierService.notify('default', 'Climb added!');
          this.dialogRef.close();
        }
      });
  }

  setPath(path: any[]): void {
    const country = path.shift();
    this.setCountryControl(country.name);
    this.path = path;
  }

  addArea(): void {
    const area = this.climbForm.value.areaControl;
    if (area) {
      this.path.push({name: area, id: 0});
      this.climbForm.controls.areaControl.setValue('');
    } else if (this.areaElementRef) {
      this.areaElementRef.nativeElement.focus();
      this.climbForm.controls.areaControl.setErrors({'incorrect': true});
    } 
  }
  
  deleteArea(): void {
    if (this.path.length > 0) {
      this.path.pop();
    }
  }

}
