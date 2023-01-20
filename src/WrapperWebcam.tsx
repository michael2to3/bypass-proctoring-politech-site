import Webcam from './Webcam';

export default class WebcamWrapper {
  private webcam: Webcam;
  private frames: string[] = [];
  private intervalId: NodeJS.Timer;
  private stopEvent: () => boolean;

  constructor(stopEvent: () => boolean) {
    this.webcam = new Webcam();
    this.stopEvent = stopEvent;
  }

  async start(): Promise<void> {
    await this.webcam.start();
  }
  async stop(): Promise<void> {
    await this.webcam.stop();
    clearInterval(this.intervalId);
  }
  async takeSnapshot(): Promise<string> {
    const imageData = await this.webcam.takeSnapshot();
    this.frames.push(imageData);
    return imageData;
  }
  async startRecording(interval: number): Promise<void> {
    this.intervalId = setInterval(async () => {
      if (this.stopEvent()) {
        await this.stop();
      } else {
        await this.takeSnapshot();
      }
    }, interval);
  }

  getFrames(): string[] {
    return this.frames;
  }
  clearFrames() {
    this.frames = [];
  }
}
