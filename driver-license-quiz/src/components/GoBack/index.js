import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function GoBack() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/topics");
    }

    return (
        <>
            <button onClick={handleClick}><ArrowLeftOutlined /> Trở lại</button>
        </>
    );
}

export default GoBack;