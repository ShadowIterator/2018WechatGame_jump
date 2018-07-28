# 综合实验说明文档

## 作者及分工

* 张佳麟
    - 2016013256
    <!-- TODO -->
* 李仁杰
    - 2016013271
    - ShadowIterator@hotmail.com
    - 负责游戏逻辑和对应文档的编写

## 游戏策划

### 玩法

本游戏为类似DoodleJump的小游戏，玩家通过重力感应或按键来控制`角色`(控制方式随游戏进度切换)，其间可以收集不同的`道具`以提高<s>(或降低)</s>游戏体验，`角色`达到的位置越高分数也越高， 同时游戏难度随高度提高。

### 游戏元素
* `角色`
    - 一个可以控制`x`方向速度的圆形生物

* `跳板`

    一个长条状<s>生物</s>，有正反两面，正面指向重力的反方向，当`角色`从正面碰撞`跳板`时，`跳板`会给`角色`一个正方向的`y`方向的速度，游戏中有以下几种`跳板`：

    - `普通跳板`
    - `移动跳板`：按照某一个固定的闭合路线移动
    - `伸缩跳板`：长度可变
    - `地刺`：碰撞时扣除`角色`一点生命值

* `分界线`

    这个元素用于对特定的高度进行标记，控制游戏进程(比如当玩家到达一定高度的时候转换控制方式等)，在实现上，它是一类特殊的`跳板`。

* `道具`

    一个圆形<s>生物</s>，`角色`与`道具`碰撞可以获得不同的效果

    - `数码宝贝蛋`：增加一点`生命值`

    - `弹簧`：给予`角色`一个巨大的向上的初速度

    - `神圣计划`：使得`角色`以一个恒定的速度向上飞行一段时间

    - `护盾`：`角色`获得一个持续一段时间的`护盾`，在`角色`有`护盾`时，`角色`与`怪物`或`地刺`碰撞不扣除`生命值`；`角色`跌落屏幕下方时不扣除`生命值`，但是会清除`护盾`效果

    - `反转`：左右控制反向

* `怪物`

    一个圆形生物，会按照某个固定的随机封闭路线游走。`角色`与`怪物`碰撞会减少一点`生命值`并`重置`。

* `生命值`与`重置`
    - `生命值`：游戏开始时，`角色`共有三点`生命值`，当`角色`碰到`地刺`、`怪物`或者跌落到屏幕下方时，会扣除一点`生命值`，当`角色`的`生命值`为`0`时，游戏结束
    - `重置` ：当`角色`碰到`怪物`或跌落屏幕下方且`生命值`大于`0`时，`角色`会被`重置`
        - 重力向下时，`角色`会被`重置`到屏幕的下方中央的位置，`角色`下方会生成一块`跳板`避免`角色`再次跌落
        - 重力向上时，`角色`会被`重置`到屏幕的正中央
        - `角色`进行`重置`之后，会清除其身上 所有的持续类`道具`效果(包括`护盾`、`反转`和`神圣计划`)

### 游戏参数

几个重要的游戏参数如下：
* `g`：重力
* `stari_density`：`跳板`的密度
* `prop_density`: `道具`的密度
* `enemy_density`: `怪物`的密度
* 各种类型的`跳板`、`道具`所占的比例
* `hero_vx`：英雄左右移动的速度(在重力感应模式下，英雄左右移动的速度由这个参数和手机倾斜程度共同决定)

### 游戏性
总体来说，随着角色到达的高度增高，游戏越难。在某些高度难度会降低，以缓和游戏节奏，游戏难度的改变通过改变游戏参数和章节切换来实现

### 章节切换
由`分界线`实现。在体验版中，我们手动设置三个章节
- 高度为`0`到`6500`是入门章节，这个章节中，随着高度的升高，`stair_density`逐渐减少，`enemy_density`增大
- 高度`6500`到`13000`，重力向上，主要玩法是躲避地刺和怪物，这个阶段的游戏难度较小
- 高度`14000`到`20000`，重力向上，左右控制反向
- <s>打到`20000`是不可能打到`20000`的，这辈子都不可能打到`20000`的</s>


## 界面布局和设计
<!-- TODO -->
  游戏主要有如下几个界面，每个界面的按钮均有图示说明：

  开始界面；游戏界面；结束界面（可查看排行榜或重新开始游戏）；排行榜界面

## 目录结构
- `./js/libs/geometry.js`：封装了游戏所需的基本图形类，向量运算，以及碰撞检测，位置判断等主要功能函数；

- `./js/base/sprite.js`：sprite类提供元素基本信息，游戏主要元素均继承自该类；

- `./js/main.js`：实现游戏各界面切换

