import { get } from "../utils/request";

export const getListQuestion = async () => {
    const result = await get("questions");
    return result;
}

export const getQuestionByTopicId = async (topicId) => {
    const result = await get(`questions?topicId=${topicId}`);
    return result;
}
