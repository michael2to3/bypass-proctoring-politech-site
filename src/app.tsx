import panel from './Panel';
import list from './list';

const showPanel = () => {
  panel.wrapper.style.top = '100px';
  panel.setMovable(true);
  panel.show();
};
const startEnableFeature = () => {
  list.forEach((item) => (item.isEnable ? item.callback() : 0));
};
const init = () => {
  startEnableFeature();
  showPanel();
};

init();
