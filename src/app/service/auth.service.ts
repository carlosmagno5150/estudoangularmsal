import { Injectable } from '@angular/core';
import {StorageService} from './storage.service';
import {UserInfo} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  KEY_USER: string = 'USER_'

  constructor(
    private storageService: StorageService,
  ) { }

  setUserInfo(userInfo: UserInfo) {
    this.storageService.set(this.KEY_USER, userInfo)
  }

  setClear(){
    localStorage.clear();
  }

  getUserInfo(): UserInfo | null{
    const data = this.storageService.get<UserInfo>(this.KEY_USER);
    if (data)
      return data
    return null
  }

}

