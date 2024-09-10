import { get, post } from "../utils/request";

export const loginByEmail = async (email, password) => {
    const result = await get(`user?email=${email}&password=${password}`);
    return result;
}

export const loginByFullName = async (fullName, password) => {
    const result = await get(`user?fullName=${fullName}&password=${password}`);
    return result;
}

export const register = async (options) => {
    const result = await post(`user`, options);
    return result;
}

export const checkExists = async (key, value) => {
    const result = await get(`user?${key}=${value}`);
    return result;
}




