import type { IncomingMessage, ServerResponse } from "http";

interface EmailRequestBody {
  to: string;
  subject: string;
  html: string;
  type?: 'invitation' | 'verification' | 'approval_notification';
}

/**
 * 本番メール自動送信ハンドラー
 * - Resend API または SendGrid / Firebase トリガーに対応
 * - 環境変数 RESEND_API_KEY または SENDGRID_API_KEY が設定されている場合は即時実送信
 * - 未設定時でも開発・テスト用にログ記録およびステータス返却
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  let bodyStr = "";
  for await (const chunk of req) {
    bodyStr += chunk;
  }

  let payload: EmailRequestBody;
  try {
    payload = JSON.parse(bodyStr);
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid JSON body" }));
    return;
  }

  const { to, subject, html } = payload;
  if (!to || !subject || !html) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Missing required fields: to, subject, html" }));
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  try {
    // 1. Resend API経由の実送信
    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || "柳井市まちなか共創プラットフォーム <onboarding@resend.dev>",
          to: [to],
          subject,
          html
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Resend API returned error");
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, provider: "resend", data }));
      return;
    }

    // 2. SendGrid API経由の実送信
    if (sendgridApiKey) {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.MAIL_FROM || "noreply@city-yanai.jp", name: "柳井市まちなか共創プラットフォーム" },
          subject,
          content: [{ type: "text/html", value: html }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid API returned error: ${errorText}`);
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, provider: "sendgrid" }));
      return;
    }

    // 3. APIキー未設定時（シミュレーション・テスト成功応答）
    // 本番キーが設定されるまでの間、エラーで落とさずシミュレーション完了として処理
    console.log(`[Email Dispatch Log] To: ${to} | Subject: ${subject}`);
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      success: true, 
      provider: "simulated_local",
      message: "APIキー未設定のためシミュレーション送信として処理されました。Vercelの環境変数にRESEND_API_KEYを追加すると実メールが配信されます。" 
    }));
  } catch (err: any) {
    console.error("Email delivery failed:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ 
      success: false, 
      error: `メール送信に失敗しました: ${err.message || String(err)}` 
    }));
  }
}
