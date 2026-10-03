// Google Sign-In 初期化
function initGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: '329273326471-bts2h00d7niiugike6s97mdgbma0lhh4.apps.googleusercontent.com', // ← ここに YOUR クライアント ID を入力
    callback: handleCredentialResponse
  });

  // ログインボタンを render
  google.accounts.id.renderButton(
    document.getElementById('google-login-btn'),
    {
      theme: 'outline',
      size: 'large',
      text: 'signin_with'
    }
  );
}

// ログインコールバック
function handleCredentialResponse(response) {
  // JWT トークンをデコード
  const base64Url = response.credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  const userData = JSON.parse(jsonPayload);
  
  // ログイン状態を保存
  localStorage.setItem('googleUser', JSON.stringify(userData));
  localStorage.setItem('googleToken', response.credential);

  // UI 更新
  updateUIAfterLogin(userData);

  console.log('✅ Google ログイン成功:', userData);
}

// ログイン後 UI 更新
function updateUIAfterLogin(userData) {
  const loginBtn = document.getElementById('google-login-btn');
  if (loginBtn) {
    loginBtn.style.display = 'none';
  }

  const userInfo = document.getElementById('user-info');
  if (userInfo) {
    userInfo.innerHTML = `
      <div style="padding: 15px; background: #d4edda; border-radius: 4px; margin: 20px;">
        <p>✓ ログイン中: <strong>${userData.name}</strong> (${userData.email})</p>
        <button onclick="handleLogout()"
# ヘッダーに Google Sign-In ライブラリを追加
sed -i '' '/<\/head>/i\
  <script src="https://accounts.google.com/gsi/client" async defer></script>
' frontend/index.html

# body の最後に google-auth.js スクリプトを追加
sed -i '' '/<\/body>/i\
  <script src="scripts/google-auth.js"></script>
' frontend/index.html

echo "✓ Google Sign-In script added"
# index.html のヘッダー直下（<header> タグの後）にログインボタンを追加
sed -i '' '/<\/header>/a\
  <div style="padding: 20px; text-align: center;"><div id="google-login-btn"></div><div id="user-info"></div></div>
' frontend/index.html

echo "✓ Login button section added"
# クライアント ID を入力してください
read -p "Google OAuth Client ID を入力: " CLIENT_ID

# google-auth.js を更新
sed -i '' "s//$CLIENT_ID/g" frontend/scripts/google-auth.js

echo "✓ Client ID updated"
cp frontend/index.html ./
cp -r frontend/scripts ./
npx vercel --prod --force

cd ~/yanai-platform

# index.html から Google Sign-In スクリプトを削除
sed -i '' '/gsi\/client/d' frontend/index.html
sed -i '' '/google-auth.js/d' frontend/index.html
sed -i '' '/<div id="google-login-btn"/,/<\/div>/d' frontend/index.html
sed -i '' '/<div id="user-info"/,/<\/div>/d' frontend/index.html

echo "✓ index.html から Google ログイン削除"
# admin.html に Google Sign-In ライブラリを追加
sed -i '' '/<\/head>/i\
  <script src="https://accounts.google.com/gsi/client" async defer></script>
' frontend/admin.html

# admin.html の body 最後に google-auth.js を追加
sed -i '' '/<\/body>/i\
  <script src="scripts/google-auth.js"></script>
' frontend/admin.html

# workspace.html に Google Sign-In ライブラリを追加
sed -i '' '/<\/head>/i\
  <script src="https://accounts.google.com/gsi/client" async defer></script>
' frontend/workspace.html

# workspace.html の body 最後に google-auth.js を追加
sed -i '' '/<\/body>/i\
  <script src="scripts/google-auth.js"></script>
' frontend/workspace.html

echo "✓ admin.html と workspace.html に Google ログイン追加"
# admin.html のヘッダー直下にログインセクションを追加
sed -i '' '/<\/header>/a\
  <div style="padding: 20px; text-align: center;"><div id="google-login-btn"></div><div id="user-info"></div></div>
' frontend/admin.html

# workspace.html のヘッダー直下にログインセクションを追加
sed -i '' '/<\/header>/a\
  <div style="padding: 20px; text-align: center;"><div id="google-login-btn"></div><div id="user-info"></div></div>
' frontend/workspace.html

echo "✓ ログインボタンセクションを追加"
cp frontend/index.html ./
cp frontend/admin.html ./
cp frontend/workspace.html ./
cp -r frontend/scripts ./

npx vercel --prod --force
https://yanai-platform.vercel.app                   ← ログインなし ✅
https://yanai-platform.vercel.app/admin.html        ← Google ログイン表示 ✅
https://yanai-platform.vercel.app/workspace.html    ← Google ログイン表示 ✅
npx vercel --prod --force
cd ~/yanai-platform

# admin.html に Google スクリプトが入っているか確認
grep "gsi/client" frontend/admin.html

# google-auth.js が入っているか確認
grep "google-auth.js" frontend/admin.html
# admin.html のバックアップ
cp frontend/admin.html frontend/admin.html.backup

# テキストエディタで編集（または以下のコマンドで自動追加）
cat >> frontend/admin.html << 'EOF'

<script src="https://accounts.google.com/gsi/client" async defer></script>
<script src="scripts/google-auth.js"></script>
