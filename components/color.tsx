import tinycolor from 'tinycolor2';

export const Color = {
  Amethyst: () => tinycolor(
    {
      r: 149,
      g: 94,
      b: 209,
      a: 1
    }
  ).toRgbString(),
  PaleAqua: () => tinycolor(
    {
      r: 194,
      g: 211,
      b: 239,
      a: 1
    }
  ).toRgbString(),
  UnitedNationsBlue: () => tinycolor(
    {
      r: 99,
      g: 121,
      b: 223,
      a: 1
    }
  ).toRgbString(),
  Independence: () => tinycolor(
    {
      r: 75,
      g: 81,
      b: 96,
      a: 1
    }).toRgbString(),
  LavenderGray: () => tinycolor(
    {
      r: 202,
      g: 197,
      b: 198,
      a: 1
    }).toRgbString(),
  CelestialBlue: () => tinycolor(
    {
      r: 69,
      g: 145,
      b: 209,
      a: 1
    }).toRgbString(),
  PrincetonOrange: () => tinycolor(
    {
      r: 244,
      g: 125,
      b: 49,
      a: 1
    }).toRgbString(),
  White: () => tinycolor(
    {
      r: 251,
      g: 252,
      b: 254,
      a: 1
    }).toRgbString(),
  WhiteSmoke: () => tinycolor({
    r: 244,
    g: 249,
    b: 248,
    a: 1
  }).toRgbString(),
  PaleChestNut: () => tinycolor({
    r: 222,
    g: 163,
    b: 181,
    a: 1
  }).toRgbString(),
  SmokyBlack: () => tinycolor({
    r: 15,
    g: 11,
    b: 11,
    a: 1
  }).toRgbString(),
  GunMetal: () => tinycolor({
    r: 31,
    g: 55,
    b: 61,
    a: 1
  }).toRgbString(),
  PaynesGrey: () => tinycolor({
    r: 68,
    g: 109,
    b: 119,
    a: 1
  }).toRgbString()
}

export default Color;
