<?php
// INTENTIONALLY VULNERABLE - SQL Injection lab exercise
// DO NOT use this pattern in production code

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Vulnerable query: string concatenation without parameterized queries
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";

try {
    $result = $conn->query($query);
} catch (mysqli_sql_exception $e) {
    $result = false;
}

$success = $result && $result->num_rows > 0;
$user = $success ? $result->fetch_assoc() : null;
$isAdmin = $user && $user['role'] === 'admin';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureCorp Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0F172A;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #E2E8F0;
        }
        .result-card {
            background: #1E293B;
            border-radius: 16px;
            padding: 48px 40px;
            width: 420px;
            text-align: center;
            box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .icon { font-size: 48px; margin-bottom: 16px; }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; }
        .success h1 { color: #34D399; }
        .fail h1 { color: #F87171; }
        .desc { color: #94A3B8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px; }
        .user-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
        }
        .user-box span { font-size: 0.85rem; }
        .user-box .label { color: #64748B; }
        .user-box .value { color: #93C5FD; font-weight: 600; }
        a.btn {
            display: inline-block;
            padding: 10px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            transition: opacity 0.2s;
        }
        a.btn:hover { opacity: 0.85; }
        .btn-retry { background: #334155; color: #E2E8F0; }
        .btn-success { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }
    </style>
</head>
<body>
<?php if ($isAdmin): ?>
    <div class="result-card success">
        <div class="icon">🎉</div>
        <h1>SUCCESS</h1>
        <p class="desc"><?= htmlspecialchars($user['username']) ?> 계정으로 관리자 로그인에 성공했습니다.</p>
        <div class="user-box">
            <span><span class="label">계정:</span> <span class="value"><?= htmlspecialchars($user['username']) ?></span></span>
            <span><span class="label">권한:</span> <span class="value">Admin</span></span>
        </div>
    </div>
    <script>
        window.parent.postMessage({ type: 'lab-clear' }, '*');
    </script>
<?php elseif ($success): ?>
    <div class="result-card fail">
        <div class="icon">⚠️</div>
        <h1>로그인 성공 — 하지만...</h1>
        <p class="desc">로그인에 성공했지만 일반 사용자 계정입니다.<br>관리자(admin) 계정으로 로그인해야 미션이 완료됩니다.</p>
        <a href="/" class="btn btn-retry">다시 시도</a>
    </div>
<?php else: ?>
    <div class="result-card fail">
        <div class="icon">❌</div>
        <h1>로그인 실패</h1>
        <p class="desc">잘못된 계정 정보입니다.<br>SQL Injection을 활용해보세요.</p>
        <a href="/" class="btn btn-retry">다시 시도</a>
    </div>
<?php endif; ?>
</body>
</html>
<?php $conn->close(); ?>
