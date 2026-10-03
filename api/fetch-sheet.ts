import type { IncomingMessage, ServerResponse } from "http";
import { normalizeSheetUrls, parseGoogleSheetHtml } from "../src/utils/sheetResolver";

export default async function handler(req: IncomingMessage & { query?: Record<string, string> }, res: ServerResponse) {
  try {
    const parsedUrl = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
    const rawUrl = parsedUrl.searchParams.get("url") || (req.query && req.query.url);

    if (!rawUrl || !rawUrl.trim()) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "URLが指定されていません。" }));
      return;
    }

    const trimmedUrl = rawUrl.trim();
    const candidateUrls = normalizeSheetUrls(trimmedUrl);

    let lastError = "";
    let isAuthError = false;

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(parsedCsv);
            return;
          }
        }

        // If it's already CSV / plain text
        if (text.trim().length > 0 && !text.includes("<!DOCTYPE html>")) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end(text);
          return;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    if (isAuthError) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            "スプレッドシートの閲覧権限がありません。以下のいずれかをご確認ください：\n1. スプレッドシート右上の「共有」ボタンで、一般的なアクセスを「リンクを知っている全員」を「閲覧者」に設定する。\n2. または「ファイル」→「共有」→「ウェブに公開」で「公開」をクリックする（形式は変更せずそのままでOKです）。",
        })
      );
      return;
    }

    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `スプレッドシートからデータを取得できませんでした（${lastError || "形式を確認してください"}）。URLが正しいか、公開されているかご確認ください。`,
      })
    );
  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `スプレッドシート取得中にエラーが発生しました: ${error?.message || "不明なエラー"}`,
      })
    );
  }
}
