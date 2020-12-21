// import parseTime, formatTime and set to filter
export { parseTime, formatTime, filterPattern, formatDate } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// 保留小数
export function toFixed(val, num = 2) {
  if (!val) return 0;
  return Number(val).toFixed(num);
}

// 补0
export function prefixInteger(num = 0, n = 4) {
  if (!num) return "-";
  return (Array(n).join(0) + num).slice(-n);
}

export function privacyPhone(phone) {
  if (!phone) return "-";
  let privacyPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  return privacyPhone;
}
export const isEmpty = val => {
  if (val === 0) return val;
  if (!val) return "-";
  return val;
};

export function filterText(val, list = [], props = {}) {
  let nProps = { value: "value", text: "text", ...props };
  let target = list.find(v => v[nProps.value] === val);
  if (target) {
    return target[nProps.text];
  }
  return "-";
}
