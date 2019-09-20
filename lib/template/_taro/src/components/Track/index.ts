import {Component} from '@tarojs/taro';
import request from '@/public/util/request';
import {TrackUrl, getTrackStaticParams, TrackDynamicParams} from './config';

export { TrackDynamicParams } from './config';

type TrackConfigParam = TrackDynamicParams | (() => TrackDynamicParams) | string;

type TrackLifeCycle = 'willMount' | 'didMount' | 'willUnmount' | 'didShow' | 'didHide' | 'didCatchError';

export type TrackConfig = {
  [key in TrackLifeCycle]?: TrackConfigParam
}

export class ComponentTracked<P={}, S={}, T=TrackDynamicParams>
  extends Component<P, S> {

  static url = TrackUrl;
  static getTrackStaticParams = getTrackStaticParams;

  trackConfig: TrackConfig = {};

  /**
   * 行为追踪
   * @param trackParams
   */
  $track(trackParams: T) {
    const data = {
      ...ComponentTracked.getTrackStaticParams.call(this),
      ...trackParams
    };

    if (process.env.NODE_ENV === 'production') {
      return request({
        url: ComponentTracked.url,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        data: JSON.stringify(data),
      }).catch(e => console.error('上报数据：', e));
    } else {
      console.log(
        '%c上报数据',
        'color:#fff;font-weight:bold;background:#bbb;padding:2px;'
        , data
      );
    }
  }

  /**
   * 生命周期行为追踪
   * @param lifeCycle
   */
  $trackInLifeCycle(lifeCycle: TrackLifeCycle) {
    const config = this.trackConfig[lifeCycle];
    let params;

    if (typeof config === 'object') {
      params = config;
    } else if (typeof config === 'string') {
      params = {
        eventId: config
      }
    } else if (typeof config === 'function') {
      params = config.call(this);
    }

    params && this.$track(params);
  }

  componentWillMount() {
    this.$trackInLifeCycle('willMount');
  }

  componentDidMount() {
    this.$trackInLifeCycle('didMount');
  }

  componentWillUnmount() {
    this.$trackInLifeCycle('willUnmount');
  }

  componentDidShow() {
    this.$trackInLifeCycle('didShow');
  }

  componentDidHide() {
    this.$trackInLifeCycle('didHide');
  }

  componentDidCatchError() {
    this.$trackInLifeCycle('didCatchError');
  }
}
