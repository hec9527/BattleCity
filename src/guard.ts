import EVENT from './event';

export function isCollisionEvent(event: INotifyEvent): event is ICollisionEvent {
  return event.type === EVENT.COLLISION.BORDER || event.type === EVENT.COLLISION.ENTITY;
}
export function isControlEvent(event: INotifyEvent): event is IControllerEvent {
  return event.type === EVENT.KEYBOARD.PRESS || event.type === EVENT.KEYBOARD.RELEASE;
}
export function isEntityEvent(event: INotifyEvent): event is IEntityEvent {
  return !!event.entity;
}
export function isTankEvent(event: INotifyEvent): event is ITankEvent {
  return !!event.tank;
}
export function isBulletEvent(event: INotifyEvent): event is IBulletEvent {
  return !!event.bullet;
}
export function isAwardEvent(event: INotifyEvent): event is IAwardEvent {
  return !!event.award;
}
