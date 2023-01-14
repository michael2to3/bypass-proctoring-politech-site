import disableMouseEvent from './disableMouseEvent';
import fakeCamera from './fakeCamera';

const dumm = () => {}
const list: Array<Payload> = [
  {
    desc: 'Disable mouse event/unfocus window',
    name: 'disableMouseEvent',
    callback: disableMouseEvent,
    isEnable: GM_getValue('disableMouseEvent'),
  },
  {
    desc: 'Fake camera enable(tested)',
    name: 'fakeCamera',
    callback: fakeCamera,
    isEnable: false,
  },
  {
    desc: 'Remeber session forewer(not work)',
    name: 'saveSession',
    callback: dumm,
    isEnable: false,
  },
  {
    desc: 'Slow down time(not work)',
    name: 'slowDown',
    callback: dumm,
    isEnable: false
  }
];
list.forEach((item) => item.isEnable = GM_getValue(item.name, false))

export default list;
