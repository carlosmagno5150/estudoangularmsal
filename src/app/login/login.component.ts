import {Component, OnInit} from '@angular/core';
import {AppConfig, ConfigService} from '../service/config.service';
import {AccountInfo, AuthenticationResult, PublicClientApplication} from '@azure/msal-browser';

export interface TData {
  account: AccountInfo | null;
  msalInstance: PublicClientApplication;
  token: string;
}

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {

  config!: AppConfig;
  data!: TData;

  constructor(private configService: ConfigService) {
  }

  async ngOnInit(): Promise<void> {
    this.configService.loadConfig().subscribe(async (config) => {
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
        console.log("authResult");
        console.log(authResult);
        console.log("Account");
        console.log(this.data.account)
        if (authResult !== null) {
          this.data.msalInstance.setActiveAccount(authResult!.account)
        }
        // console.log("authResult", authResult);
        const accounts = this.data.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          this.data.account = accounts[0];
          const response = this.data.msalInstance.acquireTokenSilent({
            account: authResult?.account,
            scopes: ["api://8949d550-d3a8-42c3-9e95-a95f04bdab1e/API.Read"]
          })
          this.data.token = (await response).accessToken;
          //await this.router.navigateByUrl("/home");
        }
      });
    });
  }

  async login(){
    await this.data.msalInstance.loginRedirect();
  }

  logout(){
    this.data.msalInstance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin
    })
  }

}
