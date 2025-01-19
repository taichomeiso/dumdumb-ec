// カード番号のフォーマット関数
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// 郵便番号のフォーマット関数
export const formatPostalCode = (value: string): string => {
  const v = value.replace(/[^\d]/g, '');
  if (v.length <= 3) return v;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}`;
};

// 電話番号のフォーマット関数
export const formatPhoneNumber = (value: string): string => {
  const v = value.replace(/[^\d]/g, '');
  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
};