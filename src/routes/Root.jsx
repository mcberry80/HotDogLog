import { useState } from 'react';
import Login from '../components/login/Login';
import AddHotDog from '../components/addhotdog/AddHotDog';
import HotDogList from '../components/hotdoglist/HotDogList';
import Standings from '../components/standings/Standings';
import './Root.css';
import 'bootstrap/dist/css/bootstrap.css';

function Root() {
  const [user, setUser] = useState(null);

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Hot Dog Log</h1>
      <Login setUser={setUser} user={user} />
      {user && 
        <div>
          <AddHotDog user={user} />
          <HotDogList user={user} />
          <Standings />
        </div>
      }
    </div>
  );
}

export default Root;