- `./js/ctrl/scene.js`：包含与游戏流程相关的全部信息，如游戏相关参数，游戏进行时的刷新，事件响应等

- `./js/ctrl/control.js`：游戏控制器，提供了两种控制方法，按键以及重力感应，默认采用的控制方法为重力感应；

- `./js/openDataContext/index.js`：包含制作排行榜时需要在`开放数据域`进行的操作

- `./js/eles/`：包含`角色`、`跳板`、`道具`、`怪物`等游戏中需要的元素

## 技术实现方案

### 重点难点
实现种类繁多的`跳板`和`道具`以及章节切换功能，并且要易于扩展

### 架构

#### 世界坐标系与屏幕坐标系
- `世界坐标系`：整个世界是一个竖直长条，左下方为坐标原点，`x`轴向右，`y`轴向上，最开始`角色`出生于`y`坐标为`0`的位置，向着`y`坐标增大的方向跳跃
- `屏幕坐标系`：即`canvas`中的坐标系，左上方为坐标原点，`x`轴向右，`y`轴向下
- 坐标转换，我们维护当前屏幕下边框在`世界坐标系`下的`y`坐标，我们定义了一个坐标转换函数`transPos`对坐标进行转换

#### 页面切换
- 页面切换在`main.js`里完成，采用状态机的方式实现

#### 游戏流程
游戏流程在`scene.js`里完成，每一帧里`Scene.update`和`Scene.render`方法被调用
- `Scene.render`方法：
    - 在屏幕左上方和右上方分别绘制得分和生命值
    - 绘制`角色`、`跳板`、`道具`和`怪物`，这四类对象的绘制方法都继承自`Sprite`类，该类接受两个参数`context`和`transPosition`。该类对象通过掉`transPosition`方法把自己的坐标从`世界坐标系`转换到`屏幕坐标系`中，再画到`context`上
- `Scene.update`方法：
    - 先判断游戏状态，如果处于暂停或游戏结束状态，则不更新。
    - 再判断`角色`的状态
        - 如果`角色`需要`重置`且`生命值`大于`0`，则重置`角色`。
        - 如果`角色`生命值为`0`，则调用`main.js`中传入的游戏结束的回调函数，并把游戏置为结束状态
    - 然后让`角色`进行一个单位时间的运动：
        - `角色`和场上所有元素进行碰撞检测，找到与其最先碰撞的元素`nearest_element`
        - 如果角色在小于一个单位时间内就会和`nearest_element`碰撞，则调用`nearest_element.toggle()`方法对`角色`或者`场景`中的别的元素产生影响，然后递归地让角色在剩下的时间内继续运动。
        - 如果`角色`需要大于一个单位时间才能与`nearest_element`碰撞，那么直接移动`角色`
    - 调用`Scene.update_effList()`方法
        - 任何需要监听场景内"时间变化"的对象(比如持续类`道具`需要判断持续时间是否结束)都可以在`Scene`类里面注册一个包含`timePass`，`effOver`，`checkDone`三个字段的对象，每个字段的值都是一个函数。
        - 每次调用`Scene.update_effList()`方法，`Scene`类会进行如下操作：
            - 调用所有注册对象的`timePass`字段
            - 调用所有注册对象的`checkDone`字段，检查该对象的监听是否结束
            - 如果监听结束，调用该对象的`effOver`字段
    - 根据`角色`的坐标更新得分
    - 调用`Scene.update_screen()`方法：
        - 检查是否发生屏幕滚动(`角色`的`y`坐标超过屏幕的一半即认为发生滚动)
        - 如果发生滚动则进行下面的操作
            - 计算滚动的距离(`y`坐标的差值)，
            - 在相差的这段距离内生成`跳板`、`道具`和`怪物`
            - 删除屏幕滚动之后，处于屏幕底端的`元素`
            - 移动背景
            - 更新屏幕底端在`世界坐标系`中的`y`坐标
    - 调用所有元素的`timePass`方法，通知它们更新自己的信息

#### 各类元素的实现
- `跳板`类元素(继承自`Sprite`)
    - `普通跳板`：
        - 在`toggle`方法中设置`角色`的`y`方向速度
    - `地刺`：
        - 继承`普通跳板`的`toggle`方法，并在该方法中，减少`角色`一点生命值
    - `移动跳板`：
        - 继承`普通跳板`的`toggle`方法
        - 在`timePass`方法中，改变自己的位置
    - `伸缩跳板`
        - 继承`普通跳板`的`toggle`方法
        - 在`tiemPass`方法中，改变自己的长度
    - `分界线`
        - 分界线在实现上是一类特殊的`跳板`
        - 在构造时，接受四个参数
            - `分界线`所处的高度`y`
            - `分界线`被触发时，`Scene`中改变的参数和它们的新值
            - `分界线`是否可见
            - 一个函数列表`fList`
            - 分界线是一个正方向向下、高度为`y`、跨越整个屏幕宽度的`跳板`
            - 当`角色`到达`y`的高度时，必然触发这个`跳板`
        - 重写`跳板`的`toggle`函数，这个函数改变`Scene`的参数并依次调用`fList`中的函数
