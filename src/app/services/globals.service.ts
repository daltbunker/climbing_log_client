import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  constructor() { }

  translateGrade(grade: string): string {
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
}
