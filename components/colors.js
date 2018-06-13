import tinycolor from 'tinycolor2';

export const colors = {
  paleAqua: () => tinycolor(
    {
      r: 194,
      g: 211,
      b: 239,
      a: 1
    }
  ).toRgbString(),
  unitedNationsBlue: () => tinycolor(
    {
      r: 99,
      g: 121,
      b: 223,
      a: 1
    }
  ).toRgbString(),
  independence: () => tinycolor(
    {
      r: 75,
      g: 81,
      b: 96,
      a: 1
    }).toRgbString(),

  lavenderGray: () => tinycolor(
    {
      r: 202,
      g: 197,
      b: 198,
      a: 1
    }).toRgbString(),

  celestialBlue: () => tinycolor(
    {
      r: 69,
      g: 145,
      b: 209,
      a: 1
    }).toRgbString(),
  princetonOrange: () => tinycolor(
    {
      r: 244,
      g: 125,
      b: 49,
      a: 1
    }).toRgbString(),
  white: () => tinycolor(
    {
      r: 251,
      g: 252,
      b: 254,
      a: 1
    }).toRgbString(),
  whiteSmoke: () => tinycolor({
    r: 244,
    g: 249,
    b: 248,
    a: 1
  }).toRgbString(),
  paleChestNut: () => tinycolor({
    r: 222,
    g: 163,
    b: 181,
    a: 1
  }).toRgbString(),
  smokyBlack: () => tinycolor({
    r: 15,
    g: 11,
    b: 11,
    a: 1
  }).toRgbString(),
  gunMetal: () => tinycolor({
    r: 31,
    g: 55,
    b: 61,
    a: 1
  }).toRgbString(),
  paynesGrey: () => tinycolor({
    r: 68,
    g: 109,
    b: 119,
    a: 1
  }).toRgbString()
}

export default colors;
