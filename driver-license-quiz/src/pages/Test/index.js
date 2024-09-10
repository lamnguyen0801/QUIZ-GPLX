import { Form, Tag } from "antd";
import { useEffect, useState } from "react";
import { getListQuestion } from "../../services/questionService";
import { useLocation, useNavigate } from "react-router-dom";
import "./Test.scss";
import { getCookie } from "../../helpers/cookie";
import { createAnswer } from "../../services/testService";
import TestUpDown from "../../components/TestUpDown";

function Test() {
    const location = useLocation();
    const { numberQuestion } = location.state || {}; // nhận từ Topics

    const [dataListQuestion, setDataListQuestion] = useState([]); // tất cả questions
    const [testQuestions, setTestQuestions] = useState([]); // số lượng câu questions trong bài test
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getListQuestion();
            setDataListQuestion(response);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            if (dataListQuestion.length > 0) { // đợi dataListQuestion đc fetch xong
                // lọc question ngẫu nhiên
                let result = [];
                for (let i = 0; i < numberQuestion; i++) {
                    const randomIndex = Math.floor(Math.random() * dataListQuestion.length);
                    const question = dataListQuestion[randomIndex];
                    result.push(question);
                }

                // nếu có hình ảnh
                result = await Promise.all(result.map(async (item) => {
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
                setTestQuestions(result);
                setSelectedAnswers(Array(result.length).fill({ questionId: null, answerUser: null })); //tránh lỗi truy cập vào các giá trị undefined (với các key tự đặt questionId: id câu hỏi, answerUser: câu trả lời (= indexAns))
            }
        }
        fetchApi();
    }, [numberQuestion, dataListQuestion]); // render lại khi numberQuestion thay đổi hoặc dataListQuestion thay đổi (do fetch chưa xong của dataListQuestion)

    const handleAns = (index, answerUser, questionId) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[index] = { 
            questionId: questionId, 
            answerUser: answerUser
        }; // Đặt đáp án (answerUser) đã chọn cho câu hỏi hiện tại (index)
        setSelectedAnswers(newSelectedAnswers); // Xét lại mảng với từng câu đc chọn
    };

    const handleSubmit = async () => {
        const options = {
            userId: parseInt(getCookie("id")),
            answerQuestion: selectedAnswers
        }
        const response = await createAnswer(options);
        if(response) {
            navigate(`/result/${response.id}`);
        }
    }    

    return (
        <>
            <div className="test">
                <h2 className="test__title">Bài Test ngẫu nhiên</h2>
                <div>
                    <Form onFinish={handleSubmit}>
                        {testQuestions.map((item, index) => (
                            <div key={index} className="quiz-item" id={`question-${index + 1}`} > {/* đặt id cho là duy nhất để liên kết khi scroll bên TestUpDown*/}
                                <div className="quiz-item__question"> Câu {index + 1}: {item.question}</div>
                                {item.image && (
                                    <div className="quiz-item__image">
                                        <img src={item.image} alt={"Ảnh topic " + item.topicId} />
                                    </div>
                                )}
                                {item.answer.map((itemAns, indexAns) => {
                                    let color = selectedAnswers[index].answerUser === indexAns ? "orange" : "";

                                    return (
                                        <div key={indexAns} className="quiz-item__answer">
                                            <Form.Item
                                                style={{ marginBottom: "3px" }} // margin-bottom cho các formItem 
                                                name={item.id}
                                            >
                                                <Tag onClick={() => handleAns(index, indexAns, item.id)} color={color}>
                                                    {indexAns + 1}. {itemAns}
                                                </Tag>
                                            </Form.Item>
                                        </div>
                                    )
                                })}
                            </div >
                        ))}
                        <div className="test__submit">
                            <button type="submit">Nộp bài</button>
                        </div>
                    </Form>
                </div>

                <TestUpDown testQuestions={testQuestions} selectedAnswers={selectedAnswers}/>
            </div>
        </>
    );
}

export default Test;