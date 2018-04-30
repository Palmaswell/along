import { SpeechProvider } from '../providers/speech/speech-provider';
import { WSProvider } from '../providers/connection-provider';

export const Providers = ({ children, channel, id }) => (
  <WSProvider
    channel={channel}>
    <SpeechProvider id={id}>
      { children }
    </SpeechProvider>
  </WSProvider>
);

export default Providers;
