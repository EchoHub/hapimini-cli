import Taro from '@tarojs/taro';
import Index from './pages/home';
import {auth} from '@/public/util/request';
import {ComponentTracked, TrackConfig} from './components/Track';

import './app.scss';

class App extends ComponentTracked {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: any = {
    pages: [
      'pages/home/index',
    ]
  };

  trackConfig: TrackConfig = {
    willMount: 'onLaunch',
    didShow: 'onShow',
    didHide: 'onHide',
  };

  componentDidMount(): void {
    super.componentDidMount();
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index/>
    )
  }
}

Taro.render(<App/>, document.getElementById('app'));
