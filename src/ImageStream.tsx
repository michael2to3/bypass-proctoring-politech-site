export default class ImageStream {
  private img: HTMLImageElement;
  private intervalId: NodeJS.Timer;

  constructor(img: HTMLImageElement) {
    this.img = img;
  }

  start(frames: string[], interval: number) {
    let i = 0;
    this.intervalId = setInterval(() => {
      if (i === frames.length) i = 0;
      this.img.src = frames[i];
      i++;
    }, interval);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