- `道具`类元素(继承自`Sprite`)
    - `弹簧`:
        - 在`toggle`方法中设置`角色`的`y`方向速度
    - `数码宝贝蛋`:
        - 在`toggle`方法中增加`角色`的`生命值`
    - `神圣计划`
        - 在`toggle`方法中设置`角色`的`y`方向速度和一个计数器
        - 在`Scene`中注册一个监听器
            - `timePass`方法减少计数器的值，如果计数器为`0`，设置监听结束标记
            - `checkDone`方法返回监听结束标记
            - `effOver`方法取消这个`道具`对`角色`的影响
    - `护盾`
        - 在`toggle`方法中设置`角色`的`护盾`状态和一个计数器
        - 在`Scene`中注册一个监听器
            - `timePass`方法减少计数器的值，如果计数器为`0`，设置监听结束标记
            - `checkDone`方法返回监听结束标记
            - `effOver`方法取消这个`角色`的`护盾`状态
    - `反转`
        - 在`toggle`方法中交换`Scene`中控制器的方向，设置一个计数器
        - 在`Scene`中注册一个监听器
            - `timePass`方法减少计数器的值，如果计数器为`0`，设置监听结束标记
            - `checkDone`方法返回监听结束标记
            - `effOver`方法把`Scene`中控制器的方向交换回来
- `怪物`(继承自`Sprite`):
    - 在`toggle`方法中减少`角色`一点生命值
    - 在`timePass`方法中改变自己的位置

#### 生成跳板的策略
* 生成`跳板`的函数`appendStairs`接受如下几个参数
    - `L`：要生成`跳板`的区间的下端的`y`坐标
    - `H`：要生成`跳板`的区间的上端的`y`坐标
    - `first_y`：当前`角色`能到达的最高高度
    - `minx`：`角色`到达最高高度的同时能到达的最小的`x`坐标
    - `maxx`：`角色`到达最高高度的同时能到达的最大的`x`坐标
    - `rho`：`跳板`的密度
* `appendStairs`首先生成一条从高度`L`到高度`H`的安全路径(安全路径上的`跳板`根据参数随机在除了`地刺`和`分界线`之外的三种跳板中产生)
* 然后根据`rho`的值随机生成一些别的`跳板`
* 更新`角色`能到达的最大高度和最小、最大`x`坐标

### 排行榜的实现
使用微信的`开放数据域`和`shareCanvas`画布即可

## 亮点

- 除了"向上跳"之外，游戏还有重力反向、控制反向等玩法，具有较高的可玩性
- 对于各种元素的效果实现方法的设计，具有较好的可扩展性(理论上，利用`分界线`的方法可以实现任何种类的跳板)
- <s>反向重力感应很反人类</s>

## 反思
由于对`javascript`的语法特性不是很熟练，并且在前期的设计工作上花的时间不足，导致这次游戏逻辑的架构没有设计得很好，主要体现在对各种元素的效果的实现上。

比如`跳板`类，如果把`跳板`的效果抽象出来(比如变化长度、改变位置等)而不是只是把我当时脑海中想的几个跳板种类抽象出来，可能实现一些由已经实现好的跳板特性"杂交"出来的跳板(比如可以同时改变长度和位置的跳板)会更容易一些。

另一个不好的地方是没有充分利用好`javascript`的函数式特性，在所有元素中，只有后来添加地`分界线`这一元素使用了`javascript`的高阶函数和闭包，而当我把这个元素设计出来之后，我发现似乎所有的元素效果都可以直接用`分界线`元素实现出来，如果我最开始就想到了这种方法的话，写起代码来应该会轻松很多。

## 游戏测试
- 对于各种`跳板`和`道具`的效果主要采用单元测试
- 对于整个游戏采用试玩的方法
- 测试平台有小米、三星、iphon6S、iphone8、iphoneX等
- 建议助教使用安卓进行测试

## 游戏二维码
![avatar](./QRcode.jpg)

## 源代码地址
![https://github.com/ShadowIterator/2018WechatGame_jump/tree/dev_lrj][https://github.com/ShadowIterator/2018WechatGame_jump/tree/dev_lrj]
