/// <reference path="./entity.d.ts"/>

declare type INotifyEvent<P extends AnyObject = Record<string, unknown>> = {
  type: string;
} & { [K in keyof P]: P[K] };

declare interface ISubScriber {
  notify(event: INotifyEvent): void;
}

declare interface IEventManager {
  addSubscriber(subScriber: ISubScriber, events: string[]): void;
  removeSubscriber(subScriber: ISubScriber): void;
  removeAllSubscribers(): void;
  fireEvent<P extends INotifyEvent = INotifyEvent>(event: P): void;
}

/** event listener event type */

declare interface ICollisionEvent extends INotifyEvent {
  initiator: IEntity;
  entity: IEntity;
}

declare interface IEntityEvent extends INotifyEvent {
  entity: IEntity;
}

declare interface ITankEvent extends INotifyEvent {
  tank: IEntity;
}
declare interface IBulletEvent extends INotifyEvent {
  bullet: IEntity;
}
declare interface IAwardEvent extends INotifyEvent {
  award: IEntity;
}

declare interface IControllerEvent extends INotifyEvent {
  key: string;
}
