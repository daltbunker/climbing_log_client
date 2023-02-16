import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass']
})
export class LoaderComponent implements OnDestroy, AfterViewInit {

  private loader?: Subscription;
  public isLoading = false;

  constructor(
    private loaderService: LoaderService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.isLoading = false;
    this.loader = this.loaderService.loading$.pipe().subscribe(
      (status: boolean) => {
        this.isLoading = status;
        this._changeDetectorRef.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.loader?.unsubscribe();
  }

}
