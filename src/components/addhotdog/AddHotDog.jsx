import { useState } from 'react';
import { firestore, storage } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddHotDog.css';
function AddHotDog({ user }) {
  const [image, setImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const tastingNotes = event.target.elements.notes.value;
    const date = event.target.elements.date.value;

    if (date && tastingNotes) {
      if (image) {
        // Create a storage reference with a unique filename
        const storageRef = ref(storage, `hotdog-images/${Date.now()}-${image.name}`);

        // Upload the image file to Firebase Storage
        uploadBytes(storageRef, image).then((snapshot) => {
          // Get the download URL of the uploaded image
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            // Save the hot dog entry in Firestore with the image URL
            addDoc(collection(firestore, 'hotdogs'), {
              uid: user.uid,
              displayName: user.displayName,
              date: date,
              tastingNotes: tastingNotes,
              imageUrl: downloadURL,
              createdAt: serverTimestamp(),
            });
            event.target.reset();
            setImage(null);
          });
        }).catch((error) => {
          console.log(error.message);
        });
      } else {
        addDoc(collection(firestore, 'hotdogs'), {
          uid: user.uid,
          displayName: user.displayName,
          date: date,
          tastingNotes: tastingNotes,
          imageUrl: "",
          createdAt: serverTimestamp(),
        });
      }
    }
  };

  return (
    <div className="add-hotdog-form">
      <h2>Add Hot Dog</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date of hot dog:</label>
        <input type="date" name="date" />
        <label htmlFor="description">Dog tasting notes:</label>
        <input type="text" name="notes" />
        <label htmlFor="image">Hot Dog Image:</label>
        <input
          type="file"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Log Dog</button>
      </form>
    </div>
  );
}


export default AddHotDog;
