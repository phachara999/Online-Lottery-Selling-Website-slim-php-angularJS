import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiEndpoint = 'http://localhost/webapi'; 
  countries : any;
  selectedLandmark : any;
  
  constructor() { 
    
    interface datauser {
    email: string,
    fname: string,
    lname: string,
    password: string
    bdate:string
    id : string,
    phone_num:string
}
}
}
