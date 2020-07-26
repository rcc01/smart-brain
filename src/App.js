import React from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';

import './App.css';
import './components/Signin/Signin.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';




const particlesOptions = {
    "particles": {
      "number": {
          "value": 200,
          "density": {
              "enable": false
          }
      },
      "size": {
          "value": 4,
          "random": true,
          "anim": {
              "speed": 4,
              "size_min": 0.3
          }
      },
      "line_linked": {
          "enable": false
      },
      "move": {
          "random": true,
          "speed": 1,
          "direction": "top",
          "out_mode": "out"
      }
  },
  "interactivity": {
      "events": {
          "onhover": {
              "enable": true,
              "mode": "bubble"
          },
          "onclick": {
              "enable": true,
              "mode": "repulse"
          }
      },
      "modes": {
          "bubble": {
              "distance": 250,
              "duration": 2,
              "size": 0,
              "opacity": 0
          },
          "repulse": {
              "distance": 400,
              "duration": 4
          }
      }
  }
}



const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }
  


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }








  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(console.log)
  // }







  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }








  displayFaceBox = (box) => {
    this.setState({box: box});
  }


  // This is the input fild to put the URLs:

  onInputChange = (event) => {
    // input has to change from '' to event.target.value
  this.setState({input: event.target.value});
  }

  // For the detect button:
  // DETECT BUTTON
  onButtonSubmit = () => {
    // imageUrl has to change from '' to this.state.input, which is the way to visualise the image put before in onInputChange
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
        })
      })
      .then(response => response.json())
    .then(response => { 
        if (response) {    
          fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
            })
        })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries : count}))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
  }

  // Signin button from SIGNIN screen:
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    // route is going to change from signin to home, where you can start using the app:
    this.setState({route: route});
  }


render() {
  const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Particles className='particles'
              params={particlesOptions}
      />
      {/* These are components */}
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {/* having all the expresion below */}
      { route === 'home' 
      // if it's true...
      ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={ box } imageUrl={imageUrl}/>
        </div>
        // ... and if it's false... I want the next to happen
      : (
          route === 'signin'
          ? <Signin  loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
          : <Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange} /> 
        )
      }   
        </div>
  );
 }
}

export default App;
