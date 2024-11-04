import chalk from "chalk";

export const themes = {
  error: chalk.red,
  success: chalk.green,
  warning: chalk.yellow,
  info: chalk.blue,
};

const log = (
  theme: "error" | "success" | "warning" | "info",
  ...data: any[]
) => {
  console.log(themes[theme](...data));
};

class Logger {
  static error = (...data: any[]) => log("error", "x " + [...data]);
  static success = (...data: any[]) => log("success", "✓ " + [...data]);
  static warning = (...data: any[]) => log("warning", "! " + [...data]);
  static info = (...data: any[]) => log("info", "ⓘ " + [...data]);
  static group = (...data: any[]) =>
    console.group(chalk.bgBlueBright.black(...data));
  static groupEnd = () => console.groupEnd();
}

export default Logger;
