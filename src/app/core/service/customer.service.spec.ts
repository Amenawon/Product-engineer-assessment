import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { CustomerService } from "./customer.service";
import { HttpClient } from "@angular/common/http";

describe("CustomerService", () => {
  let service: CustomerService;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({});2
    service = new CustomerService(http);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });


});
