import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Convert as userConvert,User  } from 'src/app/model/user.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  data:any
  login = this.formBuilder.group({
    email: '',
    pass: ''
  });

  constructor(
    private formBuilder: FormBuilder,private http: HttpClient,private router: Router
  ) {}
  submit(){
    let jsonObj = {
      email :this.login.value.email,
      pass : this.login.value.pass  
    }
    let jsonString = JSON.stringify(jsonObj);
    this.http.post('http://localhost/webapi1/user/login' ,jsonString,{observe :'response'}).subscribe((respones =>{
      this.data = userConvert.toUser(JSON.stringify(respones.body));
      let data = JSON.stringify(respones.body);
      console.log(this.data)
      localStorage.setItem('userdata',data);
      if(this.data.role == 1){
        this.router.navigate(['/admin-dash']);  
      }else{
        this.router.navigate(['/']);  
      } 
    }),(err) => {
      console.log(err)
    })
  }
}
