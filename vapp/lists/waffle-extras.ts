export interface WaffleExtraData {
  name: string;
  image: any;
  woneCost: number;
}

const waffleExtraList: WaffleExtraData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png'),
    woneCost: 0
  },
  {
    name: 'Flames',
    image: require('~/static/waffles/extras/firebackground.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Ribbon',
    image: require('~/static/waffles/extras/ribbon.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Sprinkles',
    image: require('~/static/waffles/extras/sprinkles.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Hearts',
    image: require('~/static/waffles/extras/hearts.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Chocolate Lines',
    image: require('~/static/waffles/extras/chocolatelines.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Strudel  Lines',
    image: require('~/static/waffles/extras/strudellines.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Angel Wings',
    image: require('~/static/waffles/extras/angelwings.png'),
    woneCost: 135000000000000000000
  },
  {
    name: 'Demon Wings',
    image: require('~/static/waffles/extras/demonwings.png'),
    woneCost: 135000000000000000000
  }
]

export default waffleExtraList
