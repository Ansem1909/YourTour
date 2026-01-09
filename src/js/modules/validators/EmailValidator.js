export class EmailValidator {
  static validateEmail(field) {
    if (field.value.trim() === '') {
      return { isValid: true, message: '' };
    }

    if (!field.checkValidity()) {
      return {
        isValid: false,
        message: 'Введите корректный email, например an@mail.ru'
      };
    }

    return { isValid: true, message: '' };
  }
}