import { Outlet, useOutletContext } from "react-router-dom";

function UserLayout() {
    // OutletContext
    const context = useOutletContext();
    // 사용자 정보 저장 함수
    const setUser = context.setUser;

    return (
        <div>
            <Outlet context={{ setUser }} />
        </div>
    )
};

export default UserLayout;