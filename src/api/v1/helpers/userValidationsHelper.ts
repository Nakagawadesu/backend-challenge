import { UserFromDatabase } from "../types/User";

const PayerDictionary: { [key: string]: boolean } = {
  viewer: false,
  system: false,
  editor: true,
  admin: true,
};

// export interface UserFromDatabase {
//     id: string;
//     name: string;
//     email: string;
//     status: string;
//     role: string;
//     last_activity: number;
//   }
//Inactive user are never payers before all

const isUserEnabled = (user: UserFromDatabase) => {
  let isEnabled = true;
  if (user.status === "disabled") {
    isEnabled = false;
  }
  return isEnabled;
};

const isUserPayerByRole = (user: UserFromDatabase) => {
  let isPayer = false;
  return (isPayer = PayerDictionary[user.role]);
};

const isUserPayer = (user: UserFromDatabase) => {
  return isUserEnabled(user) && isUserPayerByRole(user);
};

export { isUserEnabled, isUserPayerByRole, isUserPayer };
