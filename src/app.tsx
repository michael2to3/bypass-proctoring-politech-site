import panel from './Panel';
import list from './list';
import savePosition from './savePanelPostiotion';
import hidePanel from './hidePanel';

const showPanel = () => {
  savePosition('mainPanel', panel.wrapper, '116px auto auto 156px');
  hidePanel('mainPanel_hide', panel.wrapper);

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
