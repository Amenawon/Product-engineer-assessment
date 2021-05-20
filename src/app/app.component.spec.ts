import { HttpClientModule } from "@angular/common/http";
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AppComponent } from "./app.component";
import { CustomerService } from "./core/service/customer.service";

let customerMockData = [
  {
    latitude: "53.1302756",
    user_id: 5,
    name: "Nora Dempsey",
    longitude: "-6.2397222",
  },
  {
    latitude: "53.2451022",
    user_id: 4,
    name: "Ian Kehoe",
    longitude: "-6.238335",
  }
];
let sortedCustomerMockData = [
  {
    latitude: "53.2451022",
    user_id: 4,
    name: "Ian Kehoe",
    longitude: "-6.238335",
  },
  {
    latitude: "53.1302756",
    user_id: 5,
    name: "Nora Dempsey",
    longitude: "-6.2397222",
  },
];
class CustomerServiceStub {
  readCustomersFromFile() {
    return of(customerMockData);
  }
}

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let customerMockService: CustomerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [{ provide: CustomerService, useClass: CustomerServiceStub }],
      declarations: [AppComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    customerMockService = TestBed.get(CustomerService);
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should call customer service readCustomersFromFile ", () => {
    spyOn(customerMockService, "readCustomersFromFile").and.callThrough();
    component.getCustomers();
    fixture.detectChanges();
    expect(customerMockService.readCustomersFromFile).toHaveBeenCalled();
    expect(component.customers).toEqual(customerMockData);
  });
  it("should  expect customers to be sorted by user id ", () => {
    spyOn(customerMockService, "readCustomersFromFile").and.callThrough();
    component.getCustomers();
    fixture.detectChanges();
    expect(customerMockService.readCustomersFromFile).toHaveBeenCalled();
    expect(component.sortedCustomers).toEqual(sortedCustomerMockData);
  });

  it("should validate sorted customers isnt null", () => {
    spyOn(customerMockService, "readCustomersFromFile").and.callThrough();
    component.getCustomers();
    fixture.detectChanges();
    expect(customerMockService.readCustomersFromFile).toHaveBeenCalled();
    expect(component.sortedCustomers).not.toEqual(null);
  });

  it("should sort customers by id using sortcustomer() if the list has duplicate userId", () => {
    component.customers = [{
      latitude: "53.1302756",
      user_id: 5,
      name: "Nora Dempsey",
      longitude: "-6.2397222",
    },
    {
      latitude: "53.2451022",
      user_id: 5,
      name: "Ian Kehoe",
      longitude: "-6.238335",
    }];
    let sortedData = component.sortCustomersByUserId();
    expect(sortedData).toEqual(component.customers)
  });

  it("should sort customers by id with the sortcustomer() if ", () => {
    component.customers = customerMockData;
    let sortedData = component.sortCustomersByUserId();
    expect(sortedData).toEqual(sortedCustomerMockData)
  });

  it("#sortcustomer should return if the customer list is empty", () => {
    component.customers = [];
    let sortedData = component.sortCustomersByUserId();
    expect(sortedData).toEqual(component.customers);
  });

  it("#sortcustomer should return the same customer list if the list contains only one record", () => {
    component.customers = [
      {
        latitude: "53.1302756",
        user_id: 5,
        name: "Nora Dempsey",
        longitude: "-6.2397222",
      }
    ];
    let sortedData = component.sortCustomersByUserId();
    expect(sortedData).toEqual(component.customers);
  });
  
  it("#check if its a valid longitude", () => {
    component.customers = [
      {
        latitude: "53.1302756",
        user_id: 5,
        name: "Nora Dempsey",
        longitude: "-6.2397222",
      },
      {
        latitude: "53.1302756",
        user_id: 6,
        name: "Nora Dempsey",
        longitude: "-206.2397222",
      },
    ];

    let expectedResult = [
      {
        latitude: "53.1302756",
        user_id: 5,
        name: "Nora Dempsey",
        longitude: "-6.2397222",
      }]
    let data = component.inviteCustomersWithin100km(component.customers);
    expect(data).toEqual(expectedResult);
  });
  
  it("#check if its a valid latitude", () => {
    component.customers = [
      {
        latitude: "153.1302756",
        user_id: 5,
        name: "Elenor Dempsey",
        longitude: "-6.2397222",
      },
      {
        latitude: "53.1302756",
        user_id: 6,
        name: "Nora Dempsey",
        longitude: "-6.2397222",
      }
    ];

    let expectedResult = [
      {
        latitude: "53.1302756",
        user_id: 6,
        name: "Nora Dempsey",
        longitude: "-6.2397222",
      }]
    let data = component.inviteCustomersWithin100km(component.customers);
    expect(data).toEqual(expectedResult);
  });
  
  it("#return false if both latitude and longitude are invalid", () => {
    component.customers = [
      {
        latitude: "153.1302756",
        user_id: 5,
        name: "Elenor Dempsey",
        longitude: "-406.2397222",
      },
      {
        latitude: "153.1302756",
        user_id: 6,
        name: "Nora Dempsey",
        longitude: "-196.2397222",
      }
    ];

    let expectedResult = []
    let data = component.inviteCustomersWithin100km(component.customers);
    expect(data).toEqual(expectedResult);
  });

  
  it("#get distance in km of both latitude and longitude", () => {
    const earthMeanRadiusKm = 6371;
    const cityLatitude = 53.339428;
    const cityLongitude = -6.257664;
     let distance = component.getDistanceInKm(51.92893,-10.27699,cityLatitude,cityLongitude,earthMeanRadiusKm)
    expect(distance).toEqual(313.2556337814158);
  });
});
