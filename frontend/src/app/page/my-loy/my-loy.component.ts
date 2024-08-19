import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Convert as detailConvert,Detail  } from 'src/app/model/detail.model';
import { Convert as userConvert, User } from 'src/app/model/user.model';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-my-loy',
  templateUrl: './my-loy.component.html',
  styleUrls: ['./my-loy.component.scss']
})
export class MyLoyComponent implements OnInit {
  data:Detail;
  datauser;
  id:any
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('p1');
      this.getdetail(this.id);
    });
  }
  constructor(private http: HttpClient ,private route:ActivatedRoute) {
    if ((localStorage.getItem('userdata'))) {
      this.datauser = userConvert.toUser(localStorage.getItem('userdata')!)
      console.log(this.datauser.fname)
    }
    this.data = {
      total:0,
      total_bai:0,
      date:'',
      price_lot: [0,0,0],
      number:[]
    };
    
  }

  getdetail(id:any) {
    this.http.get("http://localhost/webapi1/loterry/getdetail/"+id).subscribe((data) => {
      this.data = detailConvert.toDetail(JSON.stringify(this.redata(data)))
      console.log(data)
      console.log(this.data.price_lot)
    })
  }

  redata(data: any) {
    const data1 = data.map((i:any) =>{
      return i.price_lot;
    }) 
    const data2 = data.map((i:any) =>{
      return i.number;
    }) 

    const newData = {
      "total": data[0].total,
      "total_bai": data[0].total_bai,
      "date": data[0].date,
      "price_lot": data1,
      "number": data2
    };

    return newData
  }
}