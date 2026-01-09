export class DateValidator {
  static validateDateField(field) {
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

  static parseDate(dateString) {
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

  static formatDateInput(value) {
    let digits = value.replace(/\D/g, '');

    if (digits.length > 8) {
      digits = digits.substring(0, 8);
    }

    let formattedValue = '';
    if (digits.length > 0) {
      formattedValue = digits.substring(0, 2);
    }
    if (digits.length > 2) {
      formattedValue += '.' + digits.substring(2, 4);
    }
    if (digits.length > 4) {
      const year = digits.substring(4, 8);
      formattedValue += '.' + year;
    }

    return formattedValue;
  }

  static handleDateBeforeInput(e) {
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

  static handleDateKeydown(e) {
    const field = e.target;
    const key = e.key;
    const currentValue = field.value;
    const cursorPosition = field.selectionStart;

    if (key !== 'Backspace' && key !== 'Delete') {
      return;
    }

    if (currentValue[cursorPosition] !== '.') {
      return;
    }

    e.preventDefault();

    if (key === 'Backspace') {
      if (cursorPosition > 0) {
        const newValue = currentValue.substring(0, cursorPosition - 1) +
          currentValue.substring(cursorPosition);
        field.value = newValue;

        field.selectionStart = cursorPosition - 1;
        field.selectionEnd = cursorPosition - 1;
      }
    }

    else if (key === 'Delete') {
      if (cursorPosition < currentValue.length - 1) {
        const newValue = currentValue.substring(0, cursorPosition + 1) +
          currentValue.substring(cursorPosition + 2);
        field.value = newValue;

        field.selectionStart = cursorPosition;
        field.selectionEnd = cursorPosition;
      }
    }

    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }

  static calculateNewCursorPosition(oldPos, newValue) {
    return oldPos <= newValue.length ? oldPos : newValue.length;
  }
}