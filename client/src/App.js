import './App.css';
import { getTestMessage } from './services/apiServices';
import {useEffect,useState} from 'react';
import WelcomePage from './pages/WelcomePage';
import Routing from './Routing';

const App = () => {
  return (
      <div>
          <Routing />
      </div>
  );
};

export default App;
