import axios from 'axios';
import { safeStorage } from 'electron';
import keytar from 'keytar';
import { DeviceAuthResponse } from './deviceAuthResponse';

export async function retrieveAccessToken(
  clientId: string,
  deviceAuth: DeviceAuthResponse,
) {
  try {
    const startTime = Date.now();

    const requestAccessToken = async () => {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          device_code: deviceAuth.device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          code: deviceAuth.user_code,
        },
      );
      return response.data;
    };

    let response: URLSearchParams;

    do {
      response = new URLSearchParams(await requestAccessToken());
      await new Promise((resolve) => {
        setTimeout(resolve, deviceAuth.interval * 1000);
      });
    } while (
      !response.has('access_token') &&
      Date.now() - startTime < deviceAuth.expires_in * 1000
    );

    if (response.has('access_token')) {
      // Used ! as we check if response.has
      const encryptedToken = safeStorage.encryptString(
        response.get('access_token')!,
      );

      await keytar.setPassword(
        'octosync',
        'github-token',
        encryptedToken.toString('base64'),
      );
    } else {
      console.error('Failed to get access token within time limit.');
      // ... send an error message to the renderer process
    }
  } catch (error) {
    console.error('Error getting access token:', error);
    // ... handle the error
  }
}
