import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-mn-buy',
  templateUrl: './mn-buy.component.html',
  styleUrls: ['./mn-buy.component.scss']
})
export class MnBuyComponent {
  daybuylot: any
  dayMonthlot: any
  totalbai:any;
  totalpricemonth:number = 0
  totalpriceday:number = 0
  totalbaimonth:number = 0
  totalbaiday:number = 0
  todaytae = "2023-10-09"

  constructor(private http: HttpClient) {
    this.getbuyday()
    this.http.get(`http://localhost/webapi1/loterry/konhaAllmo/1/10/2023`).subscribe(data => {
      this.dayMonthlot = data
      console.log(this.dayMonthlot)
    })
    
  }

  getbuyday() {
    this.http.get('http://localhost/webapi1/loterry/getnowday').subscribe(data => {
      this.daybuylot = data
      console.log(data)
    })


  }
  konha() {
    this.totalpriceday = 0
    const date = (document.getElementById('date') as HTMLInputElement).value;
    const parts = date.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    console.log(date)
    this.http.get(`http://localhost/webapi1/loterry/konhaAll/${day}/${month}/${year}`).subscribe(data => {
      this.daybuylot = data
      this.daybuylot.forEach((element:any) => {
        this.totalpriceday += element.price_lot
        this.totalbaiday +=1
      });
      console.log(this.totalpriceday);
    })
  }
  konhabyMonth(){
    this.totalpricemonth = 0
    const Month = (document.getElementById('Month') as HTMLInputElement).value;
    const Year = (document.getElementById('Year') as HTMLInputElement).value;
    console.log(Month+' '+Year);
    this.http.get(`http://localhost/webapi1/loterry/konhaAllmo/1/${Month}/${Year}`).subscribe(data => {
      this.dayMonthlot = data
      this.dayMonthlot.forEach((element:any) => {
        this.totalpricemonth += element.price_lot
        this.totalbaimonth +=1
      });
    })
  }
}
