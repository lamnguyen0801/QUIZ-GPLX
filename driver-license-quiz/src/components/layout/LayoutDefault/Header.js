import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo-gplx.png";
import { HomeOutlined, AppstoreAddOutlined, HistoryOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { getCookie } from "../../../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkLogin } from "../../../actions/login";
import { Dropdown } from "antd";

function Header() {
    // Sử dụng Redux: Nếu bạn muốn quản lý trạng thái đăng nhập một cách trung tâm và cần sử dụng thông tin này để điều hướng và logic khác trong ứng dụng, chỉ lưu trạng thái trong bộ nhớ của trình duyệt trong phiên hiện tại. (sd cập nhật state header sau khi login và logout)
    // Sử dụng Cookie/Local Storage: Nếu bạn muốn kiểm tra trạng thái đăng nhập nhanh chóng mà không cần quản lý trạng thái qua Redux, hoặc nếu bạn cần giữ trạng thái đăng nhập qua các lần tải lại trang (do token được lưu vào cookie)
    // const token = getCookie("token");
    // const isLogin = useSelector(state => state.loginReducer);

    const [isTokenPresent, setIsTokenPresent] = useState(false);
    const reduxState = useSelector(state => state.loginReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = getCookie("token");
        setIsTokenPresent(!!token); //xác định token có tồn tại không

        // Nếu có token trong cookie nhưng Redux không phản ánh điều đó, thì cập nhật Redux với dispatch(checkLogin(true)). Nếu không có token trong cookie nhưng Redux vẫn đánh dấu trạng thái đăng nhập, thì cập nhật Redux với dispatch(checkLogin(false)).
        // TH không có cả token và reduxState => không có hành động nào được thực hiện. Điều này có thể là trạng thái mặc định của ứng dụng khi người dùng chưa đăng nhập.
        // TH có cả 2 sẽ không kích hoạt bất kỳ hành động nào trong đoạn code hiện tại => cho thấy người dùng đang ở trạng thái đăng nhập. Do đó, không cần phải cập nhật lại Redux store hoặc thực hiện thêm bất kỳ hành động nào.
        if (token && !reduxState) {
            dispatch(checkLogin(true));
        } else if (!token && reduxState) {
            dispatch(checkLogin(false));
        }
    }, [dispatch, reduxState]);

    const isLogin = reduxState || isTokenPresent;

    //phần mobi
    const items = [
        {
            label: <NavLink to="/">
                <HomeOutlined className="layout-default__menu--icon" />
                <span>Trang chủ</span>
            </NavLink>,
            key: '1',
        },
        {
            label: <NavLink to="/topics">
                <AppstoreAddOutlined className="layout-default__menu--icon" />
                <span>Chủ đề và test</span>
            </NavLink>,
            key: '2',
        },
        {
            label: <NavLink to="/answers">
                <HistoryOutlined className="layout-default__menu--icon" />
                <span>Lịch sử bài làm</span>
            </NavLink>,
            key: '3',
        },
        {
            type: 'divider',
        },
        {
            label: <NavLink to="/logout">Đăng xuất</NavLink>,
            key: '4',
        }
    ]

    return (
        <>
            <header className="layout-default__header">
                <div className="container">
                    <div className="layout-default__logo">
                        <Link to="/">
                            <img src={logo} alt="Logo cho bài quiz GPLX" />
                        </Link>
                    </div>

                    {isLogin && (
                        <>
                            <div className="layout-default__mobi">
                                <Dropdown
                                    menu={{
                                        items,
                                    }}
                                    trigger={['click']}
                                >
                                    <UnorderedListOutlined />
                                </Dropdown>
                            </div>
                        </>
                    )}

                    <div className="layout-default__menu">
                        {
                            (isLogin) ? (
                                <>
                                    <ul>
                                        <li>
                                            <NavLink to="/">
                                                <HomeOutlined className="layout-default__menu--icon" />
                                                <span>Trang chủ</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/topics">
                                                <AppstoreAddOutlined className="layout-default__menu--icon" />
                                                <span>Chủ đề và test</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/answers">
                                                <HistoryOutlined className="layout-default__menu--icon" />
                                                <span>Lịch sử bài làm</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </div>

                    <div className="layout-default__account">
                        {
                            (isLogin) ? (
                                <>
                                    <NavLink to="/logout" className="layout-default__account--logout">Đăng xuất</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" className="layout-default__account--login">Đăng nhập</NavLink>
                                    <NavLink to="/register" className="layout-default__account--register">Đăng ký</NavLink>
                                </>
                            )
                        }
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;