import React from 'react';

const Progress: React.FC = () => {
  const friends = [
    { name: "Alice", status: "Coding now", points: 2400 },
    { name: "Bob", status: "Idle", points: 450 },
    { name: "Charlie", status: "Offline", points: 1200 },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Community Progress</h2>
      
      <div className="bg-white dark:bg-discord-dark rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-earth-200 dark:bg-discord-darkest">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Current Status</th>
              <th className="p-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((f, i) => (
              <tr key={i} className="border-b border-earth-100 dark:border-discord-darker hover:bg-earth-50 dark:hover:bg-discord-light">
                <td className="p-4 font-bold">{f.name}</td>
                <td className="p-4">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    f.status.includes('Coding') ? 'bg-green-500' : f.status === 'Idle' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></span>
                  {f.status}
                </td>
                <td className="p-4 font-mono">{f.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Progress;