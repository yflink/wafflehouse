export interface WafflePlateData {
  name: string;
  image: any;
  woneCost: number;
}

const wafflePlateList: WafflePlateData[] = [
  {
    name: 'Plain Plate',
    image: require('~/static/waffles/plates/plain.png'),
    woneCost: 0
  },
  {
    name: 'Black Plate',
    image: require('~/static/waffles/plates/black.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Pink Plate',
    image: require('~/static/waffles/plates/pink.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Orange Plate',
    image: require('~/static/waffles/plates/orange.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Blue Plate',
    image: require('~/static/waffles/plates/blue.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Purple Plate',
    image: require('~/static/waffles/plates/purple.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Red Plate',
    image: require('~/static/waffles/plates/red.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Yellow Plate',
    image: require('~/static/waffles/plates/yellow.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Glass Plate',
    image: require('~/static/waffles/plates/glass.png'),
    woneCost: 200000000000000000000
  },
  {
    name: 'Gold Plate',
    image: require('~/static/waffles/plates/gold.png'),
    woneCost: 200000000000000000000
  }
]

export default wafflePlateList
