import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Customer } from "./core/model/Customer";
import { CustomerService } from "./core/service/customer.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Intercom-Interview-Assessment";
  customers: Customer[];
  sortedCustomers: Customer[];

  constructor(private customerService: CustomerService) {}
  ngOnInit(): void {
    this.processCustomerData();
  }
  processCustomerData() {
    try {
    this.getCustomers();
    } catch (error) {
     return console.log(error,'unable to load customer records'); 
    }
  }

  getCustomers() {
    this.customerService.readCustomersFromFile().subscribe(
      (response) => {
        this.customers = response;
        this.sortedCustomers = this.sortCustomersByUserId();
        console.log(this.sortedCustomers)

      },
      (err: HttpErrorResponse) => {
        console.log(err, "http error response");
      }
    );
  }

  
  sortCustomersByUserId(): Customer[] {
    return this.customers.sort(
      (a: Customer, b: Customer) => {
        if (a.user_id < b.user_id) return -1;
        if (a.user_id > b.user_id) return 1;
        return 0;
      }
    );
  }
}
