import { useState } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import "./TestUpDown.scss";

function TestUpDown(props) {
    const { testQuestions, selectedAnswers } = props; // lấy từ Test
    const [upDown, setUpDown] = useState(false);

    const handleUpDown = () => {
        setUpDown(!upDown);
    }

    const handleScroll = (e, questionNumber) => {
        e.preventDefault();
        const element = document.getElementById(`question-${questionNumber}`); //cuộn đến phần tử có id tương ứng bằng cách sử dụng scrollIntoView
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            {upDown ? (
                <>
                    <div className="test-up-down__up">
                        <div className="slide-top">
                            <DownOutlined onClick={handleUpDown} />
                            <div className="test-up-down__display">
                                {testQuestions.map((_, index) => (
                                    <div key={index} className="test-up-down__display--block"> {/* key là index, câu là index + 1 (xem bên Test) */}
                                        <a
                                            href={`#question-${index + 1}`}
                                            onClick={(e) => handleScroll(e, index + 1)}
                                            className={selectedAnswers[index].answerUser !== null ? "test-up-down__display--active" : ""}
                                        >
                                            {index + 1}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="test-up-down__down">
                        <div className="slide-bottom">
                            <UpOutlined onClick={handleUpDown} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default TestUpDown;