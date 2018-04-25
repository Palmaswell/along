/**
 * Generates a consumable string for the speech commands.
 * @param  {transcript} @type {string} the speech transcript
 * @return {string} consumable string
 */
const sanitizeString= transcript => {
  const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#]/g;
  //--TODO regex operations remove ${mixtapeOrSongName} template braces and $
  return transcript
}

/**
 * Parse the speech result object and compares the
 * transcript with command object keys.
 * @param {result} @type {object}
 * @param {command} @type {object}
 * @return {return} command name
 */
export const getCmdName = (command, result) => {
  const commands = Object.keys(command);
  if (result.confidence <= .75) {
    return;
  };
  const match = commands.reduce((acc, curVal) => {
    if (curVal === result.transcript) {
      acc = curVal;
    }
    return acc;
  });
  if (match) {
    console.log(`> 🙌  Command ${match} matched`);
    return match;
  }
}
