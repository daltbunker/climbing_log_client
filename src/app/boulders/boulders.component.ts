import { Component, OnInit } from '@angular/core';
import { SearchModel } from '../models/Search.model';
import { RstApiService } from '../services/rst-api.service';

@Component({
  selector: 'app-boulders',
  templateUrl: './boulders.component.html',
  styleUrls: ['./boulders.component.sass']
})
export class BouldersComponent implements OnInit {

  public searchData: Array<SearchModel> = [];
  public loading = [true, true];
  constructor(private rstApiService: RstApiService) { }

  ngOnInit(): void {
    this.rstApiService.getAllLocations('boulders')
    .subscribe({
      next: allLocations => {
        allLocations.sectors.forEach((sector: string) => {
          this.searchData.push({ value: sector, type: 'sector' })
        })
        allLocations.areas.forEach((area: string) => {
          this.searchData.push({ value: area, type: 'area' })
        })
        this.loading[0] = false;
      },
      error: () => {
        this.loading[0] = false;
      }
    });

    this.rstApiService.getAllClimbs()
    .subscribe({
      next: allClimbs => {
        allClimbs.forEach((climb: { name: any; type: string }) => {
          if (climb.type === 'BOULDER') {
            this.searchData.push({ value: climb.name, type: 'climb' })
          }
        })
        this.loading[1] = false;
      },
      error: () => {
        this.loading[1] = false;
      }
    })
  }

}
