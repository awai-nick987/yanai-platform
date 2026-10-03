with open('server.ts', 'r') as f:
    content = f.read()

import_logic = """import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
"""

if "import { normalizeSheetUrls, parseGoogleSheetHtml }" not in content:
    content = content.replace("import express from 'express';", "import express from 'express';\nimport { normalizeSheetUrls, parseGoogleSheetHtml } from './src/utils/sheetResolver';")

sheet_api_logic = """
// Survey App: Fetch Google Sheets securely to bypass CORS
app.get('/api/fetch-sheet', async (req, res) => {
  try {
    const rawUrl = req.query.url as string;
    if (!rawUrl || !rawUrl.trim()) {
      return res.status(400).json({ error: "URLが指定されていません。" });
    }

    const trimmedUrl = rawUrl.trim();
    const candidateUrls = normalizeSheetUrls(trimmedUrl);

    let lastError = "";
    let isAuthError = false;

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/csv, text/tab-separated-values, text/plain, text/html, */*",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          continue;
        }

        const text = await response.text();

        // Check if Google returned an HTML login/permission page
        if (text.includes("accounts.google.com") || text.includes("ServiceLogin")) {
          isAuthError = true;
          continue;
        }

        // If it looks like HTML
        if (text.includes("<table") || (text.includes("<html") && text.includes("<tr"))) {
          const parsedCsv = parseGoogleSheetHtml(text);
          if (parsedCsv && parsedCsv.trim().length > 0) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            return res.status(200).send(parsedCsv);
          }
        }

        // If it's already CSV / plain text
        if (text.trim().length > 0 && !text.includes("<!DOCTYPE html>")) {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          return res.status(200).send(text);
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    if (isAuthError) {
      return res.status(403).json({
        error: "スプレッドシートの閲覧権限がありません。以下のいずれかをご確認ください：\\n1. スプレッドシート右上の「共有」ボタンで、一般的なアクセスを「リンクを知っている全員」を「閲覧者」に設定する。\\n2. または「ファイル」→「共有」→「ウェブに公開」で「公開」をクリックする（形式は変更せずそのままでOKです）。",
      });
    }

    return res.status(400).json({
      error: `スプレッドシートからデータを取得できませんでした（${lastError || "形式を確認してください"}）。URLが正しいか、公開されているかご確認ください。`,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: `スプレッドシート取得中にエラーが発生しました: ${error?.message || "不明なエラー"}`,
    });
  }
});
"""

if "/api/fetch-sheet" not in content:
    content = content.replace("app.get('/api/health'", sheet_api_logic + "\napp.get('/api/health'")

with open('server.ts', 'w') as f:
    f.write(content)
