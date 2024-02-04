import { useState, useEffect, useContext } from 'react';
import { getFirestore, collection, query, orderBy, onSnapshot} from 'firebase/firestore';
import { firebaseApp } from '../../firebase';
import Card from '../card/Card';
import AuthContext from '../../AuthContext';
import './HotDogList.css';

const db = getFirestore(firebaseApp);

function HotDogList() {
  const [hotdogs, setHotdogs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const hotdogsQuery = query(collection(db, 'hotdogs'), orderBy('createdAt', 'desc'));
    const unsubscribeHotdogs = onSnapshot(hotdogsQuery, (snapshot) => {
      const hotdogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setHotdogs(hotdogsData);
    });

    return () => {
      unsubscribeHotdogs();
    };
  }, []);

  return (
    <div className="hotdog-list">
      <h2>Hot Dogs</h2>

        {hotdogs.map((hotdog) => (
          <Card key={hotdog.id} hotdog={hotdog} />
        ))}

    </div>
  );
}


export default HotDogList;
