# Track
> 用户行为追踪组件

## 配置与引入
配置ComponentTracked中config.ts文件
```
// 埋点接口链接
export const TrackUrl = 'https://www.google.com';

// 埋点接口静态参数 (不需要从外部传入）
export const getTrackStaticParams = () => ({
  appId: '',
  appKey: '',
  type: '',
  sessionId: '',
  datetime: +new Date()
});

// 埋点接口动态参数接口 (需要从外部传入）
export interface TrackDynamicParams {
  level: 1 | 2 | 3,
  eventId: string,
  eventName?: string,
  [k: string]: any
}

```

需要进行追踪的组件，继承ComponentTracked组件。特殊情况下，可以自定义埋点数据格式一并传入，自定义数据格式将覆盖默认接口。
```
import {ComponentTracked, TrackDynamicParams} from '@/components/Track';

interface customTrackParams extends TrackDynamicParams{
  key?: string
}

export default class Index 
  extends ComponentTracked<{}, {}, customTrackParams> {
  ...
}

```

## App, Page级别使用
需要对生命周期进行埋点追踪时，配置组件内的trackConfig对象，trackConfig格式为
```
[lifeCycle]: TrackDynamicParams | (() => TrackDynamicParams);
```
其中didMount对应生命周期componentDidMount, willMount对应componentWillMount，以此类推。
```
import {ComponentTracked, TrackConfig} from '@/components/Track';

export default class Index extends ComponentTracked {

  trackConfig: TrackConfig = {
    didMount: {
      level: 2,
      eventId: 'didMount'
    },
    didShow() { // 为function时会自动绑定this为当前组件
      return {
        level: 2,
        eventId: 'didShow'
      }
    },
    willUnmount: {...},
    didShow: {...},
    didHide: {...},
    didCatchError: {...}
  };
}
```
若组件中同时定义了某声明周期的trackConfig和钩子函数，需要调用super方法手动执行父类同名方法，也可用于手动控制触发埋点请求时机。
```
import {ComponentTracked, TrackConfig} from '@/components/Track';

export default class Index extends ComponentTracked {

  trackConfig: TrackConfig = {
    didMount: {
      level: 2,
      eventId: 'didMount'
    },
    didShow() { 
      return {
        level: 2,
        eventId: 'didShow'
      }
    },
  };
  
  componentDidMount() {
    super.componentDidMount();
    ...
  }
  
  componentDidShow() {
    if (necessary)
      super.componentDidShow();
  }
}
```

## Event级别使用
直接调用this.$track()方法，若无App, Page级别的使用，则无需配置trackConfig。
```
import {ComponentTracked} from '@/components/Track';

export default class Index extends ComponentTracked {

  eventHandler() {
    this.$track({
      level: 3,
      eventId: 'trigger'
    })
  }
}
```

