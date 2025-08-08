import React from 'react';
import RequestFacility from '../pages/requestfacility'; // Import the form component
import Sidebar from '../components/Sidebar'; // This will contain the sidebar menu
import Header from '../components/Header'; // This will contain the top navigation

const App: React.FC = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1">
          <RequestFacility />
        </main>
      </div>
    </div>
  );
};

export default App;