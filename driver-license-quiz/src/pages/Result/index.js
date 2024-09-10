import { useState, useEffect } from "react";
import { getAnswerById } from "../../services/answerService";
import { useParams } from "react-router-dom";
import { getListQuestion } from "../../services/questionService";
import { Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import "./Result.scss";

function Result() {
    const [dataResult, setDataResult] = useState([]);
    const params = useParams();

    useEffect(() => {
        const fetchApi = async () => {
            const dataAnswers = await getAnswerById(params.id);
            const dataQuestions = await getListQuestion();

            let finalResult = [];
            for (let i = 0; i < dataAnswers.answerQuestion.length; i++) {
                const question = dataQuestions.find(item => item.id === dataAnswers.answerQuestion[i].questionId);
                const answerUser = dataAnswers.answerQuestion[i];

                if (question) {
                    finalResult.push({
                        ...answerUser,
                        ...question
                    });
                }
            }

            finalResult = await Promise.all(finalResult.map(async (item) => {
                if (item.image) {
                    const image = await import(`../../assets/images/${item.image}`);
                    return {
                        ...item,
                        image: image.default
                    };
                } else {
                    return {
                        ...item
                    };
                }

            }));
            setDataResult(finalResult);
        };
        fetchApi();
    }, [params.id]);

    const correctAnswer = dataResult.filter(item => item.answerUser === parseInt(item.correctAnswer)).length;
    const incorrectAnswer = dataResult.length - correctAnswer;
    const percentCorrect = (correctAnswer * 100 / dataResult.length).toFixed(2);

    return (
        <>
            <div className="result">
                <div className="result-header">
                    <h2 className="result-header__title">Kết quả</h2>
                    <div className="result-header__right-wrong">
                        <span className="result-header__right-wrong--correct">Số câu đúng: {correctAnswer}</span>
                        <span className="result-header__right-wrong--incorrect">Số câu sai: {incorrectAnswer}</span>
                        <span className="result-header__right-wrong--percent">Tỉ lệ đúng: {percentCorrect}%</span>
                    </div>
                </div>

                {dataResult.map((item, index) => (
                    <div key={index} className="quiz-item">
                        <div className="quiz-item__question"> Câu {index + 1}: {item.question}</div>
                        {item.image && (
                            <>
                                <div className="quiz-item__image">
                                    <img src={item.image} alt={"Ảnh topic " + item.topicId} />
                                </div>
                            </>
                        )}
                        {item.answer.map((itemAns, indexAns) => {
                            let icon = null;
                            let color = "";

                            // câu trả lời user
                            if (item.answerUser === indexAns) {
                                icon = <CloseCircleOutlined />;
                                color = "error";
                            }
                            // Đáp án đúng (đè lên đáp án người dùng)
                            if (parseInt(item.correctAnswer) === indexAns) {
                                icon = <CheckCircleOutlined />;
                                color = "success";
                            }

                            return (
                                <div key={indexAns} className="quiz-item__answer">
                                    <Tag icon={icon} color={color}>
                                        {indexAns + 1}. {itemAns}
                                    </Tag>
                                </div>
                            )
                        })}

                        <div className="quiz-item__btn">
                            Giải thích đáp án: {item.explainAnswer}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Result;