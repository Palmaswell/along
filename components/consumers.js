import { SpeechContext } from '../providers/speech/provider';
import { WSContext } from '../providers/provider';

const Consumers = ({ children }) => (
  <SpeechContext.Consumer>
    {speech => (
      <WSContext.Consumer>
        {wsBroker => children({speech, wsBroker})}
      </WSContext.Consumer>
    )}
  </SpeechContext.Consumer>
);

export default Consumers;
