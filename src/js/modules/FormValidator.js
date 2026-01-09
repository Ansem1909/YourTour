import { FieldValidator } from './validators/FieldValidator.js';
import { DateValidator } from './validators/DateValidator.js';
import { PhoneValidator } from './validators/PhoneValidator.js';
import { EmailValidator } from './validators/EmailValidator.js';

const rootSelector = '[data-js-form]';

export default class FormValidator {
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

  clearAllErrors() {
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      FieldValidator.hideFieldError(field);
    });
  }

  validateRequiredField = (e) => {
    const field = e.target;
    FieldValidator.validateRequiredField(field);
  }

  validateAdultField = (e) => {
    const radios = this.elements.adultElements;
    const isChecked = Array.from(radios).some(radio => radio.checked);

    const adultContainer = radios[0]?.closest('.field');

    if (!isChecked) {
      if (adultContainer) {
        FieldValidator.showFieldError(adultContainer, 'Необходимо выбрать возраст');
      }
    } else {
      if (adultContainer) {
        FieldValidator.hideFieldError(adultContainer);
      }
    }
  }

  validateAgreementField = (e) => {
    const checkbox = e.target;
    const container = checkbox.closest('.field');

    if (!checkbox.checked) {
      if (container) {
        FieldValidator.showFieldError(container, 'Примите условия договора');
      } else {
        FieldValidator.showFieldError(checkbox, 'Примите условия договора');
      }
    } else {
      if (container) {
        FieldValidator.hideFieldError(container);
      } else {
        FieldValidator.hideFieldError(checkbox);
      }
    }
  }

  onDateBlur = (e) => {
    const field = e.target;
    const validation = DateValidator.validateDateField(field);

    if (!validation.isValid) {
      FieldValidator.showFieldError(field, validation.message);
    } else {
      FieldValidator.hideFieldError(field);
    }
  }

  onDateBeforeInput = (e) => {
    DateValidator.handleDateBeforeInput(e);
  }

  onDateKeydown = (e) => {
    DateValidator.handleDateKeydown(e);
  }

  onDateInput = (e) => {
    const field = e.target;
    const formattedValue = DateValidator.formatDateInput(field.value);

    if (field.value !== formattedValue) {
      field.value = formattedValue;

      const cursorPosition = field.selectionStart;
      setTimeout(() => {
        const newCursorPos = DateValidator.calculateNewCursorPosition(cursorPosition, field.value);
        field.selectionStart = newCursorPos;
        field.selectionEnd = newCursorPos;
      }, 0);
    }
  }

  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }

  onPhoneInput = (e) => {
    e.target.value = PhoneValidator.formatPhoneInput(e.target.value);
  }

  onEmailBlur = (e) => {
    const field = e.target;
    const validation = EmailValidator.validateEmail(field);

    if (!validation.isValid) {
      FieldValidator.showFieldError(field, validation.message);
    } else {
      FieldValidator.hideFieldError(field);
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
        FieldValidator.showFieldError(field, 'Это поле обязательно для заполнения');
        invalidFields.push(field);
        isValid = false;
      }
    });

    [this.elements.dateFromElement, this.elements.dateToElement].forEach(field => {
      if (field && field.value.trim()) {
        const validation = DateValidator.validateDateField(field);
        if (!validation.isValid) {
          FieldValidator.showFieldError(field, validation.message);
          invalidFields.push(field);
          isValid = false;
        }
      }
    });

    if (this.elements.emailElement && this.elements.emailElement.value.trim() !== '') {
      const validation = EmailValidator.validateEmail(this.elements.emailElement);
      if (!validation.isValid) {
        FieldValidator.showFieldError(this.elements.emailElement, validation.message);
        invalidFields.push(this.elements.emailElement);
        isValid = false;
      }
    }

    const adultChecked = Array.from(this.elements.adultElements || []).some(radio => radio.checked);
    if (!adultChecked) {
      const container = document.querySelector(this.selectors.adult)?.closest('.field');
      if (container) {
        FieldValidator.showFieldError(container, 'Необходимо выбрать возраст');
        invalidFields.push(container);
        isValid = false;
      }
    }

    if (this.elements.agreementElement && !this.elements.agreementElement.checked) {
      const container = this.elements.agreementElement.closest('.field');
      if (container) {
        FieldValidator.showFieldError(container, 'Примите условия договора');
        invalidFields.push(container);
      } else {
        FieldValidator.showFieldError(this.elements.agreementElement, 'Примите условия договора');
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