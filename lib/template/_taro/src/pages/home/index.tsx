import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import {ComponentTracked, TrackConfig} from '@/components/Track';
import './index.scss';

export default class _ extends ComponentTracked<{}, {}> {
  config: any = {
    navigationBarTitleText: '',
  };

  trackConfig: TrackConfig = {
    willMount: 'onLoad',
    didMount: 'onReady',
    didShow: 'onShow',
    didHide: 'onHide',
    willUnmount: 'onUnload'
  };

  readonly state = { };

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidShow() {
    super.componentDidShow();
  }

  render () {
    return (
      <View className='_'>
      </View>
    )
  }
}
