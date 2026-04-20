import React from 'react';
import axios from 'axios';
import Player from './Player.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import midiFolders from '../common/midiFolders';

class MidiArchives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contemporary: [],
      games: [],
      movies: [],
      anthems: [],
      favorites: [],
      input: '',
      tab: 'contemporary',
      playing: '',
      tmp: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getFavorites();
    this.getDynamic(null, 'contemporary');
  }

  getFavorites() {
    var self = this;

    if (!self.props.userInfo.isAuthenticated) {
      return;
    }

    axios.get('/api/midi/getFavorites').then(function(userData) {
      self.setState({
        favorites: userData.data.favoriteMidis || []
      });
    }).catch(function(err) {
      console.log(err);
    });
  }

  getDynamic(e, nextTab) {
    var self = this;
    var name = nextTab;

    if (e) {
      e.preventDefault();
      name = e.currentTarget.getAttribute('data-tab');
    }

    axios.get('/api/midi/folder/' + name).then(function(data) {
      var midiNames = data.data[0] || [];
      self.setState({
        [name]: midiNames,
        tmp: midiNames,
        tab: name,
        input: '',
        loading: false
      });
    }).catch(function(err) {
      console.log(err);
      self.setState({
        tab: name,
        tmp: [],
        input: '',
        loading: false
      });
    });
  }

  inputChanged(event) {
    var self = this;
    var searchText = event.target.value;
    var filteredMidi = self.state.tmp.filter(function(word) {
      return word.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    });

    self.setState({
      input: searchText,
      [self.state.tab]: filteredMidi
    });
  }

  formatMidiName(name) {
    var realName = name;

    if (name.indexOf('.') !== -1) {
      realName = name.slice(0, name.indexOf('.'));
    }

    realName = realName.replace(/_/g, ' ');
    realName = realName.replace(/-/g, ': ');

    return realName;
  }

  play(e) {
    e.preventDefault();

    var name = e.currentTarget.getAttribute('data-name');
    var activeTab = this.state.tab;

    this.setState({
      playing: this.formatMidiName(name)
    });

    MIDIjs.play('/midi/' + activeTab + '/' + name);
  }

  stop(e) {
    e.preventDefault();
    MIDIjs.stop();
  }

  favorite(e) {
    var self = this;
    e.preventDefault();
    var name = e.currentTarget.getAttribute('data-name');
    var favorites = self.state.favorites;
    var alreadyFavorited = favorites.indexOf(name) !== -1;
    var nextFavorites = alreadyFavorited
      ? favorites.filter(function(favoriteName) {
          return favoriteName !== name;
        })
      : favorites.concat(name);

    self.setState({
      favorites: nextFavorites
    });

    if (!self.props.userInfo.isAuthenticated) {
      return;
    }

    axios.post('/api/midi/addFavorites', {
      user: self.props.userInfo.user.username,
      favorites: nextFavorites
    }).catch(function(err) {
      console.log(err);
      self.setState({
        favorites: favorites
      });
    });
  }

  render() {
    var self = this;
    var activeMidi = self.state[self.state.tab] || [];
    var readyCount = activeMidi.length;
    var favoriteCount = self.state.favorites.length;

    function selectCategory(arr) {
      if (!arr.length && !self.state.loading) {
        return (
          <div className="midi-empty-state">
            <h3>No tracks found</h3>
            <p>Try a different search or switch to another archive tab.</p>
          </div>
        );
      }

      return arr.map(function(midi, i) {
        var midiRealName = self.formatMidiName(midi);
        var isFavorited = self.state.favorites.indexOf(midi) !== -1;

        if (midi === '.DS_Store') return null;

        return (
          <div key={i} className="midi-masonry-item">
            <div className="midi-archive-card">
              <div className="midi-archive-card-top">
                <span className="midi-archive-category">{self.state.tab}</span>
                <button
                  data-name={midi}
                  onClick={self.favorite.bind(self)}
                  type="button"
                  className={'btn btn-md midi-favorite-btn ' + (isFavorited ? 'btn-warning' : 'btn-default')}
                >
                  <span className={'glyphicon ' + (isFavorited ? 'glyphicon-star' : 'glyphicon-star-empty')}></span>
                </button>
              </div>

              <h2>{midiRealName}</h2>
              <p className="midi-file-meta">{midi}</p>

              <div className="midi-card-actions">
                <button
                  data-name={midi}
                  onClick={self.play.bind(self)}
                  type="button"
                  className="controlBtns btn btn-default btn-md midi-action-btn"
                >
                  <span className="glyphicon glyphicon-play"></span>
                </button>

                <button
                  data-name={midi}
                  onClick={self.stop.bind(self)}
                  type="button"
                  className="controlBtns btn btn-default btn-md midi-action-btn"
                >
                  <span className="glyphicon glyphicon-stop"></span>
                </button>

                <a
                  href={'/midi/' + self.state.tab + '/' + midi}
                  download={midi}
                  className="controlBtns btn btn-default btn-md midi-action-btn"
                >
                  <span className="glyphicon glyphicon-download-alt"></span>
                </a>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <div className="midi-archives-shell container-fluid">
        <div className="midi-archives-hero">
          <div className="midi-archives-copy">
            <p className="midi-archives-kicker">Archive Explorer</p>
            <h1>Discover and collect MIDI favorites</h1>
            <p className="midi-archives-subtitle">
              Browse curated folders, audition tracks instantly, and save the ones you want waiting in your dashboard.
            </p>
            <Link to="/dashboard" className="btn hero-nav-link">
              Back To Dashboard
            </Link>
          </div>

          <div className="midi-archives-stats">
            <div className="midi-archives-stat-card">
              <span className="midi-archives-stat-label">Current Folder</span>
              <strong>{self.state.tab}</strong>
            </div>
            <div className="midi-archives-stat-card">
              <span className="midi-archives-stat-label">Tracks Showing</span>
              <strong>{readyCount}</strong>
            </div>
            <div className="midi-archives-stat-card">
              <span className="midi-archives-stat-label">Favorites Saved</span>
              <strong>{favoriteCount}</strong>
            </div>
          </div>
        </div>

        <div className="midi-archives-panel">
          <div className="midi-archives-toolbar">
            <div>
              <p className="midi-archives-panel-label">Browse</p>
              <h2>Midi Archives</h2>
            </div>

            <input
              placeholder="Quick search this folder"
              type="text"
              onChange={this.inputChanged.bind(this)}
              value={self.state.input}
              className="form-control midi-archives-search"
              id="input"
            />
          </div>

          <div className="midi-archives-tabs">
            {midiFolders.map(function(tabName) {
              var isActive = self.state.tab === tabName;

              return (
                <button
                  key={tabName}
                  data-tab={tabName}
                  onClick={self.getDynamic.bind(self)}
                  type="button"
                  className={'btn midi-archives-tab ' + (isActive ? 'midi-archives-tab-active' : '')}
                >
                  {tabName}
                </button>
              );
            })}
          </div>

          <If condition={ self.state.loading }>
            <div className="midi-empty-state">
              <h3>Loading archive...</h3>
            </div>
          </If>

          <div className="midi-archive-grid">
            {selectCategory(activeMidi)}
          </div>
        </div>

        <div className="footer navbar-fixed-bottom">
          <Player playing={self.state.playing}/>
        </div>
      </div>
    );
  }
}

MidiArchives.propTypes = {
  userInfo: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    userInfo: state.auth
  }
}

export default connect(mapStateToProps)(MidiArchives);
