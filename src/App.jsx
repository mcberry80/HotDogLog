import { useState } from 'react';
import { auth, googleAuthProvider } from './firebase';
import Login from './Login';
import Data from './Data';
import MessageList from './MessageList';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [user, setUser] = useState(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  const signInWithGoogle = () => {
    auth.signInWithPopup(googleAuthProvider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const signOut = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  return (
    <div className="container">
      <h1 className="mt-4 mb-4">My App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button className="btn btn-primary mb-4" onClick={signOut}>Sign Out</button>
          <Data user={user} />
          <MessageList user={user} />
        </div>
      ) : (
        <Login signInWithGoogle={signInWithGoogle}  />
      )}
    </div>
  );
}

export default App;
