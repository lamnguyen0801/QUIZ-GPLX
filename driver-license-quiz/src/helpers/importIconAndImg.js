/// chưa làm được (do hiện lỗi Cannot find module '../../assets/images/....jpg')
export const importIconsForTopics = async (response, path) => {
    const result = await Promise.all(
        response.map(async (item) => {
            const icon = await import(`${path}/topic-${item.id}.jpg`);
            return {
                ...item,
                icon: icon.default,
            };
        })
    );
    return result;
};

// const result = await importIconsForTopics(response, "../../assets/images");