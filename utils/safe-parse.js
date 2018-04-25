export function safeParse(stringOrObect) {
  try {
    return JSON.parse(stringOrObect)
  } catch (err) {
    return {};
  }
}
