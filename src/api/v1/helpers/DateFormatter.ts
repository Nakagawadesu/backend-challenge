// receive a Unix Epoch and return a ISO-8601 string

import { emailRegex } from "./Regexes";

class DateFormatter {
  static dateFromUnixEpoch(unixEpoch: number): string {
    return new Date(unixEpoch).toISOString();
  }

  static obfuscator = (email: string): string => {
    if (RegExp(emailRegex).test(email) === false) {
      return "invalidEmailFormat";
    }
    const [user, domain] = email.split("@");
    const userLength = user.length;
    if (userLength <= 2) return email;
    const obfuscatedEmail = `${user.slice(0, 2)}${"*".repeat(
      userLength
    )}@${domain}`;

    return obfuscatedEmail;
  };

  static isNiucoDomain = (email: string): boolean => {
    const [, domain] = email.split("@");
    return domain === "niuco.com.br";
  };

  static formatEmail = (email: string): string => {
    if (DateFormatter.isNiucoDomain(email)) {
      return email;
    }
    return DateFormatter.obfuscator(email);
  };
}

export default DateFormatter;
