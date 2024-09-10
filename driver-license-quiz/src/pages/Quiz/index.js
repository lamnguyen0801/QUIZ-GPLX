import { useState, useEffect } from "react";
import { getListQuestion, getQuestionByTopicId } from "../../services/questionService"
import { useParams } from "react-router-dom";
import { getTopicById } from "../../services/topicService";
import { Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, UpCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import "./Quiz.scss";
import "animate.css";
import GoBack from "../../components/GoBack";

function Quiz() {
    const params = useParams();
    const [dataQuestion, setDataQuestion] = useState([]);
    const [dataTopic, setDataTopic] = useState([]);
    const [click, setClick] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    // Mảng selectedAnswer lưu trạng thái của đáp án đã chọn cho từng câu hỏi. Mỗi phần tử trong mảng đại diện cho đáp án đã chọn của một câu hỏi cụ thể. Nếu câu hỏi chưa được trả lời, phần tử đó sẽ là null.
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        // Lấy dữ liệu từ localStorage khi component khởi tạo từ đầu (để lấy các giá trị có sẵn trước đó nếu có)
        const storedSelectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers")) || [];
        const storedClick = JSON.parse(localStorage.getItem("click")) || [];
        const storedShowAll = JSON.parse(localStorage.getItem("showAll")) || false;
        setSelectedAnswers(storedSelectedAnswers);
        setClick(storedClick);
        setShowAll(storedShowAll);

        const fetchApi = async () => {
            const questions = (params.id > 1) ? (
                await getQuestionByTopicId(params.id)
            ) : (
                await getListQuestion()
            );

            const result = await Promise.all(questions.map(async (item) => {
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
            setDataQuestion(result);
            // setClick(Array(result.length).fill(false)); // khởi tạo mảng click toàn false
            // setSelectedAnswers(Array(result.length).fill(null)); // Khởi tạo mảng selectedAnswers toàn null tránh gtri undefined
            if (storedClick.length === 0) {
                setClick(Array(result.length).fill(false));
            }
            if (storedSelectedAnswers.length === 0) {
                setSelectedAnswers(Array(result.length).fill(null));
            }

        };
        fetchApi();
        // eslint-disable-next-line
    }, []);

    // Lưu trạng thái vào localStorage khi các trạng thái thay đổi
    useEffect(() => {
        localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
        localStorage.setItem("click", JSON.stringify(click));
        localStorage.setItem("showAll", JSON.stringify(showAll));
    }, [selectedAnswers, click, showAll]);

    useEffect(() => {
        const fetchApi = async () => {
            const topics = await getTopicById(params.id);
            setDataTopic(topics);
        };
        fetchApi();
        // eslint-disable-next-line
    }, []);

    const handleClick = (index) => {
        // Tạo mảng newClick là bản sao của click và chỉ thay đổi giá trị tại vị trí tương ứng thành true
        const newClick = [...click];
        newClick[index] = !newClick[index]
        setClick(newClick);
    }

    const handleAns = (index, indexAns) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[index] = indexAns; // Đặt đáp án (indexAns) đã chọn cho câu hỏi hiện tại (index)
        setSelectedAnswers(newSelectedAnswers); // Xét lại mảng với từng câu đc chọn
    };

    const handleDisplayAll = () => {
        setShowAll(!showAll);
        // console.log(showAll); false
        // xét !showAll mà ko phải showAll vì khi click, chạy hết handleDisplayAll thì showAll = !showAll
        // nếu xét showAll thì cho setShowAll phía sau đk if else
        if (!showAll) {
            const allCorrectAns = dataQuestion.map(item => (
                parseInt(item.correctAnswer)
            ))
            setSelectedAnswers(allCorrectAns); // Xét lại mảng với tất cả các câu và có gtri là đáp án đúng
            setClick(Array(click.length).fill(true));
        } else {
            setSelectedAnswers(Array(dataQuestion.length).fill(null));
            setClick(Array(click.length).fill(false));
        }
    }
    // console.log(showAll); true

    const handleReset = () => {
        setSelectedAnswers(Array(dataQuestion.length).fill(null)); // Khởi tạo mảng selectedAnswers toàn null
        setClick(Array(dataQuestion.length).fill(false)); // Khởi tạo mảng click toàn false
        setShowAll(false); // Đặt showAll về false
    };

    return (
        <>
            {/* do trong container có display flex nên bọc 2 component này lại trong thẻ div để tránh nằm ngang*/}
            <div className="quiz" id="top">
                <div className="quiz-back">
                    <GoBack />
                </div>

                <div className="quiz-header">
                    <h2 className="quiz-header__title">{dataTopic.name}</h2>
                    {/* <Input type="checkbox" size="large" onClick={handleDisplayAll} id="displayAll"></Input>
                    <label htmlFor="displayAll">Hiển thị tất cả câu trả lời đúng và phần giải thích</label> */}
                    <div className="quiz-header__check">
                        <input checked={showAll} type="checkbox" id="check" hidden onChange={handleDisplayAll} />
                        <label htmlFor="check" className="checkmark"></label>
                        <label htmlFor="check">Hiển thị tất cả câu trả lời đúng và phần giải thích</label>
                    </div>
                </div>

                {dataQuestion.length > 0 && dataQuestion.map((item, index) => (
                    <div key={index} className="quiz-item">
                        <div className="quiz-item__question"> Câu {index + 1}: {item.question}</div>
                        {item.image ? (
                            <>
                                <div className="quiz-item__image">
                                    <img src={item.image} alt={"Ảnh topic " + item.topicId} />
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                        {item.answer.map((itemAns, indexAns) => {
                            let icon = null;
                            let color = "";

                            if (selectedAnswers[index] === indexAns) {
                                if (parseInt(item.correctAnswer) === indexAns) {
                                    icon = <CheckCircleOutlined />;
                                    color = "success";
                                } else {
                                    icon = <CloseCircleOutlined />;
                                    color = "error";
                                }
                            }

                            return (
                                <div key={indexAns} className="quiz-item__answer">
                                    <Tag onClick={() => handleAns(index, indexAns)} icon={icon} color={color}>
                                        {indexAns + 1}. {itemAns}
                                    </Tag>
                                </div>
                            )
                        })}

                        <button onClick={() => handleClick(index)} className="quiz-item__btn">
                            Giải thích đáp án
                        </button>
                        {click[index] && (
                            <div className="animate__animated animate__fadeIn">
                                {item.explainAnswer}
                            </div>
                        )}
                    </div >
                ))}

                <a href="#top">
                    <ReloadOutlined className="quiz-fixed quiz-fixed--reset" onClick={handleReset}/>
                    <UpCircleOutlined className="quiz-fixed quiz-fixed--up" />
                </a> {/* thêm scroll-behavior: smooth vào file index.css để cuộn mượt hơn*/}
            </div >
        </>
    );
}

export default Quiz;
// Sử dụng onClick={handleClick} khi bạn không cần truyền tham số cho hàm hoặc không cần thực hiện logic bổ sung trước khi gọi hàm. Đây là cách viết tối ưu và sạch sẽ hơn.
// viết onClick={handleClick(someParameter)}, hàm handleClick sẽ được gọi ngay lập tức khi component render, không phải khi nhấn nút, điều này không đúng với ý định. (TH có parameter)
// Sử dụng onClick={() => handleClick(someParameter)} khi bạn cần truyền tham số vào handleClick hoặc cần thực hiện một số xử lý trước khi gọi hàm.