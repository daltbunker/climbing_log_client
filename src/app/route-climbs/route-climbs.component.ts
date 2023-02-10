import { Component, OnInit } from '@angular/core';
import { SearchModel } from '../models/Search.model';
import { RstApiService } from '../services/rst-api.service';

@Component({
  selector: 'app-route-climbs',
  templateUrl: './route-climbs.component.html',
  styleUrls: ['./route-climbs.component.sass']
})
export class RouteClimbsComponent implements OnInit {

  public searchData: Array<SearchModel> = [];
  public loading = [true, true];
  constructor(private rstApiService: RstApiService) { }

  ngOnInit(): void {
    this.rstApiService.getAllLocations('routes')
    .subscribe({
      next: allLocations => {
        allLocations.sectors.forEach((sector: string) => {
          this.searchData.push({value: sector, type: 'sector'})
        })
        allLocations.areas.forEach((area: string) => {
          this.searchData.push({value: area, type: 'area'})
        })
        this.loading[0] = false;
      }
    });

    this.rstApiService.getAllClimbs()
    .subscribe({
      next: allClimbs => {
        allClimbs.forEach((climb: { name: any; type: string}) => {
          if (climb.type === 'ROUTE') {
            this.searchData.push({value: climb.name, type: 'climb'})
          }
        })
        this.loading[1] = false;
      }
    })
  }

}
