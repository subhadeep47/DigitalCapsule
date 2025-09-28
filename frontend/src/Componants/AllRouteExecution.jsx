import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher";

const AllRouteExecution = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn) || localStorage.getItem("isLoggedIn")

    const excludePath = ['/auth', '/']
    useEffect(() => {
        myFunctionToInvokeOnAllRoutes(); 
    }, []);

    const myFunctionToInvokeOnAllRoutes = () => {
        if(!excludePath.includes(location.pathname)){
            if(!isLoggedIn){
                alert('You are not signed in, please sign in to access the application!')
                navigate('/auth')
            } else {
                dispatchAction(dispatch, ACTION_TYPES.LOGIN)
            }
        }
    }

    return <>{children}</>;
}

export default AllRouteExecution;
