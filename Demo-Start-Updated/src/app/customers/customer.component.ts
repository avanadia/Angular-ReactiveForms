import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Customer } from './customer';

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    
    customerForm: FormGroup;
    customer: Customer= new Customer();

    constructor(private fb: FormBuilder) {
    }

    save() {
        console.log(this.customerForm);
        console.log('saved: ' + JSON.stringify(this.customerForm.value));        
    }

    populateTestData(): void {
        // use patch the change some, set to change all
        this.customerForm.patchValue({
            firstName: 'Jack',
            lastName: 'Harkness',
            
            sendCatalog: false
        });
    }

    setNotification(notifyVia: string): void {
        const phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }

    ngOnInit():void {

        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
            sendCatalog: false,
            phone: '',
            notification: 'email'
        }); 
    }
 }
