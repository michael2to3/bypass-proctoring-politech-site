import globalCss from './style.css';
import styles, { stylesheet } from './style.module.css';
import list from './list';

const handlerEnable = (item: Payload) => {
  const isEnable = item.isEnable;
  item.isEnable = !isEnable;

  GM_setValue(item.name, item.isEnable);

  isEnable ? location.reload() : item.callback();
};

export function Panel() {
  console.debug('Panel start');
  return (
    <>
      <div className={styles.title}>not Cheat panel</div>
      <p className={styles.desc}>This is a panel. You can drag to move it.</p>
      {list.map((item) => (
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={item.isEnable}
            onClick={() => {
              handlerEnable(item);
            }}
          />
          <span className={styles.desc}>{item.desc}</span>
        </label>
      ))}
    </>
  );
}
export default VM.getPanel({
  content: <Panel />,
  theme: 'dark',
  style: [globalCss, stylesheet].join('\n'),
});
