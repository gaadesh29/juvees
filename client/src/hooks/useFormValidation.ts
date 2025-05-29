import { useState, useCallback } from 'react';
import * as validation from '../utils/validation';

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  password?: boolean;
  minLength?: number;
  maxLength?: number;
  numeric?: boolean;
  alphabetic?: boolean;
  alphanumeric?: boolean;
  custom?: (value: string) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (initialValues: { [key: string]: string }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback(
    (name: string, value: string, rules: ValidationRules): string | null => {
      if (rules.required && !validation.validateRequired(value)) {
        return 'This field is required';
      }

      if (value) {
        if (rules.email && !validation.validateEmail(value)) {
          return 'Invalid email address';
        }

        if (rules.password && !validation.validatePassword(value)) {
          return 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        }

        if (rules.minLength && !validation.validateMinLength(value, rules.minLength)) {
          return `Minimum length is ${rules.minLength} characters`;
        }

        if (rules.maxLength && !validation.validateMaxLength(value, rules.maxLength)) {
          return `Maximum length is ${rules.maxLength} characters`;
        }

        if (rules.numeric && !validation.validateNumeric(value)) {
          return 'Must contain only numbers';
        }

        if (rules.alphabetic && !validation.validateAlphabetic(value)) {
          return 'Must contain only letters';
        }

        if (rules.alphanumeric && !validation.validateAlphanumeric(value)) {
          return 'Must contain only letters and numbers';
        }

        if (rules.custom && !rules.custom(value)) {
          return 'Invalid value';
        }
      }

      return null;
    },
    []
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      rules?: ValidationRules
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (rules) {
        const error = validateField(name, value, rules);
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }));
      }
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const validateForm = useCallback(
    (validationRules: { [key: string]: ValidationRules }): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((name) => {
        const error = validateField(name, values[name], validationRules[name]);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [values, validateField]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  };
}; 