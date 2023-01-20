import panel from './Panel';
import list from './list';
import savePosition from './savePanelPostiotion';

const showPanel = () => {
  savePosition('mainPanel', panel.wrapper, '116px auto auto 156px');

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
