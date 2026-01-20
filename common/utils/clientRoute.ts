// web页面跳转	out_jump 是否跳转至app外

const SHEME = 'scheme://scheme.com';

interface ClientRoute {
  /** app主tab	index:0 :home 1:party 2:chat 3:me */
  main_tab: { index: 0 | 1 | 2 | 3 };
  /** 语音房跳转	roomId房间id */
  voice_room: { roomId: string };
  /** 用户私聊	conversationId 聊天id */
  private_message_page: { conversationId: string };
  /** 个人资料页面跳转	userid 用户id */
  user_profile: { userid: string };
  /** 钱包 */
  balance_recharge: {};
  /** 设置 */
  setting: {};
  /** 背包 */
  backpack: {};
  /** 金币钻石流水 */
  trading_record: {};
  /** 新关注 */
  new_followers: {};
  /** 搜索 */
  search: {};
  /** 官方消息 */
  official_messages: {};
  /** 系统消息 */
  system_notification: {};
}

export const jumpRoute = <T extends keyof ClientRoute>(route: T, params?: ClientRoute[T]) => {
  let url = `${SHEME}/${route}`;
  if (params) {
    Object.entries(params).forEach((key, i) => {
      if (i === 0) {
        url += '?';
      } else {
        url += '&';
      }
      url += key.join('=');
    });
  }
  window.location.href = url;
};
