const hidePanel = (id: string, panel: HTMLElement) => {
  panel.style.overflow = 'hidden';
  let isHide: boolean = GM_getValue(id) ? GM_getValue(id) : false;
  const makeHide = (toHide: boolean) => {
    if (toHide) {
      panel.style.height = '30px';
      panel.style.width = '30px';
    } else {
      panel.style.height = 'unset';
      panel.style.width = 'unset';
    }
  };
  makeHide(isHide);
  panel.ondblclick = () => {
    isHide = !isHide;
    makeHide(isHide);
    GM_setValue(id, isHide);
  };
};
export default hidePanel;
