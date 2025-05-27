import {Component, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {UserInfo, WeatherInfo} from '../interfaces/interfaces';
import {AccountInfo, AuthenticationResult, PublicClientApplication} from '@azure/msal-browser';
import {TData} from '../login/login.component';
import {AppConfig, ConfigService} from '../service/config.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  userInfo: UserInfo | null = null;
  config!: AppConfig;
  data!: TData;
  resposta: WeatherInfo[] = [];

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router
    ) {
  }

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo()

    if (!this.userInfo){
      //window.location.href = '/login';
      this.router.navigateByUrl('login');
      Promise.resolve();
      console.log("não tem user info")
    }

    const email = (this.userInfo) ? this.userInfo.email : "";

    this.configService.loadConfig(email).subscribe(async (config) => {
      this.config = config;

      this.data = {
        account: null as AccountInfo | null,
        msalInstance: new PublicClientApplication({
          auth: {
            clientId: this.config?.clientId,
            authority: 'https://login.microsoftonline.com/' + this.config?.tenantId
          }
        }),
        token: "",
      }

      await this.data.msalInstance.initialize();

      this.data.msalInstance.handleRedirectPromise().then(async (authResult: AuthenticationResult | null) => {

        if (authResult !== null) {
          this.data.msalInstance.setActiveAccount(authResult!.account)
        }
        // console.log("authResult", authResult);
        const accounts = this.data.msalInstance.getAllAccounts();
        //console.log(`accounts ${JSON.stringify(accounts)}`);
        if (accounts.length > 0) {
          this.data.account = accounts[0];
          const response = this.data.msalInstance.acquireTokenSilent({
            account: authResult?.account,
            scopes: ["api://8949d550-d3a8-42c3-9e95-a95f04bdab1e/API.Read"]
          })
          this.data.token = (await response).accessToken;
          //await this.router.navigateByUrl("/home");
          console.log('passando no handle')
        }
        else {
          console.log('não tem account')
        }
      });
    });
  }

  vai(){
    this.configService.getWeather(this.data.token).subscribe(async (result) => {
      console.log(result);
      console.log('OK');
      this.resposta = result;
    })
  }

}
