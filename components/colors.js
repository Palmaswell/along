import tinycolor from 'tinycolor2';

const colors = {
  yankeesBlue: () => tinycolor(
    {
      r: 30,
      g: 40,
      b: 58,
      a: 1
    }
  ).toRgbString(),
  deepKoamaru: () => tinycolor(
    {
      r: 48,
      g: 56,
      b: 89,
      a: 1
    }
  ).toRgbString(),
  begonia: () => tinycolor(
    {
      r: 255,
      g: 105,
      b: 120,
      a: 1
    }
  ).toRgbString(),
  lightCyan: () => tinycolor(
    {
      r: 222,
      g: 255,
      b: 252,
      a: 1
    }
  ).toRgbString(),
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
    white: () => tinycolor(
      {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      }).toRgbString(),
}

export default colors;
