import './App.css';
import  SignIn from'./Component/SignIn/SignIn';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import LogIn from './Component/LogIn/Login';
import Nav from './Component/Nav/Nav';
import Cars from './Component/Cars/Cars';
import Dealership from './Component/Dealership/Dealership';
import Deal from './Component/Deal/Deal';
import UserVehicles from './Component/Account/UserVehicle';
function App() {
  return (
    <div className="App">
          <BrowserRouter>
             <Nav/>
                <UserVehicles/>
                <Routes>
                       <Route path='/login' element = {<LogIn/>}/>  
                       <Route path='/cars/:id' element = {<Cars/>}/>
                       <Route path='/dealership/:id' element = {<Dealership/>}/>
                       <Route path='/deal/:id' element = {<Deal/>}/>
                </Routes>
          </BrowserRouter>
       
    </div>
  );
}

export default App;
