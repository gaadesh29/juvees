export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  // Basic Luhn algorithm check
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month);
  const expYear = parseInt(year);

  if (expMonth < 1 || expMonth > 12) return false;
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

export const validatePhoneNumber = (phone: string): boolean => {
  return /^\+?[\d\s-]{10,}$/.test(phone);
};

export const validateZipCode = (zipCode: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zipCode);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

export const validateAlphabetic = (value: string): boolean => {
  return /^[a-zA-Z\s]+$/.test(value);
};

export const validateAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9\s]+$/.test(value);
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateShippingAddress = (address: {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!address.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  if (!address.address.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!address.city.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!address.state.trim()) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  if (!address.postalCode.trim()) {
    errors.push({ field: 'postalCode', message: 'Postal code is required' });
  } else if (!/^\d{5}(-\d{4})?$/.test(address.postalCode)) {
    errors.push({
      field: 'postalCode',
      message: 'Please enter a valid postal code (e.g., 12345 or 12345-6789)',
    });
  }

  if (!address.country.trim()) {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  if (!address.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!/^\+?[\d\s-]{10,}$/.test(address.phone)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number',
    });
  }

  return errors;
};

export const validatePaymentMethod = (payment: {
  type: 'credit_card' | 'paypal';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (payment.type === 'credit_card') {
    if (!payment.cardNumber) {
      errors.push({ field: 'cardNumber', message: 'Card number is required' });
    } else if (!/^\d{16}$/.test(payment.cardNumber.replace(/\s/g, ''))) {
      errors.push({
        field: 'cardNumber',
        message: 'Please enter a valid 16-digit card number',
      });
    }

    if (!payment.expiryDate) {
      errors.push({ field: 'expiryDate', message: 'Expiry date is required' });
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(payment.expiryDate)) {
      errors.push({
        field: 'expiryDate',
        message: 'Please enter a valid expiry date (MM/YY)',
      });
    }

    if (!payment.cvv) {
      errors.push({ field: 'cvv', message: 'CVV is required' });
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.push({
        field: 'cvv',
        message: 'Please enter a valid CVV (3 or 4 digits)',
      });
    }
  }

  return errors;
}; 