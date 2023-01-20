const savePosition = (id: string, panel: HTMLElement, defaultValue: string) => {
  const inset: string = GM_getValue(id) ? GM_getValue(id) : defaultValue;
  panel.style.inset = inset;
  panel.onmouseup = () => {
    GM_setValue(id, panel.style.inset);
  };
};
export default savePosition;
