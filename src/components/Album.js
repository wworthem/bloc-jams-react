import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar.js';
import './../Album.css';

class Album extends Component {
  constructor(props) {
    super(props);
    console.log(albumData);

  const album = albumData.find( album => {
    return album.slug === this.props.match.params.slug
  });

  this.state = {
    album: album,
    currentSong: album.songs[0],
    currentTime: 0,
    volume: .60,
    duration: album.songs[0].duration,
    isPlaying: false
  };

  this.audioElement = document.createElement('audio');
  this.audioElement.src = album.songs[0].audioSrc;
  this.formatTime = this.formatTime.bind(this);
}

  play() {
    this.audioElement.play();
    this.setState({isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({isPlaying: false });
  }

componentDidMount() {

  this.eventListeners = {
    timeupdate: e => {
      this.setState({ currentTime: this.audioElement.currentTime });
    },
    durationchange: e => {
      this.setState({ duration: this.audioElement.duration });
    }
  };
  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.addEventListener('volumecontrol', this.eventListeners.volumecontrol);
}

componentWillUnmount() {
  this.audioElement.src = null;
  this.audioElement.removeEventListener('timeupdate',this.eventListeners.timeupdate);
  this.audioElement.removeEventListener('durationchange',this.eventListeners.durationchange);
  this.audioElement.removeEventListener('volumecontrol', this.eventListeners.volumecontrol);
}

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;

    if (this.state.isPlaying && isSameSong) {
      this.pause();
    }
      else {
      if (!isSameSong) {this.setSong(song); }
        this.play();
      }
    }

handlePrevClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
  const newIndex = Math.max(0, currentIndex - 1);
  const newSong = this.state.album.songs[newIndex];
  this.setSong(newSong);
  this.play();
}

handleNextClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
  const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
  const newSong = this.state.album.songs[newIndex];
  this.setSong(newSong);
  this.play();
}

handleTimeChange(e) {
  const newTime = this.audioElement.duration * e.target.value;
  this.audioElement.currentTime = newTime;
  this.setState({ currentTime: newTime });
}

handleVolumeChange(e) {
  const newVolume = e.target.value;
  this.audioElement.currentVolume = newVolume;
  this.audioElement.volume = newVolume;
  /*this.setState({ volume: newVolume }); */

}


  formatTime(SecondsInStringFormat) {
    if(isNaN(SecondsInStringFormat))
      {return "-:--"}

    var sec_num = parseInt(SecondsInStringFormat, 10); // don't forget the second parm
    var hours = Math.floor(sec_num / 3600);

    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    //if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

   // var time = hours + ':' + minutes + ':' + seconds;

    var time = minutes + ':' + seconds;
    //console.log(time);
    return time;
}


  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt="album cover missing"/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>

          <tbody>

            {this.state.album.songs.map( (song, index) =>
              <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
                <td className="song-actions">
                  <button>
                    <span className="song-number">{index+1}</span>
                    <span className="ion-play"></span>
                    <span className="ion-pause"></span>
                  </button>
                </td>
                <td className="song-title">{song.title}</td>
                {/* <td className="song-duration">{song.duration}</td>} */}
                <td className="song-duration">{this.formatTime(song.duration)}</td>
              </tr>
            )}

          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          volume={this.audioElement.volume}
          handleSongClick={()=> this.handleSongClick(this.state.currentSong)}
          handlePrevClick={()=> this.handlePrevClick()}
          handleNextClick={()=> this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={this.formatTime}
          /*formatTime={(e) => this.formatTime(e)} */

        />
      </section>
    );
  }
}

export default Album;
