import {notifications} from "@mantine/notifications";

export class ApiError extends Error {
  errorCode: number;
  timestamp: string;

  constructor(errorCode: number, message: string, timestamp: string) {
    super(message);
    this.errorCode = errorCode;
    this.timestamp = timestamp;
    this.name = 'ApiError';

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
export async function handleResponse<TData = any>(response: Response): Promise<any> {
  const text: string = await response.text();
  let data = text && JSON.parse(text);

  if (!response.ok) {
    if (response.status === 403) {
      console.log("error 403 " + response.statusText, response);
      notifications.show({
        color: "red",
        position: "bottom-center",
        title: "Erreur de connexion",
        message: "You do not have permission to access this resource."
      })
    }
    if ([500].indexOf(response.status) !== -1) {
      console.log("error 500 " + response.statusText, response);
      notifications.show({
        color: "red",
        position: "bottom-center",
        title: "Erreur de connexion",
        message: `${(data && data.message) || response.statusText}`
      })
    }
    const errorCode = response.status;
    const errorMessage = (data && data.message) || response.statusText;
    const timestamp = new Date().toISOString();
    const error = new ApiError(errorCode, errorMessage, timestamp);
    return Promise.reject(error);
  }
  return data;
}
