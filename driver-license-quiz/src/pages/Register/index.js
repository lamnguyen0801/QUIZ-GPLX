import { Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "../Login/LoginRegister.scss";
import { checkExists, register } from "../../services/userService";
import { generateToken } from "../../helpers/generateToken";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const rules = [
        {
            required: true,
            message: 'Bắt buộc!',
        },
    ]
    // sử dụng localStorage để lưu trữ giá trị id qua các lần tải lại trang (nếu chỉ dựa vào localStorage để lưu trữ id, giá trị id chỉ được duy trì trên máy của người dùng hiện tại. Nếu trang được chia sẻ hoặc người dùng mới truy cập vào trang, giá trị id sẽ không được đồng bộ, và có thể gây ra vấn đề trùng lặp hoặc không chính xác.)
    // let id = localStorage.getItem('id') ? parseInt(localStorage.getItem('id')) : 0;
    const handleSubmit = async (e) => {
        const { fullName, email, password } = e;
        const checkExistsEmail = await checkExists("email", email);
        if (checkExistsEmail.length > 0) {
            messageApi.error('Email đã tồn tại!', 4);
            // nếu email đã tồn tại thì chỉ reset trường email 
            form.setFieldsValue({
                email: ''
            });
        } else {
            // localStorage.setItem('id', id);
            // Không cần lấy lại id từ localStorage chỗ này nữa vì giá trị id đã được cập nhật và không thay đổi.
            const options = {
                fullName: fullName,
                email: email,
                password: password,
                token: generateToken()
            }
            
            const response = await register(options);
            if(response) {
                navigate("/login");
            } else {
                messageApi.error('Đăng ký không thành công!', 4);
            }
        }
    }

    return (
        <>
            {contextHolder}
            <div className="login-register">
                <h2 className="login-register__title">Đăng ký tài khoản</h2>
                <Form className="login-register__form" onFinish={handleSubmit} form={form}>
                    <Form.Item rules={rules} name="fullName">
                        <Input type="text" placeholder="Nhập họ và tên" size="large" />
                    </Form.Item>
                    <Form.Item rules={rules} name="email">
                        <Input type="email" placeholder="Nhập email" size="large" />
                    </Form.Item>
                    <Form.Item rules={rules} name="password">
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            placeholder="Nhập mật khẩu" size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <button type="submit" className="btn btn--one">
                            Đăng ký
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default Register;