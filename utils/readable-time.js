export function formatMilliseconds(milliseconds) {
  const seconds = milliseconds / 1000;
  const time = new Date(1970, 0 ,1);
  time.setSeconds(seconds);
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
}
