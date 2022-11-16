import React, { Component } from "react";
import Bell from "../bell.wav";

class Clock extends Component {
  state = {
    sessionLength: 25,
    breakLength: 5,
    currentSession: 1500,
    active: false,
    interval: null,
    playOrPause: "play_arrow",
    minutes: "25",
    seconds: "00",
    currentTimer: "Session",
  };

  plusMinus = (input) => {
    if (input === "break-increment") {
      if (this.state.breakLength === 60) return;
      this.setState({ breakLength: this.state.breakLength + 1 });
    } else if (input === "break-decrement") {
      if (this.state.breakLength === 1) return;
      this.setState({ breakLength: this.state.breakLength - 1 });
    } else if (input === "session-increment") {
      if (this.state.sessionLength === 60) return;
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        minutes: (this.state.sessionLength + 1).toString().padStart(2, "0"),
        currentSession: this.state.currentSession + 60,
      });
    } else if (input === "session-decrement") {
      if (this.state.sessionLength === 1) return;
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        minutes: (this.state.sessionLength - 1).toString().padStart(2, "0"),
        currentSession: this.state.currentSession - 60,
      });
    }
  };

  reset = () => {
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      currentSession: 1500,
      active: false,
      playOrPause: "play_arrow",
      minutes: "25",
      seconds: "00",
      interval: clearInterval(this.state.interval),
      currentTimer: "Session",
    });

    var audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  start = () => {
    if (this.state.currentSession === 0) return;

    this.setState({
      interval: setInterval(() => {
        this.setState({ currentSession: this.state.currentSession - 1 });

        if (this.state.currentSession === 0) {
          document.getElementById("beep").play();
          this.switch();
        }
      }, 1000),
    });
    setInterval(() => {
      this.updateTimer();
    }, 1000);
    this.toggleClass();
  };

  switch = () => {
    if (this.state.currentTimer === "Session") {
      this.setState({
        currentTimer: "Break",
        currentSession: this.state.breakLength * 60,
      });
      this.updateTimer();
    } else if (this.state.currentTimer === "Break") {
      this.setState({
        currentTimer: "Session",
        currentSession: this.state.sessionLength * 60,
      });
      this.updateTimer();
    }
  };

  updateTimer = () => {
    const Tminutes = Math.floor(this.state.currentSession / 60);
    const Tseconds = this.state.currentSession % 60;

    this.setState({
      minutes: Tminutes.toString().padStart(2, "0"),
      seconds: Tseconds.toString().padStart(2, "0"),
    });
  };

  stop = () => {
    this.setState({ interval: clearInterval(this.state.interval) });
    this.toggleClass();
  };

  toggleClass = () => {
    const currentState = this.state.active;
    if (currentState) {
      this.setState({ active: !currentState, playOrPause: "play_arrow" });
    } else if (currentState === false) {
      this.setState({ active: !currentState, playOrPause: "pause" });
    }
  };

  render() {
    return (
      <div id="clock">
        <h1 id="clock-label">25 + 5 Clock</h1>

        {/*BREAK SECTION*/}
        <div id="break-section">
          <button
            id="break-increment"
            className="updown"
            onClick={() => this.plusMinus("break-increment")}
          >
            <h1>&#8679;</h1>
          </button>
          <h3 id="break-label">Break Length</h3>
          <h2 id="break-length">{this.state.breakLength}</h2>
          <button
            id="break-decrement"
            className="updown"
            onClick={() => this.plusMinus("break-decrement")}
          >
            <h1>&#8681;</h1>
          </button>
        </div>

        {/*SESSION SECTION*/}
        <div id="session-section">
          <button
            id="session-increment"
            className="updown"
            onClick={() => this.plusMinus("session-increment")}
          >
            <h1>&#8679;</h1>
          </button>
          <h3 id="session-label">Session Length</h3>
          <h2 id="session-length">{this.state.sessionLength}</h2>
          <button
            id="session-decrement"
            className="updown"
            onClick={() => this.plusMinus("session-decrement")}
          >
            <h1>&#8681;</h1>
          </button>
        </div>

        {/*CURRENT SECTION*/}
        <div id="current-session">
          <h3 id="timer-label">{this.state.currentTimer}</h3>
          <h2 id="time-left">
            <span className="timer_part minutes">{this.state.minutes}</span>
            <span className="timer_part">:</span>
            <span className="timer_part seconds">{this.state.seconds}</span>
          </h2>
          <button
            id="start_stop"
            className={this.state.active ? "stop_start" : "start_stop"}
            onClick={() => (this.state.active ? this.stop() : this.start())}
          >
            <span
              className={
                this.state.active
                  ? "material-symbols-outlined stop_start"
                  : "material-symbols-outlined start_stop"
              }
            >
              {this.state.playOrPause}
            </span>
          </button>
          <button id="reset" className="reset" onClick={() => this.reset()}>
            <span className="material-symbols-outlined">device_reset</span>
          </button>

          {/*alram audio*/}
          <audio
            controls
            ref={this.audio3}
            className="clip"
            id="beep"
            src={Bell}
            type="audio/wav"
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
    );
  }
}

export default Clock;
