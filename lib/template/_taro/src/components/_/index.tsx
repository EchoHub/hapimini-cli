import Taro from '@tarojs/taro';
import cx from 'classnames';
import {View} from '@tarojs/components';
import './index.scss';
interface _Props {
  className?: string,
  [key: string]: any,
}
export default function _(props: _Props) {
  const cn = cx('_', props.className);

  return (
    <View className={cn}
      style={props.style}
    >{props.children}</View>
  )
}
