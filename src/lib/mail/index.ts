import nodemailer from 'nodemailer';

// メール送信用のトランスポーター設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 注文確認メール送信
export async function sendOrderConfirmation(order: any) {
  const { email } = order.shippingInfo;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '【dumdumb】ご注文ありがとうございます',
    html: `
      <h1>ご注文確認</h1>
      <p>ご注文番号: ${order.id}</p>
      <h2>注文内容</h2>
      <ul>
        ${order.orderItems.map((item: any) => `
          <li>
            ${item.product.name} - ${item.quantity}点
            ${item.size ? `(サイズ: ${item.size})` : ''}
            - ¥${(item.price * item.quantity).toLocaleString()}
          </li>
        `).join('')}
      </ul>
      <p>合計金額: ¥${order.total.toLocaleString()}</p>
      <p>発送までしばらくお待ちください。</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// 在庫アラートメール送信
export async function sendStockAlert({ productName, currentStock, alertLevel }: {
  productName: string;
  currentStock: number;
  alertLevel: number;
}) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `【dumdumb】在庫アラート: ${productName}`,
    html: `
      <h1>在庫アラート</h1>
      <p>以下の商品の在庫が設定された閾値を下回りました。</p>
      <p>商品名: ${productName}</p>
      <p>現在の在庫数: ${currentStock}</p>
      <p>アラート閾値: ${alertLevel}</p>
      <p>早めの在庫補充をご検討ください。</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// 発送通知メール送信
export async function sendShippingNotification(order: any) {
  const { email } = order.shippingInfo;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '【dumdumb】商品を発送しました',
    html: `
      <h1>発送のお知らせ</h1>
      <p>ご注文の商品を発送いたしました。</p>
      <p>ご注文番号: ${order.id}</p>
      <p>到着までしばらくお待ちください。</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}