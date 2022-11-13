import { removeFromArr } from '../util';

type ISubscriberList = {
  [K in string]: ISubScriber[];
};

class EventManager implements IEventManager {
  private subscribers: ISubscriberList = {};

  addSubscriber(subScriber: ISubScriber, events: string[]): void {
    for (const i in events) {
      if (!this.subscribers[events[i]]) {
        this.subscribers[events[i]] = [];
      }
      this.subscribers[events[i]].push(subScriber);
    }
  }

  removeSubscriber(subscriber: ISubScriber): void {
    for (const i in this.subscribers) {
      if (this.subscribers[i].includes(subscriber)) {
        removeFromArr(this.subscribers[i], subscriber);
      }
    }
  }

  removeAllSubscribers(): void {
    this.subscribers = {};
  }

  fireEvent<T extends INotifyEvent>(event: T): void {
    [...(this.subscribers[event.type] || [])].forEach(entity => entity.notify(event));
  }
}

export default new EventManager();
