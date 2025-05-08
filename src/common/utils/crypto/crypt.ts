import * as CryptoJS from "crypto-js"

export const crypt = (phone: string): string => {
    return CryptoJS.AES.encrypt(phone, process.env.CRYPTO_KEY as string).toString();
}

export const decrypt = (phone: string): string => {
    return CryptoJS.AES.decrypt(phone, process.env.CRYPTO_KEY as string).toString(CryptoJS.enc.Utf8);
}