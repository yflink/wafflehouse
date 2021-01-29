export interface WafflePlateData {
  name: string;
  image: any;
  oneCost: string;
}

const wafflePlateList: WafflePlateData[] = [
  {
    name: 'Plain Plate',
    image: require('~/static/waffles/plates/plain.png'),
    oneCost: '0'
  },
  {
    name: 'Black Plate',
    image: require('~/static/waffles/plates/black.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Pink Plate',
    image: require('~/static/waffles/plates/pink.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Orange Plate',
    image: require('~/static/waffles/plates/orange.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Blue Plate',
    image: require('~/static/waffles/plates/blue.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Purple Plate',
    image: require('~/static/waffles/plates/purple.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Red Plate',
    image: require('~/static/waffles/plates/red.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Yellow Plate',
    image: require('~/static/waffles/plates/yellow.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Glass Plate',
    image: require('~/static/waffles/plates/glass.png'),
    oneCost: '200000000000000000000'
  },
  {
    name: 'Gold Plate',
    image: require('~/static/waffles/plates/gold.png'),
    oneCost: '1000000000000000000000'
  }
]

export default wafflePlateList
