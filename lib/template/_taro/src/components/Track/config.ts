import cst from '@/public/constant';

// 埋点接口链接
export const TrackUrl = process.env.TRACE ? '' : '';

// 埋点接口静态参数 (不需要从外部传入）
export function getTrackStaticParams(){
  return {
    appId: cst.AUTH_APP_ID,
    appKey: cst.STAT_KEY,
    type: cst.APP_TYPE,
    sessionId: cst.SESSION_ID,
    datetime: +new Date(),
    level: this.$componentType === 'PAGE' ? 2 : 1
  }
}

// 埋点接口动态参数接口 (需要从外部传入）
export interface TrackDynamicParams {
  eventId: string,
  level?: 1 | 2 | 3 | number,
  eventName?: string,
  [k: string]: any
}
