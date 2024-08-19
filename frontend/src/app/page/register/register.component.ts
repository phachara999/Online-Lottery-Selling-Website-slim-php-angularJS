import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  constructor(private http: HttpClient, private fb: FormBuilder,private router: Router) {
    this.registerForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      password2: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      date: ['', Validators.required],
      toe: ['', [Validators.required]], // ต้องเป็นตัวเลข 10 หลัก],
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.validate();
    });
  }

   hasLeadingZero(): boolean {
    const toeControl = this.registerForm.get('toe');
    if (toeControl && toeControl.value) {
      const toeValue = toeControl.value.toString();
      if(toeValue.startsWith('0')){
        return true
      }
      return false
    }
    return false
  }


  validate() {
    const password1Control = this.registerForm.get('password1');
    const password2Control = this.registerForm.get('password2');
    const originalDate = new Date(this.registerForm.get('date')?.value);

    const currentYear = new Date().getFullYear();
    const birthYear = originalDate.getFullYear();
    const age = currentYear - birthYear;
    if (age < 18) {
      this.registerForm.get('date')?.setErrors({ agenoy: true });
    } else {
      this.registerForm.get('date')?.setErrors(null);
    }
    if (password1Control && password2Control) {
      const password1 = password1Control.value;
      const password2 = password2Control.value;

      if (password1 !== password2) {
        this.registerForm.get('password2')?.setErrors({ passwordMismatch: true });
      } else {
        this.registerForm.get('password2')?.setErrors(null);
      }
      const toeControl = this.registerForm.get('toe');
      if (toeControl) {
        const toe = toeControl.value;
        if (toe.length < 10) {
          toeControl.setErrors({ toeerr: true });
        } else {
          toeControl.setErrors(null);
        }
      }
    }
    if(this.hasLeadingZero()){
      this.registerForm.setErrors(null);
    }else{
      this.registerForm.setErrors({ toeerr2: true });
    }
  }


  register() {
    const password1Control = this.registerForm.get('password1')?.value;
    const fname = this.registerForm.get('fname')?.value;
    const lname = this.registerForm.get('lname')?.value;
    const toe = this.registerForm.get('toe')?.value;
    const email = this.registerForm.get('email')?.value;
    const date = this.formattdate(this.registerForm.get('date')?.value);

    let jsonObj = {
      pass :password1Control,
      fname : fname,
      lname : lname,
      email : email,
      bdate : date,
      toe : toe
    }
    console.log(jsonObj)
    let jsonString = JSON.stringify(jsonObj);
    this.http.post('http://localhost/webapi1/user/register' ,jsonString,{observe :'response'}).subscribe((respones =>{
      Swal.fire('สมัครสมาชิกเสร็จสิ้น','','success').then((respones)=>{
        if(respones.isConfirmed){
          this.router.navigate(['/']);
        }
      });
      console.log(respones.body)
    }),(err) => {
      Swal.fire(err.error.message,'','error')
    })
  }

  formattdate(date: any) {
    // วันที่ต้นที่คุณมี
    const originalDate = new Date(date);

    // ดึงข้อมูลปี ดูดาวน์เลือกครั้งละสองหลัก
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 เนื่องจากเดือนนับจาก 0
    const day = String(originalDate.getDate()).padStart(2, "0");

    // สร้างวันที่ในรูปแบบ "0000-00-00"
   let formattedDate = `${year}-${month}-${day}`;

    return formattedDate
  }

}
