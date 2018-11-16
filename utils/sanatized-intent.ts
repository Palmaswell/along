/**
 * Generates a consumable string for the speech commands.
 * @param  {transcript} @type {string} the speech transcript
 * @return {string} consumable string
 */
export function sanatizedIntent(intent) {
  const intentString = intent.replace(/[\-{}\[\]+?.,\\\^$|#]/g, '');
  return intentString.toLowerCase();
}
