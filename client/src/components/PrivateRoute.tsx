import {useSelector} from "react-redux";
import {Outlet, Navigate} from "react-router-dom";

export default function PrivateRoute() {
    const currentUser = useSelector((state: any) => state.user.currentUser);
    console.log("Current user in private route :", currentUser);
    return currentUser ? <Outlet/> : <Navigate to={'/sign-in'}/>;
}

