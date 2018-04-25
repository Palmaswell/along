import tinycolor from 'tinycolor2';

const colors = {
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

  aero: () => tinycolor(
    {
      r: 114,
      g: 181,
      b: 236,
      a: 1
    }).toRgbString(),

  celestialBlue: () => tinycolor(
    {
      r: 69,
      g: 145,
      b: 209,
      a: 1
    }).toRgbString(),

  navajoWhite: () => tinycolor(
    {
      r: 255,
      g: 223,
      b: 166,
      a: 1
    }).toRgbString(),

  floralWhite: () => tinycolor(
    {
      r: 255,
      g: 249,
      b: 239,
      a: 1
    }).toRgbString(),

  princetonOrange: () => tinycolor(
    {
      r: 244,
      g: 125,
      b: 49,
      a: 1
    }).toRgbString(),
}

export default colors;
