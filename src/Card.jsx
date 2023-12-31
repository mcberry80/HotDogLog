import PropTypes from 'prop-types';
import Reactions from './Reactions';
import { getFirestore,  deleteDoc, doc} from 'firebase/firestore';
import { firebaseApp } from './firebase';
import './Card.css';
const db = getFirestore(firebaseApp);

const Card = ({hotdog, user}) => {

    const handleDelete = (hotdogId) => {

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
        <div className="hotdog-card">
            <div className="hotdog-content">
                <p className="hotdog-date">{hotdog.date}</p>
                <p className="hotdog-notes">{hotdog.tastingNotes}</p>
                <p className="hotdog-user">@{hotdog.displayName}</p>
                {hotdog.imageUrl && (
                    <img src={hotdog.imageUrl} alt="Hot Dog" style={{ maxWidth: 300 }} />
                )}
                <Reactions hotdog={hotdog} user={user} />
            </div>
            {hotdog.uid === user.uid && (
            <button className="delete-button" onClick={() => handleDelete(hotdog.id)}>
                Delete
            </button>
            )}
        </div>
    )
}

Card.propTypes = {
    hotdog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

export default Card;

        