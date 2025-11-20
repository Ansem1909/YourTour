// const rootSelector = '[data-js-form]';
//
// class FormValidator {
//   selectors = {
//     root: rootSelector,
//     phone: '[data-js-form-phone]',
//     email: '[data-js-form-email]',
//     dateFrom: '[data-js-date-from]',
//     dateTo: '[data-js-date-to]',
//     agreement: '[data-js-form-agreement]',
//   }
//
//   constructor(rootElement) {
//     this.form = rootElement || document.querySelector(this.selectors.root);
//
//     if (!this.form) {
//       console.warn('Form элемент не найден');
//       return;
//     }
//
//     this.elements = {
//       phoneElement: this.form.querySelector(this.selectors.phone),
//       emailElement: this.form.querySelector(this.selectors.email),
//       dateFromElement: this.form.querySelector(this.selectors.dateFrom),
//       dateToElement: this.form.querySelector(this.selectors.dateTo),
//       agreementElement: this.form.querySelector(this.selectors.agreement),
//     }
//
//     this.init();
//   }
//
//   init() {
//     this.setMinDates();
//     this.bindEvents();
//   }
//
//   setMinDates() {
//     const today = new Date().toISOString().split('T')[0];
//     if (this.elements.dateFromElement) {
//       this.elements.dateFromElement.min = today;
//     }
//     if (this.elements.dateToElement) {
//       this.elements.dateToElement.min = today;
//     }
//   }
//
//   bindEvents() {
//     if (this.elements.phoneElement) {
//       this.elements.phoneElement.addEventListener('input', this.onPhoneInput);
//     }
//     if (this.elements.emailElement) {
//       this.elements.emailElement.addEventListener('blur', this.onEmailBlur);
//     }
//     if (this.elements.dateFromElement) {
//       // this.elements.dateFromElement.addEventListener('input', this.onDateInput);
//       this.elements.dateFromElement.addEventListener('blur', this.onDateBlur);
//       this.elements.dateFromElement.addEventListener('input', this.onDateInput);
//     }
//     if (this.elements.dateToElement) {
//       this.elements.dateToElement.addEventListener('input', this.onDateInput);
//       this.elements.dateToElement.addEventListener('blur', this.onDateBlur);
//     }
//     this.form.addEventListener('submit', this.onSubmit);
//     this.form.addEventListener('reset', this.onReset);
//   }
//
//   getFormData() {
//     const formData = new FormData(this.form);
//     return Object.fromEntries(formData);
//   }
//
//   onPhoneInput = (e) => {
//     let input = e.target.value.replace(/\D/g, '');
//     input = input.substring(0, 11);
//
//     let formattedValue = '+7 ';
//     if (input.length > 1) {
//       formattedValue += '(' + input.substring(1, 4);
//     }
//     if (input.length >= 5) {
//       formattedValue += ') ' + input.substring(4, 7);
//     }
//     if (input.length >= 8) {
//       formattedValue += '-' + input.substring(7, 9);
//     }
//     if (input.length >= 10) {
//       formattedValue += '-' + input.substring(9, 11);
//     }
//
//     e.target.value = formattedValue;
//   }
//
//   onEmailBlur = (e) => {
//     const email = e.target.value.trim();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//
//     if (email && !emailRegex.test(email)) {
//       e.target.setCustomValidity('Пожалуйста, введите корректный email адрес (например, example@mail.com)');
//       e.target.reportValidity();
//       return false;
//     } else {
//       e.target.setCustomValidity('');
//       return true;
//     }
//   }
//
//   validateEmail() {
//     if (!this.elements.emailElement) return true;
//
//     const email = this.elements.emailElement.value.trim();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//
//     if (email && !emailRegex.test(email)) {
//       this.elements.emailElement.setCustomValidity('Пожалуйста, введите корректный email адрес (например, example@mail.com)');
//       return false;
//     } else {
//       this.elements.emailElement.setCustomValidity('');
//       return true;
//     }
//   }
//
//   formatDateToDisplay(dateString) {
//     if (!dateString) return '';
//
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return dateString;
//
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//
//     return `${day}.${month}.${year}`;
//   }
//
//   parseDateFromDisplay(dateString) {
//     if (!dateString) return null;
//
//     const parts = dateString.split('.');
//     if (parts.length !== 3) return null;
//
//     const day = parseInt(parts[0], 10);
//     const month = parseInt(parts[1], 10) - 1;
//     const year = parseInt(parts[2], 10);
//
//     const date = new Date(year, month, day);
//     return isNaN(date.getTime()) ? null : date;
//   }
//
//   onDateInput = (e) => {
//     e.target.setCustomValidity('');
//   }
//
//   onDateBlur = (e) => {
//     const field = e.target;
//     const value = field.value.trim();
//
//     if (!value) {
//       field.setCustomValidity('');
//       return;
//     }
//
//     const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
//     const match = value.match(dateRegex);
//
//     if (!match) {
//       field.setCustomValidity('Пожалуйста, введите дату в формате ДД.ММ.ГГГГ');
//       field.reportValidity();
//       return;
//     }
//
//     const day = parseInt(match[1], 10);
//     const month = parseInt(match[2], 10) - 1;
//     const year = parseInt(match[3], 10);
//
//     const selectedDate = new Date(year, month, day);
//     if (isNaN(selectedDate.getTime()) ||
//       selectedDate.getDate() !== day ||
//       selectedDate.getMonth() !== month ||
//       selectedDate.getFullYear() !== year) {
//       field.setCustomValidity('Пожалуйста, введите корректную дату');
//       field.reportValidity();
//       return;
//     }
//
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//
//     const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
//
//     if (selectedDateOnly < today) {
//       field.setCustomValidity('Нельзя выбрать прошедшую дату');
//       field.reportValidity();
//       return;
//     }
//
//     if (field === this.elements.dateToElement && this.elements.dateFromElement.value) {
//       const dateFromValue = this.elements.dateFromElement.value;
//       const fromMatch = dateFromValue.match(dateRegex);
//
//       if (fromMatch) {
//         const fromDay = parseInt(fromMatch[1], 10);
//         const fromMonth = parseInt(fromMatch[2], 10) - 1;
//         const fromYear = parseInt(fromMatch[3], 10);
//         const dateFrom = new Date(fromYear, fromMonth, fromDay);
//
//         if (!isNaN(dateFrom.getTime()) && selectedDateOnly < dateFrom) {
//           field.setCustomValidity('"Дата до" не может быть раньше "Даты от"');
//           field.reportValidity();
//           return;
//         }
//       }
//     }
//
//     field.setCustomValidity('');
//   }
//
//   validateDate(field) {
//     if (!field.value) {
//       return '';
//     }
//
//     const selectedDate = this.parseDateFromDisplay(field.value);
//
//     if (!selectedDate) {
//       return 'Пожалуйста, введите дату в формате ДД.ММ.ГГГГ';
//     }
//
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//
//     const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
//     const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//
//     if (selectedDateOnly < todayOnly) {
//       return 'Нельзя выбрать прошедшую дату';
//     }
//
//     if (field === this.elements.dateToElement && this.elements.dateFromElement.value) {
//       const dateFromValue = this.elements.dateFromElement.value;
//       const dateFrom = this.parseDateFromDisplay(dateFromValue);
//
//       if (dateFrom && selectedDateOnly < dateFrom) {
//         return '"Дата до" не может быть раньше "Даты от"';
//       }
//     }
//
//     return '';
//   }
//
//   onSubmit = (e) => {
//     e.preventDefault();
//
//     let isValid = true;
//
//     if (!this.validateEmail()) {
//       isValid = false;
//     }
//
//     [this.elements.dateFromElement, this.elements.dateToElement].forEach(field => {
//       if (field) {
//         field.setCustomValidity('');
//         const error = this.validateDate(field);
//         if (error) {
//           field.setCustomValidity(error);
//           isValid = false;
//         }
//       }
//     });
//
//     if (!this.elements.agreementElement.checked) {
//       this.elements.agreementElement.setCustomValidity('Необходимо принять условия соглашения');
//       isValid = false;
//     } else {
//       this.elements.agreementElement.setCustomValidity('');
//     }
//
//     if (!this.form.checkValidity() || !isValid) {
//       const invalidField = this.form.querySelector(':invalid');
//       if (invalidField) {
//         invalidField.focus();
//         invalidField.reportValidity();
//       }
//       return;
//     }
//
//     console.log('Форма отправлена!', this.getFormData());
//   }
//
//   onReset = () => {
//     setTimeout(() => {
//       this.setMinDates();
//       this.form.querySelectorAll('input, select').forEach(field => {
//         field.setCustomValidity('');
//       });
//     }, 0);
//   }
// }
//
// export default FormValidator;

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
    if (this.elements.dateFromElement) {
      this.elements.dateFromElement.min = today;
    }
    if (this.elements.dateToElement) {
      this.elements.dateToElement.min = today;
    }
  }

  bindEvents() {
    if (this.elements.phoneElement) {
      this.elements.phoneElement.addEventListener('input', this.onPhoneInput);
    }
    if (this.elements.emailElement) {
      this.elements.emailElement.addEventListener('blur', this.onEmailBlur);
      this.elements.emailElement.addEventListener('input', this.onEmailInput);
    }
    if (this.elements.dateFromElement) {
      this.elements.dateFromElement.addEventListener('change', this.onDateChange.bind(this));
    }
    if (this.elements.dateToElement) {
      this.elements.dateToElement.addEventListener('change', this.onDateChange.bind(this));
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
    // Очищаем ошибку при вводе
    e.target.setCustomValidity('');
  }

  onEmailBlur = (e) => {
    this.validateEmailField(e.target);
  }

  validateEmailField(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      field.setCustomValidity('Пожалуйста, введите корректный email адрес (например, example@mail.com)');
      field.reportValidity();
      return false;
    } else {
      field.setCustomValidity('');
      return true;
    }
  }

  validateEmail() {
    if (!this.elements.emailElement) return true;
    return this.validateEmailField(this.elements.emailElement);
  }

  onDateChange(e) {
    const field = e.target;
    this.validateDateField(field);
  }

  validateDateField(field) {
    field.setCustomValidity('');

    if (!field.value) {
      return true;
    }

    const selectedDate = new Date(field.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Проверяем, что дата не в прошлом
    if (selectedDate < today) {
      field.setCustomValidity('Нельзя выбрать прошедшую дату');
      field.reportValidity();
      return false;
    }

    // Проверяем диапазон дат
    if (field === this.elements.dateToElement && this.elements.dateFromElement.value) {
      const dateFrom = new Date(this.elements.dateFromElement.value);

      if (selectedDate < dateFrom) {
        field.setCustomValidity('"Дата до" не может быть раньше "Даты от"');
        field.reportValidity();
        return false;
      }
    }

    if (field === this.elements.dateFromElement && this.elements.dateToElement.value) {
      const dateTo = new Date(this.elements.dateToElement.value);

      if (selectedDate > dateTo) {
        field.setCustomValidity('"Дата от" не может быть позже "Даты до"');
        field.reportValidity();
        return false;
      }
    }

    return true;
  }

  formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  onSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    // Валидация email
    if (!this.validateEmail()) {
      isValid = false;
    }

    // Валидация дат
    [this.elements.dateFromElement, this.elements.dateToElement].forEach(field => {
      if (field && !this.validateDateField(field)) {
        isValid = false;
      }
    });

    // Валидация соглашения
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

    // Показываем даты в нужном формате
    if (this.elements.dateFromElement.value) {
      console.log('Дата от:', this.formatDateForDisplay(this.elements.dateFromElement.value));
    }
    if (this.elements.dateToElement.value) {
      console.log('Дата до:', this.formatDateForDisplay(this.elements.dateToElement.value));
    }
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