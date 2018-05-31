import { abstractCommandFactory } from '../providers/speech/speech-commands';

export function IntentFactory({ type, samples, action }) {
  return {
    type,
    samples,
    action
  }
};

export function generateIntents(intent, ...args) {
  return intent.samples.map(sample => ({
    callableIntent: abstractCommandFactory.register(sample),
    action: props => intent.action(...args)
  }))
};
