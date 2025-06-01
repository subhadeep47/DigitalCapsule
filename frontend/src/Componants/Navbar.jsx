import { Link, useNavigate } from "react-router-dom";
import api from "../Utils/api";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn) || localStorage.getItem('isLoggedIn');

  const handleLogout = () => {
    api.post('/auth/logout').then(res => {
      dispatchAction(dispatch, ACTION_TYPES.LOGOUT);
      navigate('/');
    }).catch(err => {
      console.log(err);
      window.alert('Not able to logged out due to technical issues!');
    });    
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md w-full">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <Link to="/" className="text-lg font-bold">Capsule App</Link>

        <div>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
              <Link to="/create" className="mr-4">Create Capsule</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="mr-4">Login</Link>
              <Link to="/auth?register=true" className="bg-green-500 px-3 py-1 rounded">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
