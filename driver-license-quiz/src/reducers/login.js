const loginReducer = (state = false, action) => {
    // console.log(state,action); 
    // nếu log ra false {type: '@@redux/INITr.j.j.j.i.2'} là do redux store đc khởi tạo nên để log ra state, action mong muốn thì cần login lại
    switch (action.type) {
        case "CHECK_LOGIN":
            return action.status;
        default:
            return state;
    }
}

export default loginReducer;