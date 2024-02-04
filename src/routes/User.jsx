import {useParams} from "react-router-dom";
import { getFirestore, query, where, collection, getDocs} from "firebase/firestore";
import { firebaseApp } from "../firebase";
import Card from "../components/card/Card";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../AuthContext";


const db = getFirestore(firebaseApp);


function User() {

    const [hotdogs, setHotdogs] = useState([]);
    const { user } = useContext(AuthContext);
    console.log(user)
    let {userId} = useParams();

    useEffect(() => {
        async function fetchHotdogs() {
            const hotDogsRef = collection(db, 'hotdogs');
            const q = query(hotDogsRef, where('uid', '==', userId));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot.docs[0].data())
            /*const hotdogsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setHotdogs(hotdogsData);*/
        }
        fetchHotdogs();
    }, [userId]);

    return (
        <div>
            <h1>User Profile</h1>
            <p>User ID: {userId}</p>
            {
                hotdogs.map((hotdog) => (
                <Card key={hotdog.id} hotdog={hotdog} />
            ))}
        </div>

    )

}

export default User;
