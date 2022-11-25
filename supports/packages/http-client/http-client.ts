import axios, { AxiosRequestConfig } from 'axios';

//using func to avoid sharing instance between drivers
function createHttpClient(configs?: AxiosRequestConfig) {
    const axiosInstance = axios.create({
        ...configs,
        headers: {
            'Content-Type': 'application/json',
            ...configs?.headers,
        },
    });

    return axiosInstance;
}

export default createHttpClient;
