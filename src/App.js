import './App.css';
import { BrowserRouter} from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard';
import Home from './Components/Home/Home';

function App() {
  return (
    <>
        <BrowserRouter>
          <Home/>
        </BrowserRouter>
    </>
  );
}

export default App;
