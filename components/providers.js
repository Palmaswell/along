import { SpeechProvider } from '../providers/speech/speech-provider';
import { WSProvider } from '../providers/connection-provider';

const Providers = ({ children, channel }) => (
  <SpeechProvider>
    <WSProvider
      channel={channel}
      >
      { children }
    </WSProvider>
  </SpeechProvider>
);

export default Providers;
