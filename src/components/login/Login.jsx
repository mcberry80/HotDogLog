import  { useEffect, useContext } from 'react';
import AuthContext from '../../AuthContext';
import './Login.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

function Login() {

  const { user, setUser } = useContext(AuthContext);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth, setUser]);

  const signOut = () => {
    auth.signOut()
    .then(() => {
      setUser(null);
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  const signin = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      setUser(result.user);
    }).catch((error) => {
      console.log(error.message);
    });
  }

  if (user) {
    return (
      <div className='login'>
        <p>Welcome, {user.displayName}</p>
        <button className="btn btn-primary mb-4" onClick={signOut}>Sign Out</button>
      </div>
    );
  } else {
    return (
      <div className='login'>
        <button onClick={signin}>Sign in with Google</button>
      </div>
    );
  }
}

export default Login;
