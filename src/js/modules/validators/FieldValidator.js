export class FieldValidator {
  static showFieldError(field, message) {
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

  static hideFieldError(field) {
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

  static validateRequiredField(field) {
    if (!field.value.trim()) {
      this.showFieldError(field, 'Это поле обязательно для заполнения');
      return false;
    } else {
      this.hideFieldError(field);
      return true;
    }
  }
}