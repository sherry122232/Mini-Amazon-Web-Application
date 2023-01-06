import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {
  

  private countriesUrl = environment.luv2shopApiUrl+"/countries";
  private statesUrl = environment.luv2shopApiUrl+"/states";

  constructor(private httpClient: HttpClient) { }


  getStates(theCountryCode: string): Observable<State[]> {

    //search url
    const searchStateUrl =`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] =[];  
  
  
  // build an array for "month" drop down list
  // start at current month and loop until

  for(let theMonth = startMonth; theMonth <=12 ; theMonth++){
    data.push(theMonth);
  }

  return of(data);

  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] =[];  
  
  
  // build an array for "Year" drop down list
  // start at current year and loop for next 10 years

  const startYear: number = new Date().getFullYear();
  const endYear: number = startYear + 10;

  for(let theYear = startYear; theYear <=endYear ; theYear++){
    data.push(theYear);
  }

  return of(data);
  
  }
}


interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}