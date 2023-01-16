import globalCss from './style.css';
import styles, { stylesheet } from './style.module.css';

const cameraDetect = () => {
  return (
    document.contains(document.querySelector('.camera')) &&
    document.contains(document.querySelector('.photo-block__header'))
  );
};
const getPhoto = () => {
  const captureId = '#take-photo--video';
  const canvas: HTMLCanvasElement = document.querySelector(captureId);
  if (canvas === null || canvas === undefined) {
    console.error('Nothing to capture');
  }
  return canvas.toDataURL('image/jpeg');
};
const captureVideo = () => {
  const captureId = '#take-photo--video';
  const image = document.createElement('img');
  image.id = captureId;
  const sectionTakePhoto = document.getElementById('take-photo');
  sectionTakePhoto.querySelector(captureId).remove();
  sectionTakePhoto.appendChild(image);
};

class CaptureVideo {
  frames: Array<string>;
  timer: NodeJS.Timer;
  timeout: number;
  mincount: number;
  image: HTMLImageElement;
  view: HTMLImageElement;

  constructor(view: HTMLImageElement = null, timeout = 1000, mincount = 10) {
    this.view = view;
    this.timeout = timeout;
    this.mincount = mincount;
    this.frames = [];
  }
  public play() {
    clearInterval(this.timer);
    let index = 0;
    if (this.frames.length < this.mincount) {
      throw new Error('Very short video');
    }
    this.timer = setInterval(() => {
      const frame = this.frames[index];
      this.image.src = frame;
      index++;
      if (index >= this.frames.length) {
        index = 0;
      }
    }, this.timeout);
  }
  public stop() {
    clearInterval(this.timer);
  }
  public record() {
    clearInterval(this.timer);
    this.frames = [];
    setInterval(() => {
      const photo = getPhoto();
      this.frames.push(photo);
      if (this.view !== null) {
        this.view.src = photo;
      }
    }, this.timeout);
  }
}

function fakeCamera() {
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

  panel.wrapper.style.top = '200px';
  panel.setMovable(true);
  panel.show();

  const root = panel.root;
  const image: HTMLImageElement = root.querySelector('img');
  const capture = new CaptureVideo(image);

  const btnStartRecord: HTMLButtonElement = root.querySelector('.start-record');
  const btnStop: HTMLButtonElement = root.querySelector('.stop-record');
  const btnStartPlay: HTMLButtonElement = root.querySelector('.start-play');

  btnStartRecord.onclick = () => {
    capture.record();
  };
  btnStop.onclick = () => {
    capture.stop();
  };
  btnStartPlay.onclick = () => {
    capture.play();
  };
}
export default fakeCamera;
