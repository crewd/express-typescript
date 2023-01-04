export type KakaoToken = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  id_token: string;
};

export type KakaoSignUpData = {
  email: string;
  name: string;
  age: number;
  kakaoUid: string;
};
