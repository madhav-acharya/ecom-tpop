import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../app/api/authAPI";

export const AuthRoute = ({ children }) => {
    const { data: user, isSuccess } = useGetCurrentUserQuery();

    if (isSuccess && user?.user?.role?.toLowerCase() === "customer") {
        console.log("you are customer");
        return <Navigate to="/" />;
    }

    return children ? children : <Outlet />;
};
