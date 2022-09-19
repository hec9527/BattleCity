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

  fireEvent(event: INotifyEvent): void {
    const subscriber = this.subscribers[event.type];
    for (const i in subscriber) {
      subscriber[i].notify(event);
    }
  }
}

class _EventManager {
  private static instance: IEventManager;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EventManager();
    }
    return this.instance;
  }
}

export default _EventManager.getInstance();
