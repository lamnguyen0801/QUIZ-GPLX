import { get } from "../utils/request";
import { getCookie } from "../helpers/cookie";

export const getAnswerById = async (id) => {
    const result = await get(`answers/${id}`);
    return result;
}

export const getAnswerByUserId = async () => {
    const userId = getCookie("id");
    const result = await get(`answers?userId=${userId}`);
    return result;
}