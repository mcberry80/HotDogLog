import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFirestore, collection, query, orderBy, onSnapshot} from 'firebase/firestore';
import { firebaseApp } from './firebase';
import Card from './Card';
import './HotDogList.css';

const db = getFirestore(firebaseApp);

function HotDogList({ user }) {
  const [hotdogs, setHotdogs] = useState([]);
  

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
          <Card key={hotdog.id} hotdog={hotdog} user={user} />
        ))}

    </div>
  );
}

HotDogList.propTypes = {
  user: PropTypes.object.isRequired,
};

export default HotDogList;
