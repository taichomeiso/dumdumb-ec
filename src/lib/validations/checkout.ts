import { CheckoutFormData, ValidationErrors } from '@/types/checkout';

export function validateCheckoutForm(data: CheckoutFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // お届け先情報のバリデーション
  if (!data.firstName.trim()) errors.firstName = 'お名前（姓）を入力してください';
  if (!data.lastName.trim()) errors.lastName = 'お名前（名）を入力してください';
  if (!data.email.trim()) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }
  if (!data.phone.trim()) {
    errors.phone = '電話番号を入力してください';
  } else if (!/^\d{10,11}$/.test(data.phone.replace(/[-\s]/g, ''))) {
    errors.phone = '有効な電話番号を入力してください';
  }
  if (!data.postalCode.trim()) {
    errors.postalCode = '郵便番号を入力してください';
  } else if (!/^\d{7}$/.test(data.postalCode.replace(/[-\s]/g, ''))) {
    errors.postalCode = '有効な郵便番号を入力してください';
  }
  if (!data.prefecture.trim()) errors.prefecture = '都道府県を選択してください';
  if (!data.city.trim()) errors.city = '市区町村を入力してください';
  if (!data.address1.trim()) errors.address1 = '番地を入力してください';

  // 支払い方法に応じたバリデーション
  if (data.paymentMethod === 'credit') {
    if (!data.cardNumber?.trim()) errors.cardNumber = 'カード番号を入力してください';
    if (!data.cardExpiry?.trim()) errors.cardExpiry = '有効期限を入力してください';
    if (!data.cardCvc?.trim()) errors.cardCvc = 'セキュリティコードを入力してください';
    if (!data.cardName?.trim()) errors.cardName = 'カード名義を入力してください';
  } else if (data.paymentMethod === 'bank') {
    if (!data.bankName?.trim()) errors.bankName = '銀行名を入力してください';
    if (!data.branchName?.trim()) errors.branchName = '支店名を入力してください';
    if (!data.accountType) errors.accountType = '口座種別を選択してください';
    if (!data.accountNumber?.trim()) errors.accountNumber = '口座番号を入力してください';
    if (!data.accountName?.trim()) errors.accountName = '口座名義を入力してください';
  }

  return errors;
}

export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];