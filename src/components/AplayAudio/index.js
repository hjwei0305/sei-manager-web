import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import msgAudio from '@/assets/message.mp3';

class AplayAudio extends PureComponent {
  static audio;

  static propTypes = {
    autoPaly: PropTypes.bool,
    onAudioRef: PropTypes.func,
  };

  static defaultProps = {
    autoPaly: false,
  };

  componentDidMount() {
    const { autoPaly, onAudioRef } = this.props;
    if (autoPaly && this.audio) {
      this.audio.play();
    }
    if (onAudioRef) {
      onAudioRef(this);
    }
  }

  aplayAudio() {
    if (this.audio) {
      this.audio.play();
    }
  }

  render() {
    return (
      <>
        <audio ref={ref => (this.audio = ref)} src={msgAudio}>
          <track kind="captions" />
        </audio>
      </>
    );
  }
}

export default AplayAudio;
