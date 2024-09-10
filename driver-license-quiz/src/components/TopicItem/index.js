import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListQuestion, getQuestionByTopicId } from "../../services/questionService";
import "./TopicItem.scss";

function TopicItem(props) {
    const { item } = props;
    const [allNumberQuestion, setAllNumberQuestion] = useState(0);
    const [numberQuestion, setNumberQuestion] = useState(0);

    useEffect(() => {
        const fetchApi = async () => {
            const numberQues = await getQuestionByTopicId(item.id);
            const allNumberQues = await getListQuestion();
            setNumberQuestion(numberQues);
            setAllNumberQuestion(allNumberQues);
        };
        fetchApi();
    }, [item.id])

    return (
        <>
            <Link to={`/quiz/${item.id}`} className="topic-item">
                <div className="topic-item__right">
                    <div className="topic-item__image">
                        <img src={item.icon} alt={"icon " + item.name} />
                    </div>
                    <div className="topic-item__title">{item.name}</div>
                </div>
                <div className="topic-item__number">
                    {item.id === 1 ? (
                        <>
                            <span>{allNumberQuestion.length} câu</span>
                        </>
                    ) : (
                        <>
                            <span>{numberQuestion.length} câu</span>
                        </>
                    )}
                </div>
            </Link>
        </>
    );
}

export default TopicItem;