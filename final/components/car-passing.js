import React from 'react';
import InputRange from 'react-input-range';

const soundFile = 'static/sounds/carhorn.wav';
const context = new AudioContext();

class CarPassing extends React.Component {
  
  constructor(props) {
    super(props);
 
    this.state = {
      buffer: this.fetchSound(soundFile),
      source: null,
      speed: 1500,
      startTime: 0,
      carStyle: {}
    };

    this.play = this.play.bind(this);
    this.asyncSetState = this.asyncSetState.bind(this);
  }

  asyncSetState = (newState) =>
    new Promise((resolve) => this.setState(newState, () => resolve()));

  fetchSound(file) {
    window.fetch(file)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.setState({buffer: audioBuffer});
      });
  }

  resetSource() {
    console.log('resetting source');
    return this.asyncSetState({source: context.createBufferSource()})
      .then(() => {
          this.state.source.buffer =  this.state.buffer;  
          this.state.source.connect(context.destination);
      });
  }

  play() {
    this.asyncSetState({carStyle: {animation: 'key1 ' + (this.state.speed / 1000) + 's linear'}})
    .then(() => this.resetSource())
    .then(() => {
      return this.asyncSetState({startTime: performance.now()});
    })
    .then(() => {
      window.requestAnimationFrame(this.frame);
      this.state.source.start();
    })
    
    
  }

  frame = (timestamp) => {
    let car = document.getElementById('car');
    let progress = timestamp - this.state.startTime;
    this.state.source.playbackRate.value = 1 - (((progress / this.state.speed) - 0.5) / (8 * this.state.speed / 1000));
    

    // car.style.transform = "translateX(" + (progress / this.state.speed) + "%)";
    if (progress < this.state.speed) {
      window.requestAnimationFrame(this.frame);
    } else {
      this.state.source.stop()
      this.setState({carStyle: {}});
    }
  }
  

  render() {
    return (
      <div>
        <div className="country-wrap" style={{height: 200 + 'px'}}>
    
          <div className="sun"></div>
          <div className="grass"></div>
          <div className="street">
            <div className="car" id="car" style={this.state.carStyle}>
              <div className="car-body">
                <div className="car-top-back">
                  <div className="back-curve"></div>
                </div>
                <div className="car-gate"></div>
                <div className="car-top-front">
                  <div className="wind-sheild"></div>
                </div>
                <div className="bonet-front"></div>
                <div className="stepney"></div>
              </div>
              <div className="boundary-tyre-cover">
                <div className="boundary-tyre-cover-back-bottom"></div>
                <div className="boundary-tyre-cover-inner"></div>	
              </div>
              <div className="tyre-cover-front">
                <div className="boundary-tyre-cover-inner-front"></div>
              </div>
              <div className="base-axcel">
                
              </div>
              <div className="front-bumper"></div>
              <div className="tyre">		
                <div className="gap"></div>	
              </div>
              <div className="tyre front">
                <div className="gap"></div>	
              </div>
              <div className="car-shadow"></div>
            </div>
          </div>
          <div className="street-stripe"></div>
          <div className="hill"></div>        
        </div>
        <span>Adjust the slider to change the time it takes for the car to cross the screen.</span>
        <br />
        <br />
        <InputRange
        maxValue={2.5}
        minValue={.5}
        step={.5}
        formatLabel={value => `${value}s`}
        value={this.state.speed / 1000}
        onChange={value => this.setState({speed: value * 1000})} />
        <button type="button" onClick={this.play}>
          Honk!
        </button>
      </div>
    );
  }
}

module.exports = CarPassing;
