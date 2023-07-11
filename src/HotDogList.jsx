import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseApp } from './firebase';

function HotDogList({ user }) {
  const [hotdogs, setHotdogs] = useState([]);

  useEffect(() => {
    const db = getFirestore(firebaseApp);

    const hotdogsQuery = query(collection(db, 'hotdogs'), orderBy('createdAt', 'desc'));
    const unsubscribeHotdogs = onSnapshot(hotdogsQuery, (snapshot) => {
      const hotdogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotdogs(hotdogsData);
    });

    const reactionsQuery = query(collection(db, 'reactions'));
    const unsubscribeReactions = onSnapshot(reactionsQuery, (snapshot) => {
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

    return () => {
      unsubscribeHotdogs();
      unsubscribeReactions();
    };
  }, []);

  const handleReaction = async (hotdogId, reactionType) => {
    console.log("Handling " + reactionType + " for Hotdog:" + hotdogId + "User: " + user.uid);

    const db = getFirestore(firebaseApp);
    const reactionRef = doc(db, 'reactions', `${hotdogId}_${user.uid}`);
    console.log(reactionRef);
    const reactionDoc = await getDoc(reactionRef);
    console.log(reactionDoc);
    
    if (reactionDoc.exists()) {
      console.log("Reaction Doc exists");
      const reactionData = reactionDoc.data();

      if (reactionData.reactionType === reactionType) {
        console.log("Deleting doc");
        deleteDoc(reactionRef);
        return;
      }
    }

    console.log("No reaction doc exists");
    console.log("Setting doc");
    await setDoc(reactionRef,{
      hotdogId,
      uid: user.uid,
      reactionType
    });
  }


  const countReaction = (hotdogs, hotdogId, reactionType) => {
    return hotdogs.reduce((count, hotdog) => {
      if (
        hotdog.id === hotdogId &&
        hotdog.reactionCounts &&
        hotdog.reactionCounts[reactionType]
      ) {
        return hotdog.reactionCounts[reactionType] + 1;
      }
      return count;
    }, 0);
  };

  const getReactionCount = (hotdogId, reactionType) => {
    const reactionCount = hotdogs.reduce((count, hotdog) => {
      if (
        hotdog.id === hotdogId &&
        hotdog.reactionCounts &&
        hotdog.reactionCounts[reactionType]
      ) {
        return hotdog.reactionCounts[reactionType];
      }
      return count;
    }, 0);

    return reactionCount;
  };

  const getUserReaction = async (hotdogId) => {
    const hotdog = hotdogs.find((hotdog) => hotdog.id === hotdogId);
    if (!hotdog) return null;

    const db = getFirestore(firebaseApp);
    const reactionRef = doc(db, 'reactions', `${hotdogId}_${user.uid}`);
    const reactionDoc = await getDoc(reactionRef);

    if (reactionDoc.exists()) {
      return reactionDoc.data().reactionType;
    } else {
      return null;
    }
  };

  const handleDelete = (hotdogId) => {
    const db = getFirestore(firebaseApp);
    const hotdogRef = doc(db, 'hotdogs', hotdogId);

    deleteDoc(hotdogRef)
      .then(() => {
        console.log('Hot dog deleted successfully');
      })
      .catch((error) => {
        console.log('Error deleting hot dog:', error);
      });
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
                    user &&
                    hotdog.id &&
                    getUserReaction(hotdog.id).then((reactionType) => reactionType === 'like')
                      ? 'liked'
                      : ''
                  }`}
                  onClick={() => handleReaction(hotdog.id, 'like')}
                >
                  <span role="img" aria-label="Like">
                    🌭
                  </span>
                  <span className="reaction-count">{getReactionCount(hotdog.id, 'like')}</span>
                </button>
                <button
                  className={`reaction-button ${
                    user &&
                    hotdog.id &&
                    getUserReaction(hotdog.id).then((reactionType) => reactionType === 'dislike')
                      ? 'disliked'
                      : ''
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
            {hotdog.uid === user.uid && (
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
