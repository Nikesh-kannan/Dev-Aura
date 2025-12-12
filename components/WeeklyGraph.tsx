import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WeeklyGraph: React.FC = () => {
  const data = [
    { name: 'Mon', points: 400, mastery: 65 },
    { name: 'Tue', points: 300, mastery: 68 },
    { name: 'Wed', points: 600, mastery: 72 },
    { name: 'Thu', points: 450, mastery: 73 },
    { name: 'Fri', points: 800, mastery: 78 },
    { name: 'Sat', points: 900, mastery: 82 },
    { name: 'Sun', points: 500, mastery: 83 },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Weekly Progress</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-discord-dark p-6 rounded-xl shadow-sm h-80">
          <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase">Points Gained</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2f3136', border: 'none', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="points" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-discord-dark p-6 rounded-xl shadow-sm h-80">
          <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase">Skill Mastery (CDM Score)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis domain={[0, 100]} stroke="#888" />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#2f3136', border: 'none', color: '#fff' }}
              />
              <Line type="monotone" dataKey="mastery" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8 bg-earth-200 dark:bg-discord-darker p-6 rounded-xl">
        <h3 className="font-bold mb-2">Analysis</h3>
        <p className="text-sm opacity-80">
          Your learning curve is steepening! You've shown consistent growth in algorithmic complexity mastery this week. Keep maintaining the streak to unlock the "Advanced" tier.
        </p>
      </div>
    </div>
  );
};

export default WeeklyGraph;