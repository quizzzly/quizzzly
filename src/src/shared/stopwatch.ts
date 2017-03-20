export class Stopwatch {
  private milliseconds: number = 0;
  private startMilliseconds: number;

  public start(): void {
    this.startMilliseconds = (new Date()).getTime();
  }

  public clear() {
    this.milliseconds = 0;
    this.startMilliseconds = (new Date()).getTime();
  }

  public getTime() {
    this.add();
    return (this.milliseconds / 1000).toFixed(2).toString();
  }

  private add() {
    const currMilliseconds = (new Date()).getTime();
    this.milliseconds = currMilliseconds - this.startMilliseconds;
  }
}
