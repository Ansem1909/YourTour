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
    this.rootElement = rootElement;
    this.phoneElement = this.rootElement.querySelector(this.selectors.phone);
    this.emailElement = this.rootElement.querySelector(this.selectors.email);
    this.dateErrorElements = this.rootElement.querySelectorAll(this.selectors.dateError);
    this.dateElements = this.rootElement.querySelectorAll(this.selectors.dateInput);

    if (!this.phoneElement || !this.emailElement) return;

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

    if (this.rootElement.checkValidity() && areDatesValid) {
      console.log('Форма отправлена!', this.getFormData());
      // this.rootElement.submit();
    }
  }

  // Сброс формы
  onReset = () => {
    this.clearAllErrors();
    this.setMinDates();
  }

  // Валидация всех дат при отправке
  validateDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isValid = true;

    this.dateElements.forEach((dateElement, index) => {
      if (dateElement.value && new Date(dateElement.value) < today) {
        const errorElement = this.dateErrorElements[index];
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

  getFormData() {
    return {
      firstName: this.rootElement.querySelector('#firstName').value,
      direction: this.rootElement.querySelector('#direction').value,
      email: this.emailElement.value,
      phone: this.phoneElement.value,
      dateFrom: this.rootElement.querySelector('#date-from').value,
      dateTo: this.rootElement.querySelector('#date-to').value,
      message: this.rootElement.querySelector('#message').value,
      isAdult: this.rootElement.querySelector('input[name="isAdult"]:checked')?.value
    };
  }

  bindEvents() {
    this.phoneElement.addEventListener('input', this.onPhoneInput);
    this.emailElement.addEventListener('input', this.onEmailInput);
    this.dateElements.forEach(dateElement => {
      dateElement.addEventListener('change', this.onDateChange);
    });
    this.rootElement.addEventListener('submit', this.onSubmit);
    this.rootElement.addEventListener('reset', this.onReset);
  }
}

export default FormValidator;