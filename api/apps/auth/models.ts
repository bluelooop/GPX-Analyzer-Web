export interface RouteProvider {
  name: string;
  consentUrl?: string;
}

export interface RouteProviderAccessToken {
  success: boolean;
  message: string;
  provider: string;
  tokens: {
    accessToken: string;
    type: string;
    expiresIn: number;
    expiresAt: number;
    refreshToken: string;
  };
}
