import React from 'react';
import Tilt from 'react-tilt'
import logo from './logo.png';
import './Logo.css';



const Logo  = () => {
    return (
        <div className='ma5
         mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 250, width: 250 }} >
            <div className="Tilt-inner"> <img alt='logo' src={logo} 
            /> 
            </div>
            </Tilt>
        </div>
        );
}



export default Logo;

