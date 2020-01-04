
   
   window.onSpotifyWebPlaybackSDKReady = () => {
      const token = 'BQBwI6cIwSt662qhY0xuvL9UIvgHzalfY0F_2khc8SDlmM1QgXGes2ZW9M_wlVV4YVDsY4DPx8GgJT6COAdhSqGLO1ZfpvkTy6uZfnsAdZ_aLISst01do6b9jiCvXJswZCaT4gC88dvfgbCpuow8bjEtdHrN-QXD9-w';
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
      // Ready
        player.on('ready', data => {
            console.log('Ready with Device ID', data.device_id);
            // Play a track using our new device ID
            // play(data.device_id);
        });
      // Connect to the player!
      player.connect();
    };
// Play a specified track on the Web Playback SDK's device ID

function play(device_id) {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: '{"uris": ["spotify:track:7qiZfU4dY1lWllzX7mPBI3"]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + 'BQBwI6cIwSt662qhY0xuvL9UIvgHzalfY0F_2khc8SDlmM1QgXGes2ZW9M_wlVV4YVDsY4DPx8GgJT6COAdhSqGLO1ZfpvkTy6uZfnsAdZ_aLISst01do6b9jiCvXJswZCaT4gC88dvfgbCpuow8bjEtdHrN-QXD9-w' );},
   success: function(data) {
     console.log(data)
   }
  });
}
