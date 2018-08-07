import { SpeechProvider } from '../providers/speech/provider';
import { WSProvider } from '../providers/provider';

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
