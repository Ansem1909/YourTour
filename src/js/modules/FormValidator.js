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
    this.setupDateInputs();
    this.bindEvents();
  }

  setupDateInputs() {
    [this.elements.dateFromElement, this.elements.dateToElement].forEach(element => {
      if (element) {
        element.addEventListener('focus', this.onDateFocus);
        element.addEventListener('blur', this.onDateBlur);
      }
    });
  }

  bindEvents() {
    if (this.elements.phoneElement) {
      this.elements.phoneElement.addEventListener('input', this.onPhoneInput);
    }
    if (this.elements.emailElement) {
      this.elements.emailElement.addEventListener('blur', this.onEmailBlur);
    }
    this.form.addEventListener('submit', this.onSubmit);
    this.form.addEventListener('reset', this.onReset);
  }

  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }

  parseDate(dateString) {
    if (!dateString) return null;

    if (dateString.match(/^\d{1,2}\.\d{1,2}\.\d{4}$/)) {
      const [day, month, year] = dateString.split('.');
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  }

  onDateFocus = (e) => {
    const field = e.target;
    const currentValue = field.value;

    if (currentValue) {
      const parsedDate = this.parseDate(currentValue);
      if (parsedDate) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        field.value = `${year}-${month}-${day}`;
      }
    }

    field.type = 'date';
    field.min = new Date().toISOString().split('T')[0];
  }

  onDateBlur = (e) => {
    const field = e.target;

    field.type = 'text';

    if (!field.value) {
      return;
    }

    const date = new Date(field.value);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      field.value = `${day}.${month}.${year}`;
    }

    const selectedDate = this.parseDate(field.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate && selectedDate < today) {
      field.setCustomValidity('Нельзя выбрать прошедшую дату');
      field.reportValidity();
    } else {
      field.setCustomValidity('');
    }
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

  onEmailBlur = (e) => {
    const field = e.target;

    if (field.value.trim() !== '') {
      field.reportValidity();
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.elements.agreementElement.checked) {
      this.elements.agreementElement.setCustomValidity('Необходимо принять условия соглашения');
      this.elements.agreementElement.reportValidity();
      return;
    } else {
      this.elements.agreementElement.setCustomValidity('');
    }

    if (!this.form.checkValidity()) {
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
      this.setupDateInputs();
      this.form.querySelectorAll('input, select').forEach(field => {
        field.setCustomValidity('');
      });
    }, 0);
  }
}

export default FormValidator;