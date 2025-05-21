import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface AppConfig {
  tenantId: string;
  clientId: string;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AppConfig> {

    return this.http.get<AppConfig>('http://localhost:3000/config');

  }
}
