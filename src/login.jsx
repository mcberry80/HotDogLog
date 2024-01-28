import PropTypes from 'prop-types';
import './Login.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function Login({user, setUser}) {

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

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

Login.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
};


export default Login;
