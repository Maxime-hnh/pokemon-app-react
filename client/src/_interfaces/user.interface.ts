export declare type UserProps = {
  id?: number;
  email: string;
  password: string;
};

export declare type UserSignupPros = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type FetchedUser = {
  id: number;
} & UserProps;

export class User implements UserProps {
  email: string = "";
  password: string = "";
};