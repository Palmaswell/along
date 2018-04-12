import { SpeechProvider } from '../providers/speech/speech-provider';
import { WSProvider } from '../providers/connection-provider';

const Providers = ({ children, channel, hostName }) => (
  <SpeechProvider>
    <WSProvider
      channel={channel}
      hostName={hostName}
      >
      { children }
    </WSProvider>
  </SpeechProvider>
);

export default Providers;
