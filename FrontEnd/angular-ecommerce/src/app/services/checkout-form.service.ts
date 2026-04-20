import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';//rxjs: Reactive JavaScript library, provides tools for working with asynchronous data streams
import { State } from '../common/state';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root',
})
export class CheckoutForm {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';



  constructor(private httpClient: HttpClient) { }



  getStates(theCountryCode: string): Observable<State[]> {

    const searchStatesUrl =
      `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<State[]>(searchStatesUrl);

  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesUrl);
  }





















  //Populate Credit Card Expiration Dates
  getCreditCardMonths(startMonth: number): Observable<number[]> {//Return an  Observable array

    let data: number[] = [];

    // build an array for "Month" dropdown list
    // - start at current month and loop until 

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);//The "of" operator from rxjs, will wrap an object as an Observable
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // build an array for "Year" downlist list
    // - start at current year and loop for next 10 years

    const startYear: number = new Date().getFullYear();//Get the current year
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

}
