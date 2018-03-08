import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

import { Customer } from './customer';

function emailMatcher(c: AbstractControl) {
    let emailControl = c.get('email');
    let confirmControl = c.get('confirmEmail'); 
    if ((emailControl.value === confirmControl.value) || 
        (emailControl.pristine || confirmControl.pristine)) {
        return null;
    }
    return { 'match': true };
}

function ratingRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        }
        return null;
    };
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    
    customerForm: FormGroup;
    customer: Customer= new Customer();
    emailMessage: string;
    confirmEmailMessage: string;

    private validationMessages = {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
    };

    private confirmValidation = {
        required: 'Please enter a matching email address.',
        pattern: 'Please enter a valid email address.'
    };

    constructor(private fb: FormBuilder) {
    }

    ngOnInit():void {

        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],            
            sendCatalog: false,
            phone: '',
            notification: 'email',
            rating: ['', ratingRange(1,5)],            
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
                confirmEmail: ['', Validators.required],
            }, {validator: emailMatcher})
        }); 

        this.customerForm.get('notification').valueChanges.subscribe(value => this.setNotification(value));

        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(3000).subscribe(value => this.setMessage(emailControl));

        const confirmEmailControl = this.customerForm.get('emailGroup.confirmEmail');
        confirmEmailControl.valueChanges.debounceTime(3000).subscribe(value => this.setMessage(confirmEmailControl));
    }

    setConfirmMessage(c: AbstractControl): void {
        this.confirmEmailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.confirmEmailMessage = Object.keys(c.errors).map(key => 
                this.validationMessages[key]).join(' ');
        }
    }

    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(key => 
                this.validationMessages[key]).join(' ');
        }
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
 }
