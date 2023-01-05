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

export type KakaoIdToken = {
  aud: string;
  sub: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
};

export type Jwk = {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
};
