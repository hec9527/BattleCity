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
export function isBaseEvent(event: INotifyEvent): event is IBaseEvent {
  return !!event.base;
}
export function isBulletEvent(event: INotifyEvent): event is IBulletEvent {
  return !!event.bullet;
}
export function isBulletExplosionEvent(event: INotifyEvent): event is IBulletExplosionEvent {
  return !!event.bullet && event.type === EVENT.BULLET.DESTROYED;
}
export function isAwardEvent(event: INotifyEvent): event is IAwardEvent {
  return !!event.award;
}
export function isExplosionEvent(event: INotifyEvent): event is IExplosionEvent {
  return !!event.target;
}
export function isEnemyTankKilledEvent(event: INotifyEvent): event is IEnemyTankKilledEvent {
  return isTankEvent(event) && !!event.killer;
}
export function isRiverEvent(event: INotifyEvent): event is IRiverEvent {
  return event.type === EVENT.BRICK.RIVER_FLOW;
}
