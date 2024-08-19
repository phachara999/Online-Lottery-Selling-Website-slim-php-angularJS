import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Convert as userConvert, User } from 'src/app/model/user.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-buy-page',
  templateUrl: './buy-page.component.html',
  styleUrls: ['./buy-page.component.scss']
})
export class BuyPageComponent {
  data: any;
  totalbai: any = 0;
  detailtt: any = [];
  totalprice: number = 0;
  totailLot:any = [];
  check: boolean = false;
  ownlot: any;

  constructor(private router: Router, private http: HttpClient) {
    // localStorage.removeItem('userdata')
    if ((localStorage.getItem('userdata'))) {
      this.data = userConvert.toUser(localStorage.getItem('userdata')!)
      this.showlottobuy();
    }
    if (!this.data) {
      this.router.navigate(['/login']);
    }
  }
  selectbuy(lot: any) {
    const index = this.detailtt.findIndex((item: any) => item.id === lot.id);
    if (index !== -1) {
      // ถ้ามีข้อมูลที่ตรงกับ lot.num ใน detailtt ให้นำออก
      this.detailtt.splice(index, 1);
      this.totailLot.splice(index, 1);
      this.totalprice -= lot.price_lot;
    } else {
      // ถ้ายังไม่มีข้อมูลที่ตรงกับ lot.num ใน detailtt ให้เพิ่มเข้าไป
      this.detailtt.push(lot);
      this.totalprice += lot.price_lot;
      this.totailLot.push(lot);
    }
    this.totalbai = this.detailtt.length;
    // console.log(this.detailtt)
  }
  logout(){
    Swal.fire('ออกจากระบบสำเร็จ','','success').then((res) => {
      localStorage.removeItem('userdata')
      window.location.reload();
    })
  }

  confirmtobuy() {
    const idlot = this.detailtt.map((i: any) => {
      return i.id
    })
    const idlotTik = this.totailLot.map((i: any) => {
      return i.ticket_id
    })
    const data = {
      userid: parseInt(this.data.id!, 10),
      id_lot: idlotTik,
      total_price: this.totalprice,
      total_bai : this.totalbai
    }
    const jsonString = JSON.stringify(data);

    if (this.totalbai == 0) {
      Swal.fire('กรุณาเลือกล็อตเตอรี่ที่ต้องการซื้อ', '', 'error')
    }
    else {
      Swal.fire({
        title: 'ยืนยันการซื้อ',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'ยืนยัน',
        denyButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post('http://localhost/webapi1/loterry/buylot', jsonString, { observe: 'response' }).subscribe((respones => {
            if(respones.status == 200){

              for (const id of idlot) {
                for (let i = 0; i < this.ownlot.length; i++) {
                  if (this.ownlot[i].id === id) {
                    this.ownlot.splice(i, 1);
                    break;
                  }
                }
                console.log(id)
                this.http.delete(`http://localhost/webapi1/loterry/deleteLotIncart/`+id).subscribe((respones)=>{});
              }
            }
            Swal.fire({
              title: 'ซื้อสำเร็จ',
              icon: 'success',
              showDenyButton: true,
              confirmButtonText: 'ยืนยัน',
              denyButtonText: 'ยกเลิก',
            })
          }), (err) => {
            console.log(err)
          })
        }
      })
    }
  }
  confirmtodelete() {
    const idlot = this.detailtt.map((i: any) => {
      return i.id
    })
    const userid =  parseInt(this.data.id!, 10);
    if (this.totalbai == 0) {
      Swal.fire('กรุณาเลือกล็อตเตอรี่ที่ต้องการซื้อ', '', 'error')
    } else {
      Swal.fire({
        title: 'ต้องการเอาล็อตเตอรี่ออกจากกระเป๋า?',
        icon: 'info',
        showDenyButton: true,
        confirmButtonText: 'ยืนยัน',
        denyButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          for (const id of idlot) {
            for (let i = 0; i < this.ownlot.length; i++) {
              if (this.ownlot[i].id === id) {
                this.ownlot.splice(i, 1);
                break; // หลังจากลบองค์ประกอบที่ต้องการแล้วให้ออกจากลูป
              }
            }
            console.log(id)
            this.http.delete(`http://localhost/webapi1/loterry/deleteLotIncart/`+id).subscribe((respones)=>{
              Swal.fire('ลบสำเร็จ','','success').then(()=>{
                console.log('รร');
                this.totalprice = 0
                this.totalbai = 0
              })
            });
          }

        }
      })
    }
  }

  showlottobuy() {
    // console.log(this.data.id)
    this.http.get("http://localhost/webapi1/loterry/gettobuy/" + parseInt(this.data.id, 10)).subscribe(data => {
      this.ownlot = data;
      console.log(this.ownlot);
    })
  }
}
