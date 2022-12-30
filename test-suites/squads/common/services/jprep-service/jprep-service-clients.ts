import axios, { Method } from 'axios';

import { loadJprepKeyCloakConfiguration } from 'configurations/load-environment';
import CryptoJS from 'crypto-js';
import { keySecretJPREP } from 'test-suites/squads/common/constants/jprep';
import { PathnameSyncJPREP } from 'test-suites/squads/common/services/jprep-service/types';

export function httpClientUserKeyCloak(params: {
    method: Method;
    data?: any;
    token: string;
    userId?: string;
}) {
    const { method, data, token, userId = '' } = params;
    const config = loadJprepKeyCloakConfiguration(process.env.ENV);

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    return axios({
        method,
        data,
        headers,
        url: config.URL_USER + userId,
    });
}

export function httpClientSyncDataFromJPREPPartner(params: {
    method: Method;
    data: any;
    pathname: PathnameSyncJPREP;
}) {
    const { method, data, pathname } = params;
    const config = loadJprepKeyCloakConfiguration(process.env.ENV);

    const hmacDigest = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(JSON.stringify(data), keySecretJPREP)
    );

    const headers = {
        'Content-Type': 'application/json',
        'JPREP-Signature': hmacDigest,
    };

    return axios({
        headers: headers,
        url: config.URL_BASH_JPREP + pathname,
        method,
        data,
    });
}
