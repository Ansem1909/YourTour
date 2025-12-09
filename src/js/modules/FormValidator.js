const rootSelector = '[data-js-form]';

class FormValidator {
  selectors = {
    root: rootSelector,
    phone: '[data-js-form-phone]',
    email: '[data-js-form-email]',
    dateFrom: '[data-js-date-from]',
    dateTo: '[data-js-date-to]',
    direction: '[data-js-form-direction]',
    required: '[required]',
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
      directionElement: this.form.querySelector(this.selectors.direction),
      requiredElements: this.form.querySelectorAll(this.selectors.required),
    }

    this.form.addEventListener('invalid', this.onInvalidField, true);

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.elements.requiredElements.forEach(field => {
      field.addEventListener('invalid', (e) => e.preventDefault());
      field.addEventListener('blur', this.validateRequiredField);
      field.addEventListener('change', this.validateRequiredField);
    });
    [this.elements.dateFromElement, this.elements.dateToElement].forEach(element => {
      if (element) {
        element.addEventListener('invalid', (e) => e.preventDefault());
        element.addEventListener('focus', this.onDateFocus);
        element.addEventListener('blur', this.onDateBlur);
      }
    });
    if (this.elements.phoneElement) {
      this.elements.phoneElement.addEventListener('invalid', (e) => e.preventDefault());
      this.elements.phoneElement.addEventListener('input', this.onPhoneInput);
    }
    if (this.elements.emailElement) {
      this.elements.emailElement.addEventListener('invalid', (e) => e.preventDefault());
      this.elements.emailElement.addEventListener('blur', this.onEmailBlur);
    }
    if (this.elements.directionElement) {
      this.elements.directionElement.addEventListener('invalid', (e) => e.preventDefault());
      this.onDirectionChange({ target: this.elements.directionElement });
      this.elements.directionElement.addEventListener('change', this.onDirectionChange);
    }
    this.form.addEventListener('submit', this.onSubmit);
    this.form.addEventListener('reset', this.onReset);
  }

  onInvalidField = (e) => {
    e.preventDefault();
  }

  showFieldError(field, message) {
    this.hideFieldError(field);

    field.setCustomValidity(message || '');

    field.classList.add('field__control--error');

    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `${field.id || field.name}-error`);

    const errorElement = document.createElement('div');
    errorElement.className = 'field__error';
    errorElement.textContent = message || field.validationMessage || 'Поле заполнено неверно';
    errorElement.id = `${field.id || field.name}-error`;
    errorElement.setAttribute('role', 'alert');

    const fieldContainer = field.closest('.field');
    if (fieldContainer) {
      fieldContainer.classList.add('field--has-error');
      fieldContainer.appendChild(errorElement);
    } else {
      const parent = field.parentElement;
      if (parent) {
        parent.appendChild(errorElement);
      }
    }

    const removeErrorOnInput = () => {
      if (field.value.trim() && field.checkValidity()) {
        this.hideFieldError(field);
        field.removeEventListener('input', removeErrorOnInput);
      }
    };

    field.addEventListener('input', removeErrorOnInput);
  }

  hideFieldError(field) {
    field.setCustomValidity('');
    field.classList.remove('field__control--error');

    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');

    const fieldContainer = field.closest('.field');
    if (fieldContainer) {
      fieldContainer.classList.remove('field--has-error');
    }

    const errorId = `${field.id || field.name}-error`;
    const errorElement = document.getElementById(errorId) ||
      field.parentElement.querySelector('.field__error');

    if (errorElement) {
      errorElement.remove();
    }
  }

  clearAllErrors() {
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      this.hideFieldError(field);
    });
  }

  validateRequiredField = (e) => {
    const field = e.target;

    if (e.type === 'blur' || e.type === 'change') {
      if (!field.value.trim()) {
        this.showFieldError(field, 'Это поле обязательно для заполнения');
      } else {
        this.hideFieldError(field);
      }
    }
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
      this.hideFieldError(field);
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
      this.showFieldError(field, 'Нельзя выбрать прошедшую дату');
    } else {
      this.hideFieldError(field);
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

    if (field.value.trim() === '') {
      return;
    }

    if (!field.checkValidity()) {
      this.showFieldError(field, 'Введите корректный email адрес, например ana@gmail.com');
    } else {
      this.hideFieldError(field);
    }
  }

  onDirectionChange = (e) => {
    const select = e.target;
    select.classList.toggle('is-placeholder', select.value === "");
  }

  onSubmit = (e) => {
    e.preventDefault();

    this.clearAllErrors();

    let isValid = true;
    const invalidFields = [];

    this.elements.requiredElements.forEach(field => {
      if (!field.value.trim()) {
        this.showFieldError(field, 'Это поле обязательно для заполнения');
        invalidFields.push(field);
        isValid = false;
      }
    });

    [this.elements.dateFromElement, this.elements.dateToElement].forEach(field => {
      if (field && field.value) {
        const selectedDate = this.parseDate(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate && selectedDate < today) {
          this.showFieldError(field, 'Нельзя выбрать прошедшую дату');
          invalidFields.push(field);
          isValid = false;
        }
      }
    });

    if (this.elements.emailElement && this.elements.emailElement.value.trim() !== '') {
      if (!this.elements.emailElement.checkValidity()) {
        this.showFieldError(this.elements.emailElement, 'Введите корректный email адрес, например ana@gmail.com');
        invalidFields.push(this.elements.emailElement);
        isValid = false;
      }
    }

    if (!isValid) {
      if (invalidFields[0]) {
        invalidFields[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        invalidFields[0].focus();
      }
      return;
    }

    console.log('Форма отправлена!', this.getFormData());
  }

  onReset = () => {
    setTimeout(() => {
      this.clearAllErrors();
      this.form.querySelectorAll('input, select, textarea').forEach(field => {
        field.classList.remove('field__control--error');
      });
    }, 0);
  }
}

export default FormValidator;