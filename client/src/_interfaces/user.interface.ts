export declare type UserProps = {
  uid?: number;
  email: string;
  password: string;
};

export type FetchedUser = {
  uid: number;
} & UserProps;

export class User implements UserProps {
  email: string = "";
  password: string = "";
};