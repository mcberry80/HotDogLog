import Login from '../components/login/Login';
import AddHotDog from '../components/addhotdog/AddHotDog';
import HotDogList from '../components/hotdoglist/HotDogList';
import Standings from '../components/standings/Standings';
import './Root.css';
import { useContext } from 'react';
import AuthContext from '../AuthContext';
import 'bootstrap/dist/css/bootstrap.css';

function Root() {

  const { user } = useContext(AuthContext);
  return (

    <div className="container">
      <h1 className="mt-4 mb-4">Hot Dog Log</h1>
      <Login />
      {user && 
        <div>
          <AddHotDog user={user} />
          <HotDogList  />
          <Standings />
        </div>
      }
    </div>
  );
}

export default Root;
