export class PhoneValidator {
  static formatPhoneInput(value) {
    let input = value.replace(/\D/g, '');
    input = input.substring(0, 11);

    let formattedValue = '+7 ';
    if (input.length > 1) {
      formattedValue += '(' + input.substring(1, 4);
    }
    if (input.length >= 5) {
      formattedValue += ') ' + input.substring(4, 7);
    }
    if (input.length >= 8) {
      formattedValue += '-' + input.substring(7, 9);
    }
    if (input.length >= 10) {
      formattedValue += '-' + input.substring(9, 11);
    }

    return formattedValue;
  }
}