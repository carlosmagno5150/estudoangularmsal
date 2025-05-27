import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ConfigService} from '../service/config.service';
import {UserInfo} from '../interfaces/interfaces';
import {AuthService} from '../service/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-check',
  imports: [ FormsModule,
    ReactiveFormsModule,
    NgIf],
  templateUrl: './check.component.html',
  styleUrl: './check.component.css'
})
export class CheckComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private router: Router,
    private configService: ConfigService,
    private authService: AuthService
  )
  {  }

  infoMessage: string = ""

  onSubmit() {
    if (this.loginForm.valid) {

      console.log('Login form submitted', this.loginForm.value);
      const email =this.loginForm.value.email ? this.loginForm.value.email : "";
      this.configService.loadConfig(email).subscribe(
        result => {
        console.log('api responds:  ${result}');

        const email = this.loginForm.value.email;
        const info: UserInfo = {
          email: (email == null) ? "" : email,
          Token: "",
          clientId: result.clientId,
          tenantId: result.tenantId,
        }

        this.authService.setUserInfo(info);
        this.router.navigate(['/login']);
      },
        error => {
          this.infoMessage = "Usuario nao reconhecido";
        }
      )
    }
  }

}
