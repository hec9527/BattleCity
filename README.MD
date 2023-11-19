<div style="text-align:center;" align="center">

# Battle City

<!-- https://shields.io/ -->

![version](./svg/version.svg)
![node version](./svg/node.svg)
![License](./svg/license-MIT.svg)
![javascript](./svg/js-Es11.svg)
![typescript](./svg/ts.svg)
![vite](./svg/vite.svg)
![author](./svg/author-hec9527.svg)

</div>

[Battle city](https://github.com/hec9527/BattleCity)是经典的红白机游戏之一，其操作简单，玩法经典，经久不衰。本项目使用 `h5` + `ts` + `canvas` 原滋原味的复刻了红白机的游戏逻辑和流程。项目包含多个分支对应不同时期的历史版本。~~同时配有有非常完善的开发文档及日志~~，梳理实现思路和优化方向，~~所有的代码经过严格的测试~~

## 游戏特色

游戏还原度超过90%，同时兼容PC和移动端，随时随地即可享受经典中的经典

## 在线食用

[http://tank.hec9527.top/](http://tank.hec9527.top/)

## 本地享用

```zsh
git clone https://github.com/hec9527/BattleCity.git

cd BattleCity

pnpm install

npm run dev
```

## Roadmap


- [x] 修复：地图编辑界面，生成多个河流时，河流的状态不统一
- [x] 修复：我方坦克出生后获得保护太长，应该适当缩短
- [x] 修复：奖励生成时应该避免生成在坦克附近
- [x] 特性：页面隐藏或者后台的时候，自动暂停游戏 (底层绘制采用requireAnimationFrame API，在页面后台时会自动停止绘制，但是游戏并没有暂停，回到页面会自动运行)
- [ ] 特性：增加更多敌方坦克类型（不同颜色）
- [x] 特性：高级子弹可以消灭草地
- [ ] 特性：新增竹筏，获得后可以过河
- [x] 特性：坦克在冰块上移动后会继续向前移动一小段
- [ ] 特性：游戏开始时可以选择是否允许敌方获得奖励，目前可以通过设定全局属性修改（`window.allowEnemyPick = false`）
- [ ] 特性：新增其它外设适配（手柄控制）
- [x] 流程：添加GAME OVER页面
- [x] 优化：移动端模拟器修改摇杆移动
- [ ] 其它：打包安卓应用，IOS应用（IOS需要开发者账号，且无法分发~弃）
- [x] 其它：增加`github action`自动打包发布
- [ ] 其它：记录历史最高分数，展示历史最高分数
- [x] 其它：修改音效合成，优化游戏音效
- [ ] 其它：增加联网功能，可以远程链接（这是一个大饼，不一定能做）

## 可以做哪些贡献

- 检查地图界面是否正确
- 游戏参数是否合理
- 游戏bug上报
- 建议&意见

## 游戏截图

[查看关卡截图][https://github.com/hec9527/BattleCity/tree/v2/images]

![](images/win_start.png)

## 协议

[MIT](./LICENSE)