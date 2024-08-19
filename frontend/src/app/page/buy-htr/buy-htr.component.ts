import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Convert as detailConvert, Detail, Detail2 } from 'src/app/model/detail.model';
import { Convert as uderConvert, User } from 'src/app/model/user.model';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-buy-htr',
  templateUrl: './buy-htr.component.html',
  styleUrls: ['./buy-htr.component.scss']
})


export class BuyHtrComponent {
  data: any
  data1: any
  data3: any
  data4: any = [];
  totalpriceData4:number = 0
  constructor(private router: Router, private http: HttpClient) {

    if ((localStorage.getItem('userdata'))) {
      this.data = uderConvert.toUser(localStorage.getItem('userdata')!)
      // console.log('userdata ' +this.data)
      console.log(this.data.fname)
    }
    if (!this.data) {
      this.router.navigate(['/login']);
    }

    this.all()
    this.http.get('http://localhost/webapi1/loterry/gethisdate/' + this.data.id).subscribe(data => {

      // this.data1 = detailConvert.toDetail2(JSON.stringify(data))
       this.data3 = detailConvert.toDetail2(JSON.stringify(data))
       console.log(this.data3)
    });
  }

  logout() {
    Swal.fire('ออกจากระบบสำเร็จ', '', 'success').then((res) => {
      localStorage.removeItem('userdata')
      window.location.reload();
    })
  }
  konha() {
    const input1 = (document.getElementById('datekonha') as HTMLInputElement).value;
    var dateParts = input1.split("-");
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];
    console.log(this.data.id)
    this.http.get("http://localhost/webapi1/loterry/konha/" + this.data.id + '/' + year + '/' + month + '/' + day).subscribe(data => {
      this.data1 = data;
      console.log(this.data1);
    })
  }

  konha2(){
    const input4 = (document.getElementById('ip4') as HTMLInputElement).value || '_';
    const input5 = (document.getElementById('ip5') as HTMLInputElement).value || '_';
    const input6 = (document.getElementById('ip6') as HTMLInputElement).value || '_';
    
    const leg = input4+input5+input6
    console.log(leg)
    this.http.get(`http://localhost/webapi1/loterry/konh/${this.data.id}/${leg}/10/10`).subscribe(data => {
      this.data4 = data;
      console.log(this.totalpriceData4)
      this.data4.forEach((element:any) => {
        this.totalpriceData4 += element.price_lot
      });
  
    })
  }

  all(){
    this.http.get('http://localhost/webapi1/loterry/gethis/' + this.data.id).subscribe(data => {

    this.data1 = detailConvert.toDetail2(JSON.stringify(data))
    // this.data3 = detailConvert.toDetail2(JSON.stringify(data))
  });
  this.data4 =[];
  this.totalpriceData4 = 0;
  }
  
 
  // showdetail(id:number){
  //   this.router.navigate(['/buy-detail'],id);
  // }
}
