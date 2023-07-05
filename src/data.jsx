
import { firebase, firestore } from './firebase';
import PropTypes from 'prop-types';

function Data({ user }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    if (message) {
      firestore.collection('messages').add({
        uid: user.uid,
        displayName: user.displayName,
        text: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      event.target.reset();
    }
  };

  return (
    <div>
      <h2>Add Message</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" placeholder="Enter message" />
        <button type="submit">Submit</button>
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
