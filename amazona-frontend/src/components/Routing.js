import { useSelector } from "react-redux"
import { Redirect, Route } from "react-router-dom";

const Routing = ({ path, component }) => {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    return (
        userInfo ? (
            <Route path={path} component={component} />
        ): (
            <Redirect to='/login' />

        )

    )
}

export default Routing
