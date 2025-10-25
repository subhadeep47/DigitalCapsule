import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher";

const EXCLUDED_PATHS = [
  '/',
  '/privacy',
  '/help',
  '/terms',
  '/auth/*'
];

const AllRouteExecution = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn) || localStorage.getItem("isLoggedIn");

  const shouldExclude = EXCLUDED_PATHS.some(pattern => matchPath(pattern, location.pathname));

  useEffect(() => {
    if (!shouldExclude) {
      if (!isLoggedIn) {
        alert('You are not signed in, please sign in to access the application!');
        navigate('/auth');
      } else {
        dispatchAction(dispatch, ACTION_TYPES.LOGIN);
      }
    }
  }, [location.pathname, isLoggedIn, dispatch, navigate, shouldExclude]);

  return <>{children}</>;
};

export default AllRouteExecution;
