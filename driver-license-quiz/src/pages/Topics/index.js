import { useState, useEffect } from "react";
import { getListTopic } from "../../services/topicService";
import TopicItem from "../../components/TopicItem";
import "./Topic.scss";
import TopicModal from "../../components/TopicModal";

function Topics() {
    const [listTopic, setListTopic] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getListTopic();
            // Promise.all nhận vào một mảng các Promise và trả về một Promise duy nhất. Promise này sẽ hoàn thành khi tất cả các Promise trong mảng hoàn thành, hoặc sẽ thất bại nếu một trong các Promise bị lỗi.
            // Mỗi Promise trong mảng là một lời gọi đến import để tải về hình ảnh tương ứng.
            const result = await Promise.all(response.map(async (item) => {
                const icon = await import(`../../assets/images/topic-${item.id}.jpg`);
                return {
                    ...item,
                    icon: icon.default
                };
            }));
            // console.log(result);
            setListTopic(result);
        };

        fetchApi();
    }, []);

    return (
        <>
            {/* do trong container có display flex nên bọc 2 component này lại trong thẻ div để tránh nằm ngang*/}
            <div className="topic">
                <div className="topic__header">
                    <h2 className="topic__header--list">Danh sách chủ đề</h2>
                    <TopicModal />
                </div>

                <div className="topic__list">
                    {listTopic.length > 0 && listTopic.map((item) => (
                        <div className="topic__item" key={item.id}>
                            <TopicItem key={item.id} item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Topics;