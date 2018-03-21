export default class TimeInput {

  static regexps = [
    {
      type: 'hours',
      pattern: /^\s*([2][0-3]|[01]?[0-9])?(\s*[:]\s*[0-5][0-9]?)?\s*$/,
    },
    {
      type: 'decimal',
      pattern: /^\s*([2][0-3]|[1]?[0-9])?([.,]\d+)?\s*$/,
    },
    {
      type: 'namedHours',
      pattern: /^\s*([2][0-3]|[1]?[0-9])(\s[h])\s*$/,
    },
    {
      type: 'namedMinutes',
      pattern: /^\s*([0-5][0-9]?)(\s[m])\s*$/,
    },
    {
      type: 'minutes',
      pattern: /^\s*(2[4-9]|[3-5][0-9])\s*$/,
    },
  ];

  static timeConvertor(value) {
    const expressionIndex = this.regexps.findIndex((regexp) => regexp.pattern.test(value));
    if (expressionIndex !== -1) {
      if (this.regexps[expressionIndex].type !== 'decimal') {
        const convertor = `${this.regexps[expressionIndex].type}Convertor`;
        return this.hoursToDecimalConverter(this[convertor](value));
      }
      return this[`${this.regexps[expressionIndex].type}Convertor`](value);
    }
    return value;
  }

  static hoursConvertor(value) {
    const arr = value.split(':');
    if (arr.length === 2) {
      arr[1] += (arr[1].length === 1) ? '0' : '';
      arr[1] = arr[1].trim();
    }
    arr[0] = Number(arr[0]);
    return arr.join(':');
  }

  static decimalConvertor(value) {
    const separator = (value.indexOf('.') !== -1) ? '.' : ',';
    const arr = value.split(separator);
    arr[1] += ((arr[1].length === 1) ? '0' : '');
    return arr.join('.');
  }

  static namedHoursConvertor(value) {
    let arr = value.split(' ');
    arr = arr.filter((arrItem) => arrItem !== '');
    arr[1] = '00';
    return arr.join(':');
  }

  static namedMinutesConvertor(value) {
    let arr = value.split(' ');
    arr = arr.filter((arrItem) => arrItem !== '');
    arr[1] = (Number(arr[0]) < 10) ? `0${arr[0]}` : arr[0];
    arr[0] = '0';
    return arr.join(':');
  }

  static minutesConvertor(value) {
    const minutes = Number(value);
    return `0:${minutes}`;
  }

  static hoursToDecimalConverter(decimal) {
    const arr = decimal.split(':');
    if (arr.length === 2) {
      arr[1] += (arr[1].length === 1) ? '0' : '';
    }

    const dec = parseInt((arr[1] / 6) * 10, 10);
    return parseFloat(`${parseInt(arr[0], 10)}.${dec < 10 ? '0' : ''}${dec}`).toFixed(2);
  }

  static decimalToHoursConverter(time) {
    const rand = (i) => i + (Math.round(((time - i) * 60), 10) / 100);
    const hours = (rand(parseInt(time, 10))).toFixed(2);
    const convertedHours = hours.toString().split('.');

    convertedHours[0] = (convertedHours[0].length === 2) ? convertedHours[0] : `  ${convertedHours[0]}`;

    if (convertedHours[1] === '00') {
      convertedHours[1] = ' h';

      const resultHours = convertedHours.join('');
      return (resultHours === '  0 h') ? '' : resultHours;
    }
    if (convertedHours.length === 2) convertedHours[1] += (convertedHours[1].length === 1) ? '0' : '';


    return convertedHours.join(' : ');
  }

  static isValidTimeInput(value) {
    const expressionIndex = this.regexps.findIndex((regexp) => regexp.pattern.test(value));
    return expressionIndex !== -1;
  }

}

