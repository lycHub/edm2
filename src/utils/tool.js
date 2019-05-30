export function isEmptyObj(obj) {
  return (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0);
}


export function validEmail(email) {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return reg.test(email);
}


// application/x-www-form-urlencoded
export function formDataFilterEmpty(data) {
  let ret = ''
  for (let it in data) {
    if (data[it]) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
  }
  return ret
}


export function setStroge(params, type = 'local') {
  const kv = Array.isArray(params) ? params : [params];
  for (const { key, value } of kv) {
    window[type + 'Storage'].setItem(key, value);
  }
}

export function removeStroge(keys, type = 'local') {
  const kv = Array.isArray(keys) ? keys : [keys];
  for (const item of kv) {
    window[type + 'Storage'].removeItem(item);
  }
}


export function toDate(argument) {
  if (arguments.length < 1) {
    throw new TypeError(
      '1 argument required, but only ' + arguments.length + ' present'
    )
  }

  const argStr = Object.prototype.toString.call(argument)

  // Clone the date
  if (
    argument instanceof Date ||
    (typeof argument === 'object' && argStr === '[object Date]')
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime())
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument)
  } else {
    if (
      (typeof argument === 'string' || argStr === '[object String]') &&
      typeof console !== 'undefined'
    ) {
      console.warn(
        "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fpAk2"
      )
      console.warn(new Error().stack)
    }
    return new Date(NaN)
  }
}

// 数组去重
export function uniq(arr, x) {
  const hash=[];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i+1; j < arr.length; j++) {
      const itemI = x ? arr[i][x] : arr[i];
      const itemJ = x ? arr[j][x] : arr[j];
      if(itemI === itemJ){
        ++i;
      }
    }
    hash.push(arr[i]);
  }
  return hash;
}
