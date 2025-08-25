export interface ISendOtp {
    email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}