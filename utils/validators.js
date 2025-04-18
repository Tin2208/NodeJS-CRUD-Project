// utils/validators.js

module.exports = {
  isValidString(value, field = "Field") {
    if (typeof value !== "string" || value.trim() === "") {
      return {
        valid: false,
        message: `${field} must be a non-empty string.`,
      };
    }
    return { valid: true };
  },

  isValidEmail(value, field = "Email") {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== "string" || !regex.test(value)) {
      return {
        valid: false,
        message: `${field} must be a valid email.`,
      };
    }
    return { valid: true };
  },

  isValidNumber(value, field = "Field") {
    if (typeof value !== "number" || isNaN(value)) {
      return {
        valid: false,
        message: `${field} must be a valid number.`,
      };
    } else {
      if (value <= 0) {
        return {
          valid: false,
          message: `${field} The input number must be greater than 0.`,
        };
      }
    }

    return { valid: true };
  },
};
