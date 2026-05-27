export class FormValidator {
  static validateDistance(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  }

  static validateMode(value) {
    return ['car', 'bus', 'train', 'plane', 'bicycle', 'truck'].includes(value);
  }

  static validateCity(value) {
    return value.trim().length >= 2;
  }

  static validatePassengers(value) {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 1;
  }
}