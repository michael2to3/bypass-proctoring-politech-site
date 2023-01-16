// @FIXME very bad design
class CameraThirdParty {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  frames: Array<string>;
  timer: NodeJS.Timer;
  context: CanvasRenderingContext2D;
  nav: any;
  isStarted: boolean;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.isStarted = false;
    this.canvas = canvas;
    this.frames = [];
    this.nav = this.getPermissionMedia();
    this.context = canvas.getContext('2d');
  }

  public startRecord() {
    clearInterval(this.timer);
    this.frames = [];
    this.timer = setInterval(() => {
      this.getPhoto((photo) => {
        this.frames.push(photo);
      });
    }, 1000);
  }
  public stopRecord() {
    clearInterval(this.timer);
  }
  public startPlay() {
    clearInterval(this.timer);
    let index = 0;
    this.timer = setInterval(() => {
      this.frames[index++];
      if (index >= this.frames.length) {
        index = 0;
      }
    }, 1000);
  }

  public async getPhoto(callback: (image: string) => void) {
    if (!this.isStarted) {
      console.log('Start video record');
      this.startVideoStream();
    }
    this.handlerPhoto(callback);
  }
  public async startVideoStream() {
    this.isStarted = true;
    this.nav.getUserMedia(
      { video: true, audio: false },
      (stream) => {
        this.video.srcObject = new Blob([stream], {type:"video/mp4"});
      },
      console.error
    );
  }
  private handlerPhoto(callback: (photo: string) => void) {
    const video = this.video;
    const canvas = this.canvas;
    video.addEventListener('loadedmetadata', () => {
      video.style.width = video.videoWidth + 'px';
      video.style.height = video.videoHeight + 'px';
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.drawImage(video, 0, 0);
      callback(canvas.toDataURL('image/jpeg'));
    });
  }
  private getPermissionMedia() {
    const nav: any = navigator; // Bad hack
    nav.getUserMedia =
      nav.getUserMedia ||
      nav.webkitGetUserMedia ||
      nav.mozGetUserMedia ||
      nav.msGetUserMedia;
    return nav;
  }
}

export default CameraThirdParty;
