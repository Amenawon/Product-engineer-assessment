import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Constants } from "./core/model/Constants";
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
  invitedCustomers: Customer[];
  earthMeanRadiusKm = 6371;
  centerLatitude = 53.339428;
  centerLongitude = -6.257664;
  constructor(private customerService: CustomerService) {}
  ngOnInit(): void {
    this.processCustomerData();
  }
  processCustomerData() {
    try {
      this.getCustomers();
    } catch (error) {
      return console.log(error, "unable to load customer records");
    }
  }

  getCustomers() {
    this.customerService.readCustomersFromFile().subscribe(
      (response) => {
        this.customers = response;
        this.sortedCustomers = this.sortCustomersByUserId();
        this.invitedCustomers = this.inviteCustomersWithin100km(
          this.sortedCustomers
        );
        console.log(this.invitedCustomers);
      },
      (err: HttpErrorResponse) => {
        console.log(err, "http error response");
      }
    );
  }

  sortCustomersByUserId(): Customer[] {
    return this.customers.sort((a: Customer, b: Customer) => {
      if (a.user_id < b.user_id) return -1;
      if (a.user_id > b.user_id) return 1;
      return 0;
    });
  }

  inviteCustomersWithin100km(customerList: Customer[]): Customer[] {
    let invitedCustomers: Customer[] = [];
    for (let customer of customerList) {
      let distanceInKM = this.getDistanceInKm(
        parseFloat(customer.latitude),
        parseFloat(customer.longitude),
        this.centerLatitude,
        this.centerLongitude,
        this.earthMeanRadiusKm
      );
      if (distanceInKM <= Constants.DISTANCE_LIMIT_IN_KM) {
        invitedCustomers.push(customer);
      }
    }
    return invitedCustomers;
  }

  getDistanceInKm(
    userLatitude,
    userLongitude,
    cityLatitude,
    cityLongitude,
    radius
  ): number {
    const phi1 = (userLatitude * Math.PI) / 180;
    const lambda1 = (userLongitude * Math.PI) / 180;
    const phi2 = (cityLatitude * Math.PI) / 180;
    const lambda2 = (cityLongitude * Math.PI) / 180;

    const deltaLambda = Math.abs(
      lambda1 > lambda2 ? lambda1 - lambda2 : lambda2 - lambda1
    );

     const angleRad = Math.atan2(
      Math.sqrt(
        Math.pow(Math.cos(phi2) * Math.sin(deltaLambda), 2) +
          Math.pow(
            Math.cos(phi1) * Math.sin(phi2) -
              Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda),
            2
          )
      ),

      Math.sin(phi1) * Math.sin(phi2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)
    );

    return angleRad * radius;
  }
}
