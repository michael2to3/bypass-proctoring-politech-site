import globalCss from './style.css';
import { stylesheet } from './style.module.css';
import ImageStream from './ImageStream';
import WebcamWrapper from './WrapperWebcam';
import savePosition from './savePanelPostiotion';
import hidePanel from './hidePanel';

const startCapture = (image: HTMLImageElement, timeout: number) => {
  const handlerImage = handlerCapture();
  setInterval(() => {
    handlerImage.src = image.src;
  }, timeout);
  GM_setValue('startCapture', true);
};
const handlerCapture = () => {
  const sectionExam = document.querySelector('#exam');
  if (sectionExam === null) {
    throw new Error('SectionExamNotFound');
  }
  const idVideo = '#exam--video';
  const video: HTMLVideoElement = sectionExam.querySelector(idVideo);
  video.remove();
  const image: HTMLImageElement = document.createElement('img');
  image.id = idVideo;
  sectionExam.appendChild(image);
  return image;
};
async function fakeCamera() {
  const content = (
    <>
      <div class="inline-block">
        <img class="custom-canvas max-w-md max-h-md" />
      </div>
      <div class="inline-block">
        <button
          onCLick={() => {
            stop = false;
            startRealTimeStream();
            webcamWrapper.clearFrames();
            webcamWrapper.start();
            webcamWrapper.startRecording(timeout);
          }}
          class="start-record"
        >
          Start record
        </button>
        <button
          onClick={() => {
            stop = true;
            clearInterval(realTimeStream);
            GM_setValue('startCapture', false);
            GM_setValue('frames', webcamWrapper.getFrames());
          }}
          class="stop-record"
        >
          Stop
        </button>
        <button
          onClick={() => {
            clearInterval(realTimeStream);
            const frames: Array<string> =
              webcamWrapper.getFrames().length !== 0
                ? webcamWrapper.getFrames()
                : GM_getValue('frames');
            imageStream.start(frames, timeout);
          }}
          class="start-play"
        >
          Play
        </button>
        <button
          onClick={() => {
            startCapture(image, timeout);
          }}
          class="start-capture"
        >
          Start Capture
        </button>
      </div>
    </>
  );
  const panel = VM.getPanel({
    content: content,
    theme: 'dark',
    style: [globalCss, stylesheet].join('\n'),
  });

  savePosition('fakeCameraPanel', panel.wrapper, '264px auto auto 468px');
  hidePanel('fakeCameraPanel_hide', panel.wrapper);
  panel.setMovable(true);
  panel.show();

  const timeout = 300;
  const image: HTMLImageElement = panel.root.querySelector('.custom-canvas');
  let stop = false;

  const stopEvent = () => stop;
  const webcamWrapper = new WebcamWrapper(stopEvent);
  const imageStream = new ImageStream(image);

  let realTimeStream: NodeJS.Timer;
  const startRealTimeStream = () => {
    realTimeStream = setInterval(() => {
      const frames = webcamWrapper.getFrames();
      image.src = frames.length <= 0 ? '' : frames[frames.length - 1];
    }, timeout);
  };

  const isStartedCapture: boolean = GM_getValue('startCapture');
  if (isStartedCapture) {
    console.debug('Capture is start!');

    startCapture(image, timeout);
    const frames: Array<string> = GM_getValue('frames');
    if (frames.length <= 10) {
      alert('Very short video for capture');
    }
    imageStream.start(frames, timeout);
    try {
      startCapture(image, timeout);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'SectionExamNotFound') {
          console.debug('Capture is disable');
          GM_setValue('startCapture', false);
          VM.showToast('Capture is disable', {
            duration: 1000,
            theme: 'dark',
          });
        }
      }
    }
  }
}
export default fakeCamera;
