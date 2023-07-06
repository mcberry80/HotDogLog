
import { useState } from 'react';
import { firebase, firestore, storage} from './firebase';
import PropTypes from 'prop-types';

function Data({ user }) {
  const [image, setImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const tastingNotes = event.target.elements.notes.value;
    const date = event.target.elements.date.value;
  
    if (date && tastingNotes ) {
      // Create a storage reference with a unique filename
      const imageRef = storage.ref().child(`hotdog-images/${Date.now()}-${image.name}`);
  
      // Upload the image file to Firebase Storage
      const uploadTask = imageRef.put(image);
  
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.log(error.message);
        },
        () => {
          // Get the download URL of the uploaded image
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // Save the hot dog entry in Firestore with the image URL
            firestore.collection('hotdogs').add({
              uid: user.uid,
              displayName: user.displayName,
              date: date,
              tastingNotes: tastingNotes,
              imageUrl: downloadURL,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            event.target.reset();
            setImage(null);
          });
        }
      );
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
        <label htmlFor="image">Hot Dog Image:</label>
        <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
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
