const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

class Helpers {
  static deepMerge(target, source) {
    const result = target;

    Object.keys(source).forEach((key) => {

      if (Object.prototype.hasOwnProperty.call(target, key) && typeof source[key] === 'object') {
        Helpers.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }

    });

    return result;
  }

  static combineUrlWithParameters(rootUrl, params, pathname) {
    const redirectUrl = new URL(rootUrl);

    if (pathname) {
      redirectUrl.pathname = pathname;
    }

    if (params) {
      redirectUrl.search = new URLSearchParams(params);
    }

    return redirectUrl.toString();
  }

  static toArray(param) {

    if (Array.isArray(param)) {
      return param;
    }

    return [param];
  }

  static removeForeignKeys(obj) {
    const result = {};

    if (!obj) {
      return result;
    }

    Object.keys(obj).forEach((key) => {

      if (!/\w+Id/.test(key)) {
        result[key] = obj[key];
      }

    });

    return result;
  }

  static getChanges(sequelizeEntity) {
    const changes = sequelizeEntity.changed();
    const result = [];

    if (!changes) {
      return result;
    }

    changes.forEach((change) => {

      if (/\w+Id/.test(change)) {
        result.push(change.substring(0, change.length - 2));
      } else {
        result.push(change);
      }

    });

    return result;
  }

  static isArraysSymmDifference(arr1, arr2) {
    return arr1.some((x) => !arr2.includes(x)) || arr2.some((x) => !arr1.includes(x));
  }

  static getArraysDifference(arr1, arr2) {
    return arr1.filter((x) => !arr2.includes(x));
  }

  static getArraysIntersection(arr1, arr2) {
    return arr1.filter((x) => arr2.includes(x));
  }

  static getNewOrderForArray(order, arrayLength) {

    if (order < 0) {
      return 0;
    }

    if (order >= arrayLength) {
      return arrayLength - 1;
    }

    return order;
  }

  static moveArrayItemToNewIndex(arr, oldIndex, newIndex) {

    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      // eslint-disable-next-line no-plusplus
      while (k--) {
        arr.push(undefined);
      }
    }

    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

    return arr;
  }

  static isEmpty(value) {
    try {
      return (value === undefined || value === '' || value === null || JSON.stringify(value) === JSON.stringify({}) || value.length === 0);
    } catch (e) {
      return false;
    }
  }

  static clearPhone(phone) {
    if (phone) {
      // remove '+' and other symbols
      let res = phone.replace(/\(|\)|\+|-| /g, '');

      // leave last 10 digits
      if (res.length > 10) {
        res = res.slice(-10);
      }

      return res;
    }

    return false;
  }

  static maskPhone(phone) {
    if (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{0})/, '$1-$2-$3');
    }

    return false;
  }

  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static capitalizeEachWord(str) {
    return str.toLowerCase()
      .split(' ')
      .map((i) => this.capitalize(i))
      .join(' ');
  }

  static sequelizeChanges(instance) {
    let result = [];
    if (!instance.changed()) {
      return null;
    }
    const changes = instance.changed();

    if (!changes || !changes.length) {
      return result;
    }

    result = changes.filter((i) => {
      const prev = instance.previous(i) || '';
      const curr = instance[i] || '';

      return prev.toString() !== curr.toString();
    });

    return result;
  }

  static toLowerCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  }

  static isEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  }

  /**
   * Load yaml file and convert to json
   * @param {*} directory
   * @param {*} fileName
   */
  static loadYamlFile(fileName, directory = null) {
    const filePath = directory || __dirname;
    const yamlFile = fs.readFileSync(path.resolve(filePath, fileName));

    return yaml.load(yamlFile, 'utf8');
  }

  /**
   * Swap start json with end
   * @param {*} json
   */
  static swapJSON(json) {
    const newJson = {};
    const array = Object.keys(json);
    const { length } = array;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < array.length; i++) {
      const key = array[length - i];
      newJson[key] = json[key];
    }

    return newJson;
  }

  static sequelizePrevInstance(instance, changes) {
    const prev = {};
    changes.forEach((i) => {
        prev[i] = instance.previous(i);
    });

    return prev;
  }

  static sequelizeCurrInstance(instance, changes) {
    const curr = {};
    changes.forEach((i) => {
        curr[i] = instance.get(i);
    });

    return curr;
  }

  static getValueFromParam(context, data, field, defaultValue = null) {

    if (data[field] === undefined) {
      return context[field] !== undefined ? context[field] : defaultValue;
    }

    return data[field] || defaultValue;
  }
}

module.exports = Helpers;
