import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../model/Constants';
import { Customer } from '../model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  readCustomersFromFile():Observable<Customer[]>{
   return this.http.get<Customer[]>('../../../assets/customers.txt');
  }

}
