import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WeatherInfo} from '../interfaces/interfaces';

export interface AppConfig {
  tenantId: string;
  clientId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private http: HttpClient,
  ) {}

  loadConfig(email: string): Observable<AppConfig> {
    return this.http.get<AppConfig>('http://localhost:5096/check?email=' + email);
  }


  getWeather(token: string): Observable<WeatherInfo[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`); // Example

    return this.http.get<WeatherInfo[]>('http://localhost:5096/weatherforecast/', {headers: headers} );
  }


}
