import {useParams} from "react-router-dom";

function User() {
    let {userId} = useParams();
    return (
        <div>
            <h1>User Profile</h1>
            <p>User ID: {userId}</p>
        </div>
    )
}

export default User;