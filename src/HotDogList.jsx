import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { firestore } from './firebase';
import './HotDogList.css';

function HotDogList({ user }) {
  const [hotdogs, setHotdogs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('hotdogs')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const hotdogsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotdogs(hotdogsData);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore.collection('reactions').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const reactionData = change.doc.data();
        const hotdogId = reactionData.hotdogId;
        const reactionType = reactionData.reactionType;

        setHotdogs((prevHotdogs) =>
          prevHotdogs.map((hotdog) => {
            if (hotdog.id === hotdogId) {
              const updatedReactionCounts = {
                ...hotdog.reactionCounts,
                [reactionType]: countReaction(prevHotdogs, hotdogId, reactionType),
              };
              return {
                ...hotdog,
                reactionCounts: updatedReactionCounts,
              };
            }
            return hotdog;
          })
        );
      });
    });

    return () => unsubscribe();
  }, []);

  const handleReaction = (hotdogId, reactionType) => {
    const reactionRef = firestore
      .collection('reactions')
      .doc(`${hotdogId}_${user.uid}`);

    reactionRef.get().then((doc) => {
      if (doc.exists) {
        const reactionData = doc.data();

        // User has already reacted to the post, remove the reaction
        if (reactionData.reactionType === reactionType) {
          reactionRef.delete();
          return;
        }
      }

      // Update the reaction or add a new reaction
      reactionRef.set({
        hotdogId,
        uid: user.uid,
        reactionType,
      });
    });
  };

  const countReaction = (hotdogs, hotdogId, reactionType) => {
    return hotdogs.reduce((count, hotdog) => {
      if (hotdog.id === hotdogId && hotdog.reactionCounts && hotdog.reactionCounts[reactionType]) {
        return hotdog.reactionCounts[reactionType] + 1;
      }
      return count;
    }, 1);
  };

  const getReactionCount = (hotdogId, reactionType) => {
    const reactionCount = hotdogs.reduce((count, hotdog) => {
      if (hotdog.id === hotdogId && hotdog.reactionCounts && hotdog.reactionCounts[reactionType]) {
        return hotdog.reactionCounts[reactionType];
      }
      return count;
    }, 0);

    return reactionCount;
  };

  const getUserReaction = (hotdogId) => {
    const reaction = hotdogs.find((hotdog) => hotdog.id === hotdogId);
    if (!reaction) return null;

    const userReactionRef = firestore.collection('reactions').doc(`${hotdogId}_${user.uid}`);
    return userReactionRef.get().then((doc) => {
      if (doc.exists) {
        const reactionData = doc.data();
        return reactionData.reactionType;
      }
      return null;
    });
  };

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
              {hotdog.imageUrl && (
                <img src={hotdog.imageUrl} alt="Hot Dog" style={{ maxWidth: 300 }} />
              )}
              <div className="reactions">
                <button
                  className={`reaction-button ${
                    (user && hotdog.id && getUserReaction(hotdog.id) === 'like') ? 'liked' : ''
                  }`}
                  onClick={() => handleReaction(hotdog.id, 'like')}
                >
                  <span role="img" aria-label="Like">
                    🌭
                  </span>
                  <span className="reaction-count">
                    {getReactionCount(hotdog.id, 'like')}
                  </span>
                </button>
                <button
                  className={`reaction-button ${
                    (user && hotdog.id && getUserReaction(hotdog.id) === 'dislike') ? 'disliked' : ''
                  }`}
                  onClick={() => handleReaction(hotdog.id, 'dislike')}
                >
                  <span role="img" aria-label="Dislike">
                    🤮
                  </span>
                  <span className="reaction-count">
                    {getReactionCount(hotdog.id, 'dislike')}
                  </span>
                </button>
              </div>
            </div>
            { (hotdog.uid === user.uid) && (
              <button className="delete-button" onClick={() => handleDelete(hotdog.id)}>
                Delete
              </button>
            )}
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
