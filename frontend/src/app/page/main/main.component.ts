import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { DataService } from 'src/app/sevice/data.service';
import { Convert as countryCvt, Country } from 'src/app/model/country.model';
import { Convert as landmarkCvt, Landmark } from 'src/app/model/landmark.model';
import { Convert as userConvert,User  } from 'src/app/model/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements AfterViewInit {
  input1: number = NaN;
  input2: number = NaN;
  input3: number = NaN;
  input4: number = NaN;
  input5: number = NaN;
  input6: number = NaN;
  input7: number = NaN;
  data;

  

  currentDate: Date = new Date();
  currentDayMessage: string = '';

  @ViewChildren('inputElements') inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  ngAfterViewInit() {
    this.inputElements.forEach((inputElement: ElementRef<HTMLInputElement>, index: number, elements: ElementRef<HTMLInputElement>[]) => {
      const element = inputElement.nativeElement;
  
      element.addEventListener('input', (event) => {
        if (element.value.length > 0) {
          if (index < elements.length - 1) {
            elements[index + 1].nativeElement.focus();
          }
          element.value = element.value.slice(0, 1);
        }
      });
  
      element.style.fontSize = element.clientHeight + 'px';
      element.style.textAlign = 'center';
    });
  }
  lotteries: any;
  constructor(private daraService: DataService, private http: HttpClient) {
    
    this.random();
    this.getday();
    if(localStorage.getItem('userdata')){
      this.data = userConvert.toUser(localStorage.getItem('userdata')!);
    } 
  }
  logout(){
    Swal.fire('ออกจากระบบสำเร็จ','','success').then((res) => {
      localStorage.removeItem('userdata')
      window.location.reload();
    })
  }

  getday() {
    const dayOfMonth = this.currentDate.getDate();
    const year = this.currentDate.getFullYear();
    // เรียกใช้ฟังก์ชันเพื่อดึงชื่อเดือน
    console.log(dayOfMonth);

    if ((dayOfMonth >= 2 && dayOfMonth <= 15) || dayOfMonth == 16) {
      const month = this.getMonthName(this.currentDate.getMonth());
      this.currentDayMessage = ` 16 ${month} ${year}`;
    } else if ((dayOfMonth >= 17 && dayOfMonth <= 30) || dayOfMonth == 1) {
      const month = this.getMonthName((this.currentDate.getMonth() + 1));
      this.currentDayMessage = `1 ${month} ${year}`;
    }

  }
  getMonthName(monthIndex: number): string {
    const monthNames = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ];

    return monthNames[monthIndex];
  }


  konha() {

    // ดึงค่าจาก input elements
    const input1 = (document.getElementById('myInput1') as HTMLInputElement).value || '_';
    const input2 = (document.getElementById('myInput2') as HTMLInputElement).value || '_';
    const input3 = (document.getElementById('myInput3') as HTMLInputElement).value || '_';

    const input4 = (document.getElementById('myInput4') as HTMLInputElement).value || '_';
    const input5 = (document.getElementById('myInput5') as HTMLInputElement).value || '_';
    const input6 = (document.getElementById('myInput6') as HTMLInputElement).value || '_';
    const input7 = (document.getElementById('myInput7') as HTMLInputElement).value || '_';

    const set = input4+input5;
    const period = input6+input7;

    if (input1 == '_' && input2 == '_' && input3 == '_' && input4 == '_' && input5 == '_' && input6 == '_' && input7 == '_') {
      Swal.fire('กรุณาใส่ข้อมูล', '','warning');
    } else {
      let legkonha = input1 + input2 + input3
      console.log(legkonha);

      this.http.get("http://localhost/webapi1/loterry/" + legkonha +'/'+ set+'/'+period).subscribe(data => {
        this.lotteries = data;
        console.log(this.lotteries);
      })
    }
  }


  random() {
    this.http.get("http://localhost/webapi1/loterry").subscribe(data => {
      this.input1 = NaN;
      this.input2 = NaN;
      this.input3 = NaN;
      this.input4 = NaN;
      this.input5 = NaN;
      this.input6 = NaN;
      this.input7 = NaN;

      this.lotteries = data;
      console.log(this.lotteries);


    })
  }

  selectlot(lotid:number) {
    let idsuser = this.data?.id
    let jsonObj = {
      userid : parseInt(idsuser!, 10),
      lot_id : lotid
    }
    console.log(jsonObj)
    let jsonString = JSON.stringify(jsonObj);
    this.http.post('http://localhost/webapi1/loterry/addtocart' ,jsonString,{observe :'response'}).subscribe((respones =>{
      // console.log(respones.body);
      Swal.fire('เลือกสำเร็จ', 'เราได้เพิ่มเข้าไปในกระเป๋าล็อตเตอรี่ของคุณเรียบร้อย', 'success');
      // this.random();
    }),(err) => {
      console.log(err)
      Swal.fire('ไม่สามารถเลือกซ้ำได้', '', 'info');
    })
  }

}
