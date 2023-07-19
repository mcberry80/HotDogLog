import PropTypes from 'prop-types';
import { getFirestore,  deleteDoc, doc, collection, getDoc, query, getDocs, where, setDoc} from 'firebase/firestore';
import { firebaseApp } from './firebase';
import './Reactions.css';

const db = getFirestore(firebaseApp);

const Reactions = ({hotdog, user}) => {

    const getUserReaction = async () => {
 
        const hotdogRef = doc(db, 'hotdogs', hotdog.id);
        const reactionQuery = query(collection(hotdogRef, 'reactions'), where('uid', '==', user.uid));
        const reactionSnapshot = await getDocs(reactionQuery);
      
        if (!reactionSnapshot.empty) {
          const reactionDoc = reactionSnapshot.docs[0];
          return reactionDoc.data().reactionType;
        } else {
          return null;
        }
    };

    const handleReaction = async (reactionType) => {
      
        console.log(reactionType);
        const hotdogRef = doc(db, 'hotdogs', hotdog.id);
        const reactionsRef = collection(hotdogRef, 'reactions');
        const userReactionRef = doc(reactionsRef, `${hotdog.id}_${user.uid}`);
        
        const userReactionDoc = await getDoc(userReactionRef);
      
        if (userReactionDoc.exists()) {
          const userReactionData = userReactionDoc.data();
          await deleteDoc(userReactionRef);
          if (userReactionData.reactionType === reactionType) {
            return;
          }
        }

        const hotdogId = hotdog.id;
        await setDoc(userReactionRef, {
            hotdogId,
            uid: user.uid,
            reactionType,
        });

    };

    return(
        <div className="reactions">
            <button
            className={`reaction-button ${
                user &&
                hotdog.id &&
                getUserReaction().then((reactionType) => reactionType === 'like')
                ? 'liked'
                : ''
            }`}
            onClick={() => handleReaction(hotdog.id, 'like')}
            >
            <span role="img" aria-label="Like">
                🌭
            </span>
            <span className="reaction-count">0</span>
            </button>
            <button
            className={`reaction-button ${
                user &&
                hotdog.id &&
                getUserReaction().then((reactionType) => reactionType === 'dislike')
                ? 'disliked'
                : ''
            }`}
            onClick={() => handleReaction('dislike')}
            >
            <span role="img" aria-label="Dislike">
                🤮
            </span>
            <span className="reaction-count">0</span>
            </button>
        </div>
    )
}

Reactions.propTypes = {
    hotdog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default Reactions;
