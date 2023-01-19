import globalCss from './style.css';
import styles, { stylesheet } from './style.module.css';
import rawCameraPayload, {
  rawInitVarible,
  rawInitFunction,
  rawCreateSession,
  rawSetLastActive,
} from './rawCameraPayload';

const importPayload = (payload: string) => {
  const script = GM_addElement(document.body, 'script', {
    textContent: payload,
  });
};

async function startCapture(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement
) {
  const context = canvas.getContext('2d');
  const frames = [];
  const getBase64Photo = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };
  const makeFrame = () => {
    frames.push(getBase64Photo());
    if (frames.length < 30) {
      makeFrame();
    } else {
      console.debug('Record is end');
    }
  };
  setTimeout(makeFrame, 500);
}
function initFakeCamera() {
  unsafeWindow.startCapture = startCapture;
  unsafeWindow.axios = axios;
  const payloads = [
    rawInitVarible,
    rawInitFunction,
    rawCreateSession,
    rawSetLastActive,
    rawCameraPayload,
  ];
  payloads.forEach((payload) => importPayload(payload));

  unsafeWindow.require(['quizaccess_photo/init'], (module) => {
    module.init = unsafeWindow.goodInit;
    module.createSession = unsafeWindow.goodCreateSession;
    module.startPhoto = unsafeWindow.goodStartPhoto;
    module.set_last_active = unsafeWindow.goodSet_last_active;
  });
}
function fakeCamera() {
  initFakeCamera();
  const content = (
    <>
      <div class="inline-block">
        <img class="custom-canvas max-w-md max-h-md" />
      </div>
      <div class="inline-block">
        <button class="start-record">Start record</button>
        <button class="stop-record">Stop</button>
        <button class="start-play">Play</button>
      </div>
    </>
  );
  const panel = VM.getPanel({
    content: content,
    theme: 'dark',
    style: [globalCss, stylesheet].join('\n'),
  });

  panel.wrapper.style.top = '300px';
  panel.setMovable(true);
  panel.show();
}
export default fakeCamera;
