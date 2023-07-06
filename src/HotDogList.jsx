import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { firestore } from './firebase';
import './HotDogList.css'; // Import the CSS file for styling

function HotDogList({ user }) {
  const [hotdogs, setHotdogs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('hotdogs')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const hotdogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotdogs(hotdogs);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = (hotdogId) => {
    firestore.collection('hotdogs').doc(hotdogId).delete();
  };
  
  return (
    <div className="hotdog-list">
      <h2>Hot Dogs</h2>
      <ul>
        {hotdogs.map((hotdog) => (
          <li className="hotdog-item" key={hotdog.id}>
            <div className="hotdog-content">
              <p className="hotdog-date">{hotdog.date}</p>
              <p className="hotdog-notes">{hotdog.tastingNotes}</p>
              <p className="hotdog-user">@{hotdog.displayName}</p>
              {hotdog.imageUrl && <img src={hotdog.imageUrl} alt="Hot Dog" style={{ maxWidth: 300 }} />}
            </div>
            { (hotdog.uid == user.uid) && <button className="delete-button" onClick={() => handleDelete(hotdog.id)}>Delete</button> }
          </li>
        ))}
      </ul>
    </div>
  );
}

HotDogList.propTypes = {
  user: PropTypes.object.isRequired,
};

export default HotDogList;
