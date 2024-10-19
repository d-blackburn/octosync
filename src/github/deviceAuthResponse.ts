export type DeviceAuthResponse = {
  device_code: string;
  expires_in: number;
  interval: number;
  user_code: string;
  verification_uri: string;
};

export const deviceAuthResponseInitialState: DeviceAuthResponse = {
  device_code: '-',
  expires_in: 0,
  interval: 0,
  user_code: '-',
  verification_uri: '-',
};
