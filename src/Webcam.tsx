export default class Webcam {
  private video: HTMLVideoElement;

  constructor() {
    this.video = document.createElement('video');
  }

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.video.srcObject = stream;
    await this.video.play();
  }

  async stop(): Promise<void> {
    const stream = this.video.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    this.video.srcObject = null;
  }

  async takeSnapshot(): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0);
    const data = canvas.toDataURL('image/jpeg');
    return data;
  }
}
