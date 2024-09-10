import { get } from "../utils/request";

export const getListClass = async () => {
    const result = await get("drivingLicenseClass");
    return result;
}