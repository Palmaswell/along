import { SpeechProvider } from '../providers/speech/speech-provider';
import { WSProvider } from '../providers/connection-provider';

export const Providers = ({ children, channel }) => (
  <WSProvider
    channel={channel}>
    <SpeechProvider>
      { children }
    </SpeechProvider>
  </WSProvider>
);

export default Providers;
