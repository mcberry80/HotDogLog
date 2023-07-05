import PropTypes from 'prop-types';

function Login({ signInWithGoogle }) {

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

Login.propTypes = {
  signInWithGoogle: PropTypes.func.isRequired,
};


export default Login;
