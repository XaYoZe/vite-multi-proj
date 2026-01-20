import { apiPost } from '../utils/axios';

export interface ApiAccessReq {
  /** BP3A.251105.015 */
  authToken: string;
  /** 设备类型
   * + 脸书类型：1
   * + 谷歌类型：2
   * + 苹果类型：3
   * + 游客类型：4
   */
  loginMethod: number;
}

interface ApiAccessUserInfo {
  /** 个性签名 / 简介 */
  about: string;
  /** 审核状态：0-待审核，1-审核通过，2-审核拒绝 */
  auditStatus: number;
  /** 头像图片 URL */
  avatar: string;
  /** 头像状态：0-正常，1-审核中，2-审核不通过 */
  avatarStatus: number;
  /** 生日 */
  birthday: string;
  /** 当前所在国家 */
  country: string;
  /** 首次充值时间（时间戳，毫秒） */
  firstRechargeTime: number;
  /** 关注数量 */
  followNum: number;
  /** 性别：0-未知，1-男，2-女 */
  gender: number;
  /** 是否拥有会员权益 */
  hasEquity: false;
  /** 是否有违规头像：0-无，1-有 */
  hasIllegalAvatar: number;
  /** 是否被封禁 */
  isBlock: false;
  /** 是否为虚假主播（风控标记） */
  isFakeBroadcaster: false;
  /** 是否已设置密码 */
  isHavePassword: false;
  /** 是否多设备登录（或多开） */
  isMultiple: false;
  /** 是否已充值过（历史充值记录） */
  isRecharge: true;
  /** 是否开启语音通话免打扰 */
  isSwitchNotDisturbCall: false;
  /** 是否开启 IM 消息免打扰 */
  isSwitchNotDisturbIm: false;
  /** 是否是 VIP 用户 */
  isVip: false;
  /** 使用语言 */
  language: string;
  /** 昵称 */
  nickname: string;
  /** 获得的点赞/赞赏数量 */
  praiseNum: number;
  /** 注册时的国家 */
  registerCountry: string;
  /** 融云 IM 令牌，用于即时通讯连接 */
  rongcloudToken: string;
  /** 用户唯一 ID */
  userId: string;
  /** 用户类型 */
  userType: number;
}

export interface ApiAccessRes {
  /** 是否完成注册  */
  isCompleteRegister: boolean;
  /** 是否第一次登录 */
  isFirstRegister: boolean;
  token: string;
  userInfo: ApiAccessUserInfo;
}

/**
 *  登录注册接口（三方）
 */
export const apiAccess = (data: ApiAccessReq) => {
  return apiPost<ApiAccessRes>('/account/access', data);
};
