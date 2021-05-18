import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  getCustomers(){
   return this.http.get('../../../assets/customers.txt').subscribe(data => {
      console.log(data);
  });
  
  }
}
