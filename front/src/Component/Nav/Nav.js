import React from "react";
import './Nav.css';
import {Link} from 'react-router-dom'; 
function Nav(){
        

      return (
           <div className="nav">
                     <ul >
                          <li className="li-nav li-2"><Link to = "/logIn">LogIn</Link></li>    
                          <li className="li-nav li-3"><Link to = "/cars/:id">Cars</Link></li>        
                          <li className="li-nav li-4"><Link to = "/dealership/:id">Dealership</Link></li>     
                    </ul> 
           </div>
      )
}

export default Nav;