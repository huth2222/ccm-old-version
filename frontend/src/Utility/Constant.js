const user = localStorage.getItem("userData");
export const userData = JSON.parse(user);

export function validateObjectFields(obj, excludedFields) {
  for (const key in obj) {
    if (!excludedFields.includes(key) && (!obj[key] || obj[key] === "")) {
      return false;
    }
  }
  return true;
}

export function validateObjectIncludes(obj, includesFields) {
  for (const key of includesFields) {
    if (!obj.hasOwnProperty(key) || !obj[key] || obj[key].trim() === '') {
      return false; // If any key value is missing or empty, return false
    }
  }
  return true; // All specified key values are non-empty

}

export const commaFormatter = (number) => {
  const numString = String(number);
  const integerPart = numString.split('.')[0]; // Get the integer part before the dot

  const formattedNumber = integerPart.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedNumber;
// };

};

export function validateStringLength(inputString, minLength, maxLength) {
  if (typeof inputString !== "string") {
    throw new Error("Input is not a string");
  }

  const length = inputString.length;

  if (length >= minLength && length <= maxLength) {
    return true;
  } else {
    return false;
  }
}

export function validateFileType(files) {
  const allowedExtensions = /\.(jpg|jpeg|svg|pdf|xls|xlsx|xlsm|png)$/i;
  const maxFileSize = 10 * 1024 * 1024;

  for (const file of files) {
    if (file.name) {
      if (!allowedExtensions.test(file.name)) {
        return false;
      }
  
      if (file.size > maxFileSize) {
        return false;
      }
    } else {
      return true
    }
  }

  return true;
}

export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailPattern.test(email);
}

export function isNameInvalid(arrayOfObjects) {
  return arrayOfObjects.some((obj) => {
    return Object.values(obj).some((value) => value === false);
  });
}

export function addLeadingZeroToSingleDigit(number) {
  if (number >= 1 && number <= 9) {
    return `0${number}`;
  }
  return number.toString();
}

export function convertToFiveDigitFormat(number, digit=5) {
  const numberString = String(number);
  const leadingZeros = "0".repeat(digit - numberString.length);
  return leadingZeros + numberString;
}

  export function getObjectByValue(data, key, value) {
    for (const item in data) {
        if (data.hasOwnProperty(item) && data[item][key] === value) {
            return data[item];
        }
    }
    return null; // Return null if the key-value pair is not found
}

export function areAllValuesTrue(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== true) {
      return false;
    }
  }
  return true;
}

export function areAllValuesFalse(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== false) {
      return false;
    }
  }
  return true;
}

export function areAllValuesEmpty(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      return false; // If any value is not empty, return false
    }
  }
  return true; // All values are empty or falsy
}

export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
