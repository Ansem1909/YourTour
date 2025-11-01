const rootSelector = '[data-js-form]';

class FormValidator {
  selectors = {
    root: rootSelector,
    phone: '[data-js-form-phone]',
    email: '[data-js-form-email]',
    dateFrom: '[data-js-date-from]',
    dateTo: '[data-js-date-to]',
    agreement: '[data-js-form-agreement]',
  }

  constructor(rootElement) {
    this.form = rootElement || document.querySelector(this.selectors.root);

    if (!this.form) {
      console.warn('Form элемент не найден');
      return;
    }

    this.elements = {
      phoneElement: this.form.querySelector(this.selectors.phone),
      emailElement: this.form.querySelector(this.selectors.email),
      dateFromElement: this.form.querySelector(this.selectors.dateFrom),
      dateToElement: this.form.querySelector(this.selectors.dateTo),
      agreementElement: this.form.querySelector(this.selectors.agreement),
    }

    this.init();
  }

  init() {
    this.setMinDates();
    this.bindEvents();
  }

  setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    this.elements.dateToElement.min = today;
    this.elements.dateToElement.min = today;
  }

  bindEvents() {
    if (this.elements.phoneElement) {
      this.elements.phoneElement.addEventListener('input', this.onPhoneInput);
    }
    if (this.elements.emailElement) {
      this.elements.emailElement.addEventListener('input', this.onEmailInput);
    }
    if (this.elements.dateFromElement) {
      this.elements.dateFromElement.addEventListener('change', this.onDateChange);
    }
    if (this.elements.dateToElement) {
      this.elements.dateToElement.addEventListener('change', this.onDateChange);
    }
    this.form.addEventListener('submit', this.onSubmit);
    this.form.addEventListener('reset', this.onReset);
  }

  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }

  onPhoneInput = (e) => {
    let input = e.target.value.replace(/\D/g, '');
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

    e.target.value = formattedValue;
  }

  onEmailInput = (e) => {
    const email = e.target.value.trim();
    if (email && !e.target.validity.valid) {
      e.target.setCustomValidity('Пожалуйста, введите корректный email адрес (например, example@mail.com)');
    } else {
      e.target.setCustomValidity('');
    }
  }

  validateDate(field) {
    if (!field.value) {
      return '';
    }

    const selectedDate = new Date(field.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return 'Пожалуйста, введите корректную дату';
    }

    if (selectedDate < today) {
      return 'Нельзя выбрать прошедшую дату';
    }

    if (field.id === 'date-to' && this.elements.dateFromElement.value) {
      const dateFromValue = this.elements.dateFromElement.value;
      if (dateFromValue) {
        const dateFrom = new Date(dateFromValue);
        if (!isNaN(dateFrom.getTime()) && selectedDate < dateFrom) {
          return '"Дата до" не может быть раньше "Даты от"';
        }
      }
    }

    return '';
  }

  onDateChange = (e) => {
    const field = e.target;

    field.setCustomValidity('');

    const error = this.validateDate(field);
    if (error) {
      field.setCustomValidity(error);
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    [this.elements.dateFromElement, this.elements.dateToElement].forEach(field => {
      field.setCustomValidity('');
      const error = this.validateDate(field);
      if (error) {
        field.setCustomValidity(error);
      }
    });

    if (!this.elements.agreementElement.checked) {
      this.elements.agreementElement.setCustomValidity('Необходимо принять условия соглашения');
      isValid = false;
    } else {
      this.elements.agreementElement.setCustomValidity('');
    }

    if (!this.form.checkValidity() || !isValid) {
      const invalidField = this.form.querySelector(':invalid');
      if (invalidField) {
        invalidField.focus();
        invalidField.reportValidity();
      }
      return;
    }

    console.log('Форма отправлена!', this.getFormData());
  }

  onReset = () => {
    setTimeout(() => {
      this.setMinDates();
      this.form.querySelectorAll('input, select').forEach(field => {
        field.setCustomValidity('');
      });
    }, 0);
  }
}

export default FormValidator;