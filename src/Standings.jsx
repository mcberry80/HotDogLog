import { useState, useEffect } from 'react';
import { firestore } from './firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

function Standings() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(firestore, 'hotdogs')), (snapshot) => {
      const usersData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.uid;
        if (!usersData[userId]) {
          usersData[userId] = {
            id: userId,
            displayName: data.displayName,
            hotdogsCount: 0,
          };
        }
        usersData[userId].hotdogsCount++;
      });
      const sortedUsers = Object.values(usersData).sort((a, b) =>
        b.hotdogsCount - a.hotdogsCount
      );
      setUsers(sortedUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Standings</h2>
      <ol>
        {users.map((user) => (
          <li key={user.id}>
            {user.displayName} - {user.hotdogsCount} hot dogs
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Standings;
