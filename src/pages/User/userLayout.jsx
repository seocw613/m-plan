import { useContext } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

function UserLayout() {
    const { setUser } = useContext(UserContext);

    return (
        <div>
            <Outlet context={{ setUser }} />
        </div>
    )
};

export default UserLayout;