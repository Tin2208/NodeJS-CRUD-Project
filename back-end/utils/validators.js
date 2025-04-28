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
    if (Array.isArray(value) || value === "[]") {
      return {
        valid: false,
        message: `${field} must be a valid number.`,
      };
    }

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "object" && value !== null)
    ) {
      return {
        valid: false,
        message: `${field} is required.`,
      };
    }

    const parsed = Number(value);

    if (isNaN(value)) {
      return {
        valid: false,
        message: `${field} must be a valid number.`,
      };
    }

    if (parsed <= 0) {
      return {
        valid: false,
        message: `${field} must be greater than 0.`,
      };
    }

    return { valid: true, value: parsed };
  },
};
