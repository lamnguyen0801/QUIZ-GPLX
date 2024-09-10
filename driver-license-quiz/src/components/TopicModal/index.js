import { Input, Modal, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopicModal.scss";

function TopicModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numberQuestion, setNumberQuestion] = useState("");
    const [error, setError] = useState("");
    const { Text } = Typography;
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleNumberQues = (e) => {
        let number = e.target.value;

        // if (number <= 0) { // hiển thị error ngay khi nhập và thay đổi
        //     setError("Số lượng câu hỏi cần lớn hơn 0");
        // } else {
        //     setError("");
        // }
        setNumberQuestion(number);
    }

    const handleStartTest = () => {
        // hiển thị error sau khi ấn bắt đầu
        if (numberQuestion === "") {
            setError("Vui lòng nhập số lượng câu hỏi");
        } else if (numberQuestion <= 0) {
            setError("Số lượng câu hỏi cần lớn hơn 0");
        } else {
            navigate("/test", { state: { numberQuestion } });
        }
    };

    return (
        <>
            <button onClick={showModal} className="topic-modal__show-modal">
                <QuestionCircleOutlined style={{ fontSize: "18px" }} />
                <span className="topic-modal--text">Test</span>
            </button>
            <Modal
                title={<div className="topic-modal--title">BÀI TEST GPLX</div>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Input type="number" placeholder="Nhập số lượng câu hỏi" onChange={handleNumberQues} value={numberQuestion} />
                {error && <Text type="danger">{error}</Text>}

                <button className="topic-modal__start" onClick={handleStartTest}>Bắt đầu</button>
            </Modal>
        </>
    );
}

export default TopicModal;