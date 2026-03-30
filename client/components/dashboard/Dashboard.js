import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Player from '../midi/Player';
import midiFolders from '../common/midiFolders';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      favoriteMidi: [],
      favoriteItems: [],
      playing: '',
      loadingFavorites: true
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    var self = this;

    axios.get('/api/midi/getFavorites').then(function(userData) {
      var favoriteMidi = userData.data.favoriteMidis || [];

      self.setState({
        favoriteMidi: favoriteMidi
      });

      self.resolveFavoriteItems(favoriteMidi);
    }).catch(function(err) {
      console.log(err);
      self.setState({
        loadingFavorites: false
      });
    });
  }

  resolveFavoriteItems(favoriteMidi) {
    var self = this;
    

    Promise.all(midiFolders.map(function(folder) {
      return axios.get('/api/midi/folder/' + folder).then(function(data) {
        return {
          folder: folder,
          files: data.data[0] || []
        };
      });
    })).then(function(results) {
      var folderLookup = {};

      results.forEach(function(result) {
        result.files.forEach(function(fileName) {
          if (!folderLookup[fileName]) {
            folderLookup[fileName] = result.folder;
          }
        });
      });

      self.setState({
        favoriteItems: favoriteMidi.map(function(midi) {
          return self.createFavoriteItem(midi, folderLookup[midi]);
        }),
        loadingFavorites: false
      });
    }).catch(function(err) {
      console.log(err);
      self.setState({
        favoriteItems: favoriteMidi.map(function(midi) {
          return self.createFavoriteItem(midi, null);
        }),
        loadingFavorites: false
      });
    });
  }

  createFavoriteItem(midi, folder) {
    return {
      fileName: midi,
      folder: folder || '',
      displayName: this.formatMidiName(midi)
    };
  }

  formatMidiName(midi) {
    var midiRealName = midi;

    if (midi.indexOf('.') !== -1) {
      midiRealName = midi.slice(0, midi.indexOf('.'));
    }

    midiRealName = midiRealName.replace(/_/g, ' ');
    midiRealName = midiRealName.replace(/-/g, ': ');

    return midiRealName;
  }

  inputChanged(e) {
    var obj = {};
    obj[e.target.id] = e.target.value;
    this.setState(obj);
  }

  play(e) {
    e.preventDefault();

    var fileName = e.currentTarget.getAttribute('data-name');
    var folder = e.currentTarget.getAttribute('data-folder');

    if (!fileName || !folder) {
      return;
    }

    this.setState({
      playing: this.formatMidiName(fileName)
    });

    MIDIjs.play('/midi/' + folder + '/' + fileName);
  }

  stop(e) {
    e.preventDefault();
    MIDIjs.stop();
    this.setState({
      playing: ''
    });
  }

  removeFavorite(e) {
    e.preventDefault();
    var self = this;
    var fileName = e.currentTarget.getAttribute('data-name');
    var previousFavorites = self.state.favoriteMidi;
    var nextFavorites = previousFavorites.filter(function(midi) {
      return midi !== fileName;
    });

    self.setState({
      favoriteMidi: nextFavorites,
      favoriteItems: self.state.favoriteItems.filter(function(item) {
        return item.fileName !== fileName;
      })
    });

    axios.post('/api/midi/addFavorites', {
      user: self.props.userInfo.user.username,
      favorites: nextFavorites
    }).catch(function(err) {
      console.log(err);
      self.setState({
        favoriteMidi: previousFavorites
      });
      self.resolveFavoriteItems(previousFavorites);
    });
  }

  render() {
    var self = this;
    const { userInfo } = this.props;
    var filterText = self.state.input.toLowerCase();
    var visibleFavorites = self.state.favoriteItems.filter(function(item) {
      if (!filterText) {
        return true;
      }

      return item.displayName.toLowerCase().indexOf(filterText) !== -1 ||
        item.fileName.toLowerCase().indexOf(filterText) !== -1 ||
        item.folder.toLowerCase().indexOf(filterText) !== -1;
    });

    return (
      <div className="dashboard-shell container-fluid">
        <div className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <p className="dashboard-kicker">Your Library</p>
            <h1>Welcome back, {userInfo.user.username}</h1>
            <p className="dashboard-subtitle">
              Keep your favorite MIDI files close, jump back into playback, and download the ones you want to keep offline.
            </p>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Favorites</span>
              <strong>{self.state.favoriteItems.length}</strong>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Ready To Play</span>
              <strong>{self.state.favoriteItems.filter(function(item) { return !!item.folder; }).length}</strong>
            </div>
          </div>
        </div>

        <div className="row dashboard-main-row">
          <div className="col-md-4">
            <div className="dashboard-panel dashboard-profile-panel">
              <p className="dashboard-panel-label">Account</p>
              <h2>{userInfo.user.username}</h2>
              <p className="dashboard-profile-meta">{userInfo.user.email}</p>
              <div className="dashboard-profile-divider"></div>
              <p className="dashboard-profile-note">
                Your favorites sync from the archives page, so anything you star there shows up here automatically.
              </p>
            </div>
          </div>

          <div className="col-md-8">
            <div className="dashboard-panel dashboard-favorites-panel">
              <div className="dashboard-panel-header">
                <div>
                  <p className="dashboard-panel-label">Favorites Hub</p>
                  <h2>Saved MIDI Files</h2>
                </div>
                <input
                  id="input"
                  value={self.state.input}
                  placeholder="Filter favorites"
                  type="text"
                  onChange={this.inputChanged.bind(this)}
                  className="form-control dashboard-search"
                />
              </div>

              <If condition={ self.state.loadingFavorites }>
                <div className="dashboard-empty-state">
                  <h3>Loading favorites...</h3>
                </div>
              </If>

              <If condition={ !self.state.loadingFavorites && visibleFavorites.length === 0 && self.state.favoriteItems.length === 0 }>
                <div className="dashboard-empty-state">
                  <h3>No favorites yet</h3>
                  <p>Star a few tracks from the MIDI archives and they will show up here with quick actions.</p>
                </div>
              </If>

              <If condition={ !self.state.loadingFavorites && visibleFavorites.length === 0 && self.state.favoriteItems.length > 0 }>
                <div className="dashboard-empty-state">
                  <h3>No matches for "{self.state.input}"</h3>
                  <p>Try a broader search by title, filename, or folder.</p>
                </div>
              </If>

              <div className="row">
                {visibleFavorites.map(function(item, i) {
                  var downloadHref = item.folder ? '/midi/' + item.folder + '/' + item.fileName : '#';

                  return (
                    <div key={i} className="col-sm-6">
                      <div className="dashboard-favorite-card">
                        <div className="dashboard-favorite-header">
                          <span className="dashboard-folder-pill">
                            {item.folder || 'folder unknown'}
                          </span>
                          <button
                            data-name={item.fileName}
                            onClick={self.removeFavorite.bind(self)}
                            type="button"
                            className="btn btn-link dashboard-remove-btn"
                          >
                            Remove
                          </button>
                        </div>

                        <h3>{item.displayName}</h3>
                        <p className="dashboard-file-name">{item.fileName}</p>

                        <div className="dashboard-card-actions">
                          <button
                            data-name={item.fileName}
                            data-folder={item.folder}
                            onClick={self.play.bind(self)}
                            type="button"
                            className="controlBtns btn btn-default btn-md dashboard-action-btn"
                            disabled={!item.folder}
                          >
                            <span className="glyphicon glyphicon-play"></span>
                          </button>

                          <button
                            onClick={self.stop.bind(self)}
                            type="button"
                            className="controlBtns btn btn-default btn-md dashboard-action-btn"
                          >
                            <span className="glyphicon glyphicon-stop"></span>
                          </button>

                          <If condition={ !!item.folder }>
                            <a
                              href={downloadHref}
                              download={item.fileName}
                              className="controlBtns btn btn-default btn-md dashboard-action-btn"
                            >
                              <span className="glyphicon glyphicon-download-alt"></span>
                            </a>
                          </If>

                          <If condition={ !item.folder }>
                            <button
                              type="button"
                              className="controlBtns btn btn-default btn-md dashboard-action-btn"
                              disabled
                            >
                              <span className="glyphicon glyphicon-download-alt"></span>
                            </button>
                          </If>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="footer navbar-fixed-bottom">
          <Player playing={self.state.playing}/>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  userInfo: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    userInfo: state.auth
  }
}

export default connect(mapStateToProps)(Dashboard);
