import { useState, useEffect } from 'react';
import { firestore } from './firebase';

function Standings() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('hotdogs')
      .onSnapshot((snapshot) => {
        const usersData = {};
        snapshot.docs.forEach((doc) => {
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
