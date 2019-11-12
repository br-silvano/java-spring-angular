import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html'
})
export class PhoneComponent {

  @Input('group') phoneForm: FormGroup;

  constructor() { }

  maskTelefone = (telefone: any) => {
    const numbers =  telefone.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength > 10) {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/ , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    } else {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
  }

}
