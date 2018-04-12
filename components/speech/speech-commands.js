export const cmdGrammar = '#JSGF V1.0; grammar commands; public  = go home | show mixtapes | pause | play | stop;'

const cmd = {
  'go home': () => {console.log('go home 1111')},
  'show mixtapes': () => {console.log('many: show mixtapes11111')},
  'open ${mixtapeOrSongName}': () => {console.log( 'open ${mixtapeOrSongName}11111')},
  'pause': () => {console.log('pause11111')},
  'play': () => {console.log('play1111')},
  'stop': () => {console.log('stop11111')}
}

export default cmd;
