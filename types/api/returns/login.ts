import { ApiSuccess } from "./success";

export type ApiAuthorizedRedirect = {
  redirect_to: string;
  token: string;
};

export type ApiLoginSuccess = ApiSuccess & {
  user_id: number;
  username: string;
};
