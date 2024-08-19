import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.scss']
})
export class AdminDashComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  lotteries: any

  constructor(private http: HttpClient) {
    this.all()
  }
  newlot() {
    Swal.fire({
      title: 'เพิ่มสลาก',
      html: ` <label  for="number">เลขสลาก</label><input type="text" id="number" class="swal2-input" placeholder="เลขสลาก">
      <label  for="pv">งวดที่</label><input  type="text" id="pv" class="swal2-input" placeholder="งวดที่"><br>
      <label  for="set">ชุดที่</label><input type="text" id="set" class="swal2-input" placeholder="ชุดที่"><br>
      <label  for="price">ราคา</label><input type="text" id="price" class="swal2-input" placeholder="ราคา">`,
      showCancelButton: true,
      confirmButtonText: 'เพิ่ม',
      denyButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.add()) {
          Swal.fire('เพิ่มเรียบร้อย', '', 'success').then(res => {this.all()})
        }
      }
    })
  }
  delete(id:any) {
    Swal.fire({
      title: 'wanna ลบ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      denyButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete('http://localhost/webapi1/loterry/delete/'+id).subscribe((data) =>{
          console.log(data)
          Swal.fire('ลบเรียบร้อย', '', 'success')
          this.all()
        })
      }
    });
  }
  edit(number: any, pv: any, set: any, price: any, id: any) {
    Swal.fire({
      title: 'แก้ไขสลาก',
      html: `<label  for="number">เลขสลาก</label><input value="${number}" type="number" id="number" class="swal2-input" placeholder="เลขสลาก">
      <label  for="number">เลขสลาก</label><input type="number"  value="${pv}" id="pv" class="swal2-input" placeholder="งวดที่"><br>
      <label  for="number">เลขสลาก</label><input type="number"  value="${set}" id="set" class="swal2-input" placeholder="ชุดที่"><br>
      <label  for="number">เลขสลาก</label><input type="number"  value="${price}" id="price" class="swal2-input" placeholder="ราคา">`,
      showCancelButton: true,
      confirmButtonText: 'แก้ไข',
      denyButtonText: 'ยกเลิก',
    }).then((result) => {

      const numbern = (document.getElementById('number') as HTMLInputElement).value || '';
      const pvn = (document.getElementById('pv') as HTMLInputElement).value || ''
      const setn = (document.getElementById('set') as HTMLInputElement).value || ''
      const pricen = (document.getElementById('price') as HTMLInputElement).value || 0
      if (numbern == '' || pvn == '' || setn == '' || pricen == 0) {
        Swal.fire('โปรดใส่ข้อมูล', '', 'info')
      } else {
        const data = {
          number : numbern.toString(),
          id : id,
          price_lot : pricen,
          period_lot : pvn.toString(),
          set_lot : setn.toString()
        }
        const datajson = JSON.stringify(data);
        console.log(datajson);
        if (result.isConfirmed) {
          this.http.post('http://localhost/webapi1/loterry/editlot',datajson,{observe :'response'}).subscribe((respones =>{
            console.log(respones.body)
            this.all()
            return true
           }),(err) => {
             console.log(err)
             window.location.reload()
             return false
           });    
        }
      }

    })
  }
  konha() {
    const input1 = (document.getElementById('ip1') as HTMLInputElement).value || '___';
    const input2 = (document.getElementById('ip2') as HTMLInputElement).value || '__';
    const input3 = (document.getElementById('ip3') as HTMLInputElement).value || '__';

    this.http.get("http://localhost/webapi1/loterry/" + input1 + '/' + input2 + '/' + input3).subscribe(data => {
      this.lotteries = data;
      console.log(this.lotteries);
    })
  }
  all() {
    this.http.get("http://localhost/webapi1/loterry/all").subscribe(data => {
      this.lotteries = data;
      console.log(this.lotteries)
    })
  }
  add(): boolean {
    const number = (document.getElementById('number') as HTMLInputElement).value || ''
    const pv = (document.getElementById('pv') as HTMLInputElement).value || ''
    const set = (document.getElementById('set') as HTMLInputElement).value || ''
    const price = (document.getElementById('price') as HTMLInputElement).value  || 0   

    if(number == '' || pv == '' || set == '' || price == 0){
      Swal.fire('โปรดใส่ข้อมูล', '', 'info')
      return false
    }else{
      const data = {
        price: price,
        number: number,
        period_lot: pv,
        set_lot: set
      }
      const datajson = JSON.stringify(data);
      console.log(number)
      this.http.post('http://localhost/webapi1/loterry/addlot', datajson, { observe: 'response' }).subscribe((respones => {
        console.log(respones.body)
        return true
      }), (err) => {
        console.log(err)
        return false
      });
    }
    return true
  }

 
}
