import rawCameraPayload from './rawCameraPayload';

class ServiceCamera {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  sectionTakePhoto: HTMLElement;
  capturePhoto: HTMLImageElement;
  rVideo: Array<string>;
  interval: NodeJS.Timer;
  countFrame: number;
  constructor() {
    this.video = document.querySelector('#take-photo--video');
    this.canvas = document.querySelector('#take-photo--canvas');
    this.canvas.style.display = 'block';

    this.canvas.style.height = '500px';
    this.canvas.style.width = '500px';
    this.sectionTakePhoto = document.getElementById('take-photo');
    this.capturePhoto = document.createElement('img');
    this.capturePhoto.id = 'take-photo--video';
    this.rVideo = [];
    this.countFrame = 5;
  }
  public record() {
    this.visibleReqServer();
    this.rVideo = [];
    console.debug('Record start');
    let index = 0;
    this.interval = setInterval(() => {
      this.rVideo.push(this.getFrame());
      if (++index >= this.countFrame) {
        console.debug('Record done');
        clearInterval(this.interval);
      }
    }, 1000);
  }
  public play(repeat = true) {
    clearInterval(this.interval);
    this.visibleReqServer();
    if (this.rVideo.length != this.countFrame) {
      console.error(
        'Frame video corrupt! - ',
        this.rVideo.length,
        this.countFrame
      );
    }
    this.video.id = '';
    this.video.remove();
    this.sectionTakePhoto.appendChild(this.capturePhoto);

    let index = 0;
    this.interval = setInterval(() => {
      this.drawFrame(this.rVideo[index++]);
      if (index >= this.rVideo.length) {
        if (!repeat) {
          clearInterval(this.interval);
        }
        index = 0;
      }
    }, 1000);
  }
  private visibleReqServer() {
    (
      document.querySelector('#take-photo') as HTMLTableSectionElement
    ).style.display = 'block'; // Parent take photo canvas
  }
  private drawFrame(base64: string) {
    const header = 'data:image/jpeg;base64,';
    this.capturePhoto.src = header + base64;
    const loadEvent = new Event('loadedmetadata');

    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // @FIXME
    setTimeout(() => {
      console.debug('Dispatch!');
      this.capturePhoto.dispatchEvent(loadEvent);
      setTimeout(() => {
        this.canvas.width = 500;
        this.canvas.height = 500;
      }, 1000);
    }, 5000);
  }
  private getFrame() {
    const image = this.canvas.toDataURL('image/jpeg');
    const base64 = image.split(',')[1];
    return base64;
  }
}

const cameraDetect = () => {
  return (
    document.contains(document.querySelector('.camera')) &&
    document.contains(document.querySelector('.photo-block__header'))
  );
};

const handlerCamera = () => {
  console.debug('Camera is found');

  const warningText = document.createElement('span');
  warningText.innerText = 'Capture is enable';
  warningText.style.color = 'red';

  const containCamera = document.querySelector('.camera');
  containCamera.appendChild(warningText);

  const service = new ServiceCamera();
  const recordButton = document.createElement('button');
  recordButton.textContent = 'Record';
  recordButton.onclick = () => {
    service.record();
    // @FIXME
    setTimeout(() => {
      service.play();
    }, 1000 * 10);
  };
  containCamera.appendChild(recordButton);

  const playButton = document.createElement('button');
  playButton.textContent = 'Play';
  playButton.onclick = () => {
    service.play();
  };
  containCamera.appendChild(playButton);
};
const fakeCamera = () => {
  console.debug('Fake camera start');
  const intDetect = setInterval(() => {
    if (cameraDetect()) {
      handlerCamera();
      clearInterval(intDetect);
    }
  }, 100);
};

export default fakeCamera;
