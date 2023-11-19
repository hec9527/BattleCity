interface IWidgetConfig {
  x: number | string;
  y: number | string;
  scale: number;
}

type ISimulatorWidgets = 'control' | 'menu' | 'action';

type ISimulatorConfig = Record<ISimulatorWidgets, IWidgetConfig>;
