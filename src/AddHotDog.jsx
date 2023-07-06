
import { firebase, firestore } from './firebase';
import PropTypes from 'prop-types';

function Data({ user }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const tastingNotes = event.target.elements.notes.value;
    const date = event.target.elements.date.value;
    if (date && tastingNotes) {
      firestore.collection('hotdogs').add({
        uid: user.uid,
        displayName: user.displayName,
        date: date,
        tastingNotes: tastingNotes,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      event.target.reset();
    }
  };

  return (
    <div>
      <h2>Add Hot Dog</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date of hot dog:</label>
        <input type="date" name="date" />
        <label htmlFor="description">Dog tasting notes:</label>
        <input type="text" name="notes" />
        <button type="submit">Log Dog</button>
      </form>
    </div>
  );
}

Data.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
};

export default Data;
