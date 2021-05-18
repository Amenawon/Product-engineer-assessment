import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustomerService } from "./service/customer.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [CommonModule, HttpClientModule],
    providers: [CustomerService],
   })
export class CoreModule{}