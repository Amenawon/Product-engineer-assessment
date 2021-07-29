import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Constants } from "./core/model/Constants";
import { Customer } from "./core/model/Customer";
import { CustomerService } from "./core/service/customer.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  customers: Customer[];
  sortedCustomers: Customer[];
  invitedCustomers: Customer[];
  earthMeanRadiusKm = 6371;
  cityLatitude = 53.339428;
  cityLongitude = -6.257664;
  customerSub: Subscription;
  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.processCustomerData();
  }
   processCustomerData() {
    try {
      this.getCustomers();
    } catch (error) {
      console.log(error, "unable to load customer records");
      throw "unable to load customer records";
    }
  }

  getCustomers() {
    this.customerSub = this.customerService.readCustomersFromFile().subscribe(
      (response) => {
        this.customers = response;
        this.sortedCustomers = this.sortCustomersByUserId(); //sort customers in Asc order
        this.invitedCustomers = this.inviteCustomersWithin100km(this.sortedCustomers);//get invited customers
        console.log(this.invitedCustomers);
      },
      (err: HttpErrorResponse) => {
        console.log(err, "http error response");
        throw "Error occured";
      }
    );
  }

  sortCustomersByUserId(): Customer[] {
    if (this.customers.length > 1) {
      return this.customers.sort((a: Customer, b: Customer) => {
        if (a.user_id < b.user_id) return -1;
        if (a.user_id > b.user_id) return 1;
        return 0;
      });
    }
    return this.customers;
  }

  inviteCustomersWithin100km(customerList: Customer[]): Customer[] {
    let invitedCustomers: Customer[] = [];
    for (let customer of customerList) {
      if (
        // check if the customer has a valid latitude & longitude
        this.isLatLangValid(
          // convert to number
          parseInt(customer.latitude),
          parseInt(customer.longitude)
        )
      ) {
        // get the distance in kilometre
        let distanceInKM = this.getDistanceInKm(
          // convert to number
          parseFloat(customer.latitude),
          parseFloat(customer.longitude),
          this.cityLatitude,
          this.cityLongitude,
          this.earthMeanRadiusKm
        );
        console.log(distanceInKM);
        // check each customer against the maximum distance in km and push to an array
        if (distanceInKM <= Constants.DISTANCE_LIMIT_IN_KM) {
          invitedCustomers.push(customer);
        }
      }
    }
    return invitedCustomers; // return the list of invited customers
  }

  // I used this https://en.wikipedia.org/wiki/Great-circle_distance as reference to get distance in km
  getDistanceInKm(
    userLatitude: number,
    userLongitude: number,
    cityLatitude: number,
    cityLongitude: number,
    radius: number
  ): number {
    const userLatitudePhi = (userLatitude * Math.PI) / 180; //get the userlatPhi value by multiplying the user latitude by PI and divide by 180
    const userLongitudeLambda = (userLongitude * Math.PI) / 180; //get the userlongPhi value by multiplying the city longitude by PI and divide by 180
    const cityLatitudePhi = (cityLatitude * Math.PI) / 180; //multiply the city latitude by PI and divide by 180
    const cityLongitudeLambda = (cityLongitude * Math.PI) / 180; //multiply the city longitude by PI and divide by 180

    //get the delta value by checking if the user longitude is greater than city longitude
    const deltaLambda = Math.abs(
      userLongitudeLambda > cityLongitudeLambda ? userLongitudeLambda - cityLongitudeLambda : cityLongitudeLambda - userLongitudeLambda
    );

    const angleRad = Math.atan2(
      Math.sqrt(
        Math.pow(Math.cos(cityLatitudePhi) * Math.sin(deltaLambda), 2) +
          Math.pow(
            Math.cos(userLatitudePhi) * Math.sin(cityLatitudePhi) -
              Math.sin(userLatitudePhi) * Math.cos(cityLatitudePhi) * Math.cos(deltaLambda),
            2
          )
      ),

      Math.sin(userLatitudePhi) * Math.sin(cityLatitudePhi) +
        Math.cos(userLatitudePhi) * Math.cos(cityLatitudePhi) * Math.cos(deltaLambda)
    );

    return angleRad * radius;
  }

  isLatLangValid(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90
      ? true
      : longitude >= -180 && longitude <= 180
      ? true
      : false;
  }

  ngOnDestroy(): void {
    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }
  }
}
