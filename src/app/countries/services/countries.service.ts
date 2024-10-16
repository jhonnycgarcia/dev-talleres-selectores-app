import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Region, SmallCountry } from '../interfaces/country.interface';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania,
  ];

  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if(!region) return of([]);
    const url = `${this.baseUrl}/region/${region}?fields=name,cca3,borders`;
    return this.http.get<SmallCountry[]>(url)
      .pipe(
        catchError(() => of([]))
      );
  }

}
