export type RewardType = 'coupon' | 'physical_gift' | 'no_reward'

export interface GameRewardConfig {
  isEnabled: boolean // هل الجوائز مفعلة؟
  rewardType: RewardType // نوع الجائزة (كوبون / هدية عينية / بدون جوائز)
  
  // إعدادات الكوبون
  couponCode: string
  discountTitle: string
  discountDetails: string
  
  // إعدادات الهدية العينية
  giftItemName: string
  giftPickupInstructions: string
  
  // رسائل التهنئة والواتساب
  customVictoryMsg: string
  whatsappTextTemplate: string
}

export const DEFAULT_GAME_REWARD_CONFIG: GameRewardConfig = {
  isEnabled: true,
  rewardType: 'coupon',
  couponCode: 'ENARAH-HERO',
  discountTitle: 'كوبون أبطال الإنارة الذهبي',
  discountDetails: 'خصم خاص عند إرسال الكود مع طلبيتك عبر الواتساب!',
  giftItemName: 'كشاف سبوت لايت ذكي مجاني من معارضنا',
  giftPickupInstructions: 'استلم هديتك من أي من فروعنا (الليثي، الحميضة، فينيسيا) بإبراز هذه الشاشة!',
  customVictoryMsg: 'أنت بطل أسطوري حقيقي للإنارة! لقد حبست وحش الحمل الزائد وشغلت القاطع الرئيسي للمعرض بنجاح تام.',
  whatsappTextTemplate: 'مرحباً شركة الإنارة الحديثة، فزت بجميع مراحل لعبة بطل الإنارة وحصلت على الجائزة: {REWARD}',
}

const STORAGE_KEY = 'enarah_game_reward_config'

export const getGameRewardConfig = (): GameRewardConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...DEFAULT_GAME_REWARD_CONFIG, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load game reward config:', e)
  }
  return DEFAULT_GAME_REWARD_CONFIG
}

export const saveGameRewardConfig = (config: GameRewardConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // Dispatch custom event to notify GameEngine in real time
    window.dispatchEvent(new Event('enarah_reward_config_updated'))
  } catch (e) {
    console.error('Failed to save game reward config:', e)
  }
}
