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
  tank: ITank;
}

declare interface IBaseEvent extends INotifyEvent {
  base: IEntity;
}

declare interface IBulletEvent extends INotifyEvent {
  bullet: IBullet;
}

declare interface IBulletExplosionEvent extends IBulletEvent {
  explosion: boolean;
}

declare interface IAwardEvent extends INotifyEvent {
  award: IEntity;
  picker?: IEntity;
}

declare interface IExplosionEvent extends INotifyEvent {
  target: IEntity;
}

declare interface IEnemyTankKilledEvent extends ITankEvent {
  killer: IAllyTank;
}

declare interface IRiverEvent extends INotifyEvent {
  status: number;
}

declare interface IAwardDetectEvent extends INotifyEvent {
  entities: IEntity[];
}

declare interface IControllerEvent extends INotifyEvent {
  type: 'KEY_PRESS' | 'KEY_RELEASE';
  key: string;
}
