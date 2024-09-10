import { Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "./LoginRegister.scss";
import { loginByEmail, loginByFullName } from "../../services/userService";
import { setCookie } from "../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";

function Login() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    const rules = [
        {
            required: true,
            message: 'Bắt buộc!',
        },
    ]

    const handleSubmit = async (e) => {
        let fullName, email;
        const password = e.password;
        let response = "";
        if (e.fullNameOrEmail.includes("@")) {
            email = e.fullNameOrEmail;
            response = await loginByEmail(email, password);
        } else {
            fullName = e.fullNameOrEmail;
            response = await loginByFullName(fullName, password);
        }
        
        if (response.length > 0) {
            setCookie("id", response[0].id, 1);
            setCookie("fullName", response[0].fullName, 1);
            setCookie("email", response[0].email, 1);
            setCookie("token", response[0].token, 1);

            dispatch(checkLogin(true));
            navigate("/");
        } else {
            messageApi.error('Sai tài khoản hoặc mật khẩu!', 4);
        }
    }

    return (
        <>
            {contextHolder}        
            <div className="login-register">
                <h2 className="login-register__title">Đăng nhập</h2>
                <Form className="login-register__form" onFinish={handleSubmit}>
                    <Form.Item rules={rules} name="fullNameOrEmail">
                        <Input type="text" placeholder="Nhập họ tên hoặc email" size="large" />
                    </Form.Item>
                    <Form.Item rules={rules} name="password">
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            placeholder="Nhập mật khẩu" size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <button type="submit" className="btn btn--one">
                            Đăng nhập
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default Login;