import Reactions from '../reactions/Reactions';
import { getFirestore,  deleteDoc, doc} from 'firebase/firestore';
import { firebaseApp } from '../../firebase';
import { Link } from 'react-router-dom';
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
          <p className="hotdog-date">{hotdog.date}</p>
          <p className="hotdog-notes">{hotdog.tastingNotes}</p>
          <p className="hotdog-user"><Link to={"user/" + hotdog.uid}>@{hotdog.displayName}</Link></p>
          {hotdog.imageUrl && (
              <img src={hotdog.imageUrl} alt="Hot Dog" style={{ maxWidth: 300 }} />
          )}
          <Reactions hotdog={hotdog} user={user} />
          {hotdog.uid === user.uid && (
          <button className="delete-button" onClick={() => handleDelete(hotdog.id)}>
              Delete
          </button>
          )}
        </div>
    )
}


export default Card;

        