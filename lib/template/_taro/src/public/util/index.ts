/**
 * 获取页面列表
 */
export function getPageList() {
  return getCurrentPages ? getCurrentPages() : [];
}

/**
 * 获取当前页面
 */
export function getCurrentPage() {
  const pageList = getPageList();

  return pageList.length ? pageList[pageList.length - 1] : {};
}

/**
 * 显示全局错误提示
 * @param message
 */
export function showErrorNotify (message: string) {
  // todo
  my.showToast({
    content: message,
    type: 'fail'
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: 'auth_user',
      fail: reject,
      success: () => {
        my.getAuthUserInfo({
          fail: reject,
          success: resolve
        });
      },
    });
  })
}

export function genJumpTrackConfig(sponsor, behavor='task') {
  return {
    level: 3,
    eventId: 'targetJump',
    eventName: '目标跳出',
    extParams: {
      target: {
        targetName: sponsor.sponsorName,
        targetAppId: sponsor.sponsorLinkAppId,
        targetType: 0,
        behavor,
        ext: sponsor ? JSON.stringify(sponsor): ''
      }
    }
  }
}

export function genRandomStr(hashLength: number): string {
  if (!hashLength || typeof (Number(hashLength)) != 'number') return '';
  const ar = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const hs: string[] = [];
  const hl = Number(hashLength);
  const al = ar.length;

  for (let i = 0; i < hl; i++) {
    hs.push(ar[Math.floor(Math.random() * al)])
  }

  return hs.join('')
}

