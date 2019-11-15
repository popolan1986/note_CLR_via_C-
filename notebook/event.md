## 事件
CLR事件模型以委托为基础。委托是调用回掉方法的一种类型安全的方式。

我觉得一个考点可能是如果定义事件：
- 定义事件，继承EventArgs
- 定义事件成员 public event EventHandler<T> EventName
- 定义负责引发事件的方法：protected virtual onEventName(e)
- 定义方法将输入转化为期望事件

## 泛型
泛型实现了“算法重用”。CLR允许创建泛型引用类型和泛型值类型，泛型接口和泛型委托。