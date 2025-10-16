const rootSelector = '[data-js-form]';

class FormValidator {
  selectors = {
    root: rootSelector,
    phone: '[data-js-form-phone]',
    email: '[data-js-form-email]',
    dateInput: '[data-js-form-date]',
    dateError: '[data-js-date-error]',
  }

  constructor(rootElement) {
    if (!rootElement) {
      console.warn('Form element not found for FormValidator');
      return;
    }

    this.rootElement = rootElement;
    this.phoneElement = this.rootElement.querySelector(this.selectors.phone);
    this.emailElement = this.rootElement.querySelector(this.selectors.email);
    this.dateErrorElements = this.rootElement.querySelectorAll(this.selectors.dateError);
    this.dateElements = this.rootElement.querySelectorAll(this.selectors.dateInput);

    this.setMinDates();
    this.bindEvents();
  }

  setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    this.dateElements.forEach(dateElement => {
      dateElement.min = today;
    });
  }

  onPhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('7')) {
      value = value.substring(1);
    }

    if (value.length > 0) {
      value = value.match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      e.target.value = '+7 (' + (value[1] ? value[1] : '') +
        (value[2] ? ') ' + value[2] : '') +
        (value[3] ? '-' + value[3] : '') +
        (value[4] ? '-' + value[4] : '');
    }
  }

  onEmailInput = (e) => {
    const email = e.target.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email && !emailRegex.test(email)) {
      e.target.setCustomValidity('Введите корректный email адрес');
    } else {
      e.target.setCustomValidity('');
    }

    e.target.reportValidity();
  }

  onDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fieldElement = e.target.closest('.field');
    const errorElement = fieldElement.querySelector(this.selectors.dateError);

    if (e.target.value && selectedDate < today) {
      e.target.value = '';
      this.showError(errorElement, 'Нельзя выбрать прошедшую дату');
    } else {
      this.hideError(errorElement);
    }
  }

  // Отправка формы
  onSubmit = (e) => {
    e.preventDefault();
    this.clearAllErrors();

    const areDatesValid = this.validateDates();

    const agreementCheckbox = this.rootElement.querySelector('input[name="agreement"]');
    if (!agreementCheckbox.checked) {
      agreementCheckbox.setCustomValidity('Необходимо принять условия соглашения');
      agreementCheckbox.reportValidity();
      return;
    } else {
      agreementCheckbox.setCustomValidity('');
    }

    if (this.rootElement.checkValidity() && areDatesValid) {
      console.log('Форма отправлена!', this.getFormData());
    } else {
      this.showBrowserValidation();
    }
  }

  // Сброс формы
  onReset = () => {
    this.clearAllErrors();
    this.setMinDates();

    if (this.emailElement) {
      this.emailElement.setCustomValidity('');
    }
    const agreementCheckbox = this.rootElement.querySelector('input[name="agreement"]');
    if (agreementCheckbox) {
      agreementCheckbox.setCustomValidity('');
    }
  }

  validateDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isValid = true;

    this.dateElements.forEach((dateElement) => {
      if (dateElement.value && new Date(dateElement.value) < today) {
        const fieldElement = dateElement.closest('.field');
        const errorElement = fieldElement.querySelector(this.selectors.dateError);
        this.showError(errorElement, 'Нельзя выбрать прошедшую дату');
        isValid = false;
      }
    });

    return isValid;
  }

  showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.style.display = 'block';
    element.closest('.field').classList.add('field--error');
  }

  hideError(element) {
    if (!element) return;
    element.textContent = '';
    element.style.display = 'none';
    element.closest('.field').classList.remove('field--error');
  }

  clearAllErrors() {
    this.dateErrorElements.forEach(errorElement => {
      this.hideError(errorElement);
    });
  }

  showBrowserValidation() {
    const invalidField = this.rootElement.querySelector(':invalid');
    if (invalidField) {
      invalidField.focus();
      invalidField.reportValidity();
    }
  }

  getFormData() {
    return {
      firstName: this.rootElement.querySelector('#firstName').value,
      direction: this.rootElement.querySelector('#direction').value,
      email: this.emailElement ? this.emailElement.value : '',
      phone: this.phoneElement ? this.phoneElement.value : '',
      dateFrom: this.rootElement.querySelector('#date-from').value,
      dateTo: this.rootElement.querySelector('#date-to').value,
      message: this.rootElement.querySelector('#message').value,
      isAdult: this.rootElement.querySelector('input[name="isAdult"]:checked')?.value,
      agreement: this.rootElement.querySelector('input[name="agreement"]').checked
    };
  }

  bindEvents() {
    if (this.phoneElement) {
      this.phoneElement.addEventListener('input', this.onPhoneInput);
    }
    if (this.emailElement) {
      this.emailElement.addEventListener('input', this.onEmailInput);
    }
    this.dateElements.forEach(dateElement => {
      dateElement.addEventListener('change', this.onDateChange);
    });
    this.rootElement.addEventListener('submit', this.onSubmit);
    this.rootElement.addEventListener('reset', this.onReset);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const formElement = document.querySelector(rootSelector);
  if (formElement) {
    new FormValidator(formElement);
  }
});

export default FormValidator;