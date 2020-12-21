// http://emailregex.com/
export const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const phone = /^(1[3-9]{1}\d{9}$)|(^09\d{8}$)$/;
export const longitude = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/;
export const latitude = /^(\-|\+)?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/;
export const lowOrInt = /^[a-z0-9]{8}$/;
export const twphone = /^09\d{8}$/;
// export const twphoneReg = /^([6,7,9](?:\d{7}|\d{8}|\d{10})$)|(0[6,7,9](?:\d{7}|\d{8}|\d{10}))$/
// 货币校验
export const money = /^\d+\.\d{2}$/;
