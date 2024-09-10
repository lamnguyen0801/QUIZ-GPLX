import { deleteAllCookies } from "../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import { useEffect } from "react";

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    deleteAllCookies();

    // navigate thì sd useEffect và sd useEffect có [] để chỉ redirect 1 lần
    useEffect(() => {
        dispatch(checkLogin(false));
        navigate("/");
        // eslint-disable-next-line
    }, [])

    return (
        <></>
    );
}

export default Logout;