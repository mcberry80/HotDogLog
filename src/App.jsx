import { useState } from 'react';
import Login from './Login';
import AddHotDog from './AddHotDog';
import HotDogList from './HotDogList';
import Standings from './Standings';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
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

export default App;
