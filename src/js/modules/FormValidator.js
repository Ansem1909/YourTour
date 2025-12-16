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
    adult: '[data-js-form-adult] input[name="isAdult"]',
    agreement: '[data-js-form-agreement]',
    tabsSection: '[data-js-tabs-content]',
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
      adultElements: this.form.querySelectorAll(this.selectors.adult),
      agreementElement: this.form.querySelector(this.selectors.agreement),
      tabsSection: document.querySelector(this.selectors.tabsSection),
    }

    this.form.addEventListener('invalid', this.onInvalidField, true);

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.elements.requiredElements.forEach(field => {
      field.addEventListener('blur', this.validateRequiredField);
      field.addEventListener('change', this.validateRequiredField);
    });

    [this.elements.dateFromElement, this.elements.dateToElement].forEach(element => {
      if (element) {
        element.addEventListener('blur', this.onDateBlur);
        element.addEventListener('input', this.onDateInput);
        element.addEventListener('beforeinput', this.onDateBeforeInput);
        element.addEventListener('keydown', this.onDateKeydown);
      }
    });

    if (this.elements.phoneElement) {
      this.elements.phoneElement.addEventListener('input', this.onPhoneInput);
    }

    if (this.elements.emailElement) {
      this.elements.emailElement.addEventListener('blur', this.onEmailBlur);
    }

    if (this.elements.directionElement) {
      this.onDirectionChange({ target: this.elements.directionElement });
      this.elements.directionElement.addEventListener('change', this.onDirectionChange);
    }

    this.elements.adultElements?.forEach(radio => {
      radio.addEventListener('change', this.validateAdultField);
    });

    if (this.elements.agreementElement) {
      this.elements.agreementElement.addEventListener('change', this.validateAgreementField);
    }

    this.form.addEventListener('submit', this.onSubmit);
    this.form.addEventListener('reset', this.onReset);
  }

  onInvalidField = (e) => {
    e.preventDefault();
  }

  showFieldError(field, message) {
    this.hideFieldError(field);

    if (field.classList?.contains('field')) {
      field.classList.add('field--has-error');

      const errorElement = document.createElement('div');
      errorElement.className = 'field__error';
      errorElement.textContent = message;
      errorElement.id = `${field.id || 'field-container'}-error`;
      errorElement.setAttribute('role', 'alert');

      field.appendChild(errorElement);
      return;
    }

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

    field.addEventListener('input', removeErrorOnInput, { once: true });
  }

  hideFieldError(field) {
    if (field.classList?.contains('field')) {
      field.classList.remove('field--has-error');

      const errorElements = field.querySelectorAll('.field__error');
      errorElements.forEach(errorElement => {
        errorElement.remove();
      });

      const inputs = field.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.setCustomValidity('');
        input.classList.remove('field__control--error');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      });

      return;
    }

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

  validateAdultField = (e) => {
    const radios = this.elements.adultElements;
    const isChecked = Array.from(radios).some(radio => radio.checked);

    const adultContainer = radios[0]?.closest('.field');

    if (!isChecked) {
      if (adultContainer) {
        this.showFieldError(adultContainer, 'Необходимо выбрать возраст');
      }
    } else {
      if (adultContainer) {
        this.hideFieldError(adultContainer);
      }
    }
  }

  validateAgreementField = (e) => {
    const checkbox = e.target;
    const container = checkbox.closest('.field');

    if (!checkbox.checked) {
      if (container) {
        this.showFieldError(container, 'Примите условия договора');
      } else {
        this.showFieldError(checkbox, 'Примите условия договора');
      }
    } else {
      if (container) {
        this.hideFieldError(container);
      } else {
        this.hideFieldError(checkbox);
      }
    }
  }

  validateDateField(field) {
    const value = field.value.trim();

    if (!value) {
      return { isValid: true };
    }

    if (value.length !== 10) {
      return {
        isValid: false,
        message: 'Введите полную дату в формате ДД.ММ.ГГГГ'
      };
    }

    const selectedDate = this.parseDate(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!selectedDate) {
      const yearMatch = value.match(/\.(\d{4})$/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1], 10);
        const currentYear = new Date().getFullYear();

        if (year > currentYear + 5) {
          return {
            isValid: false,
            message: `Максимальный год для бронирования - ${currentYear + 5}`
          };
        }
      }
      return {
        isValid: false,
        message: 'Введите корректную дату в формате ДД.ММ.ГГГГ'
      };
    }

    if (selectedDate < today) {
      return {
        isValid: false,
        message: 'Нельзя выбрать прошедшую дату'
      };
    }

    return { isValid: true };
  }

  onDateBeforeInput = (e) => {
    const field = e.target;
    const inputType = e.inputType;
    const data = e.data || '';

    if (inputType && inputType.includes('delete')) {
      return;
    }

    if (inputType === 'insertFromPaste' || inputType === 'insertFromDrop') {
      return;
    }

    if (inputType !== 'insertText' && inputType !== 'insertReplacementText') {
      return;
    }

    if (!/^\d$/.test(data)) {
      e.preventDefault();
      return;
    }

    const currentValue = field.value;
    const selectionStart = field.selectionStart;
    const selectionEnd = field.selectionEnd;

    const currentDigits = currentValue.replace(/\D/g, '');

    const firstDotIndex = currentValue.indexOf('.');
    const secondDotIndex = currentValue.indexOf('.', firstDotIndex + 1);

    const isCursorInYear = secondDotIndex !== -1 && selectionStart > secondDotIndex;

    if (isCursorInYear) {
      const yearDigits = currentValue.substring(secondDotIndex + 1).replace(/\D/g, '');

      if (yearDigits.length >= 4) {
        e.preventDefault();
        return;
      }
    }

    const selectedLength = selectionEnd - selectionStart;
    const digitsAfterInput = currentDigits.length - selectedLength + (data ? 1 : 0);

    if (digitsAfterInput > 8) {
      e.preventDefault();
      return;
    }
  }

  onDateKeydown = (e) => {
    const field = e.target;
    const key = e.key;
    const currentValue = field.value;

    if (key === 'Backspace' || key === 'Delete') {
      const cursorPosition = field.selectionStart;
      const isCursorAtSeparator = currentValue[cursorPosition] === '.';

      if (isCursorAtSeparator) {
        e.preventDefault();

        field.selectionStart = cursorPosition - 1;
        field.selectionEnd = cursorPosition - 1;

        const event = new KeyboardEvent('keydown', {
          key: 'Backspace',
          bubbles: true
        });
        field.dispatchEvent(event);
      }
    }
  }

  onDateInput = (e) => {
    const field = e.target;

    let value = field.value.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
    }
    if (value.length > 2) {
      formattedValue += '.' + value.substring(2, 4);
    }
    if (value.length > 4) {
      const year = value.substring(4, 8);
      formattedValue += '.' + year;
    }

    if (field.value !== formattedValue) {
      field.value = formattedValue;

      const cursorPosition = field.selectionStart;
      setTimeout(() => {
        const newCursorPos = this.calculateNewCursorPosition(cursorPosition, field.value);
        field.selectionStart = newCursorPos;
        field.selectionEnd = newCursorPos;
      }, 0);
    }
  }

  calculateNewCursorPosition(oldPos, newValue) {
    return oldPos <= newValue.length ? oldPos : newValue.length;
  }

  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }

  parseDate(dateString) {
    if (!dateString) return null;

    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(dateRegex);

    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const currentYear = new Date().getFullYear();
    const maxAllowedYear = currentYear + 5;

    if (year < 1000 || year > maxAllowedYear) return null;
    if (month < 1 || month > 12) return null;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return null;

    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return null;

    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return null;
    }

    return date;
  }

  onDateBlur = (e) => {
    const field = e.target;
    const validation = this.validateDateField(field);

    if (!validation.isValid) {
      this.showFieldError(field, validation.message);
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
      this.showFieldError(field, 'Введите корректный email, например an@mail.ru');
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
      if (field && field.value.trim()) {
        const validation = this.validateDateField(field);
        if (!validation.isValid) {
          this.showFieldError(field, validation.message);
          invalidFields.push(field);
          isValid = false;
        }
      }
    });

    if (this.elements.emailElement && this.elements.emailElement.value.trim() !== '') {
      if (!this.elements.emailElement.checkValidity()) {
        this.showFieldError(this.elements.emailElement, 'Введите корректный email, например an@mail.ru');
        invalidFields.push(this.elements.emailElement);
        isValid = false;
      }
    }

    const adultChecked = Array.from(this.elements.adultElements || []).some(radio => radio.checked);
    if (!adultChecked) {
      const container = document.querySelector(this.selectors.adult)?.closest('.field');
      if (container) {
        this.showFieldError(container, 'Необходимо выбрать возраст');
        invalidFields.push(container);
        isValid = false;
      }
    }

    if (this.elements.agreementElement && !this.elements.agreementElement.checked) {
      const container = this.elements.agreementElement.closest('.field');
      if (container) {
        this.showFieldError(container, 'Примите условия договора');
        invalidFields.push(container);
      } else {
        this.showFieldError(this.elements.agreementElement, 'Примите условия договора');
        invalidFields.push(this.elements.agreementElement);
      }
      isValid = false;
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

    if (this.elements.tabsSection) {
      this.elements.tabsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    this.form.reset();
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