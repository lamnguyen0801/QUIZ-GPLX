import HomeClass from "../../components/HomeClass";
import { getCookie } from "../../helpers/cookie";
import "./Home.scss";

function Home() {
    const token = getCookie("token");
    return (
        <>
            {/* do trong container có display flex nên bọc 2 component này lại trong thẻ div để tránh nằm ngang*/}
            <div className="home">
                <div className="home-content">
                    <h2 className="home-content__title">Chào mừng đến với trang web ôn thi trắc nghiệm giấy phép lái xe ô tô!</h2>
                    <p className="home-content__desc">Trang web của chúng tôi là công cụ hữu ích dành cho những ai đang chuẩn bị thi lấy giấy phép lái xe ô tô, đặc biệt là cho các hạng B1 và B2. Với bộ câu hỏi phong phú, được thiết kế dựa trên đề thi chính thức, chúng tôi giúp bạn làm quen với cấu trúc đề thi, nắm vững kiến thức luật giao thông và nâng cao kỹ năng lái xe an toàn.</p>
                    <p className="home-content__desc">Hãy bắt đầu hành trình của bạn cùng chúng tôi để tự tin bước vào kỳ thi và đạt được kết quả như mong muốn!</p>
                </div>

                {token && (
                    <>
                        <HomeClass />
                    </>
                )}
            </div>
        </>
    );
}

export default Home;