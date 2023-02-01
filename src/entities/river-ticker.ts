import EVENT from '../event';
import StatusToggle from '../object/status-toggle';

export default class RiverTicker {
  private readonly eventManager = EVENT.EM;
  private readonly tickStatus = new StatusToggle([0, 1], 45);
  private lastStatus = 1;

  public update() {
    this.tickStatus.update();
    const status = this.tickStatus.getStatus();

    if (status != this.lastStatus) {
      this.eventManager.fireEvent<IRiverEvent>({ type: EVENT.BRICK.RIVER_FLOW, status: this.tickStatus.getStatus() });
      this.lastStatus = status;
    }
  }
}
