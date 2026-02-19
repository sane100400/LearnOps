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
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #E2E8F0;
        }
        .target-banner {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 10px 20px;
            margin-bottom: 24px;
            font-size: 13px;
            color: #F87171;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .target-dot {
            width: 8px; height: 8px;
            background: #EF4444;
            border-radius: 50%;
            animation: blink 1.5s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        .login-card {
            background: #1E293B;
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 40px 36px;
            width: 380px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .logo {
            text-align: center;
            margin-bottom: 28px;
        }
        .logo-icon {
            width: 48px; height: 48px;
            background: linear-gradient(135deg, #3B82F6, #1D4ED8);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            font-size: 22px;
        }
        .logo h1 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #F1F5F9;
        }
        .logo p {
            font-size: 0.85rem;
            color: #64748B;
            margin-top: 4px;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-size: 0.82rem;
            font-weight: 600;
            color: #94A3B8;
            margin-bottom: 6px;
        }
        input {
            width: 100%;
            padding: 12px 14px;
            background: #0F172A;
            border: 1px solid #334155;
            border-radius: 8px;
            color: #E2E8F0;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        input:focus {
            border-color: #3B82F6;
        }
        input::placeholder { color: #475569; }
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #3B82F6, #2563EB);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
            transition: opacity 0.2s;
        }
        button:hover { opacity: 0.9; }
        .footer-info {
            margin-top: 20px;
            text-align: center;
            font-size: 0.75rem;
            color: #475569;
        }
        .mission-hint {
            background: rgba(245, 158, 11, 0.08);
            border: 1px solid rgba(245, 158, 11, 0.2);
            border-radius: 10px;
            padding: 14px 18px;
            margin-top: 24px;
            width: 380px;
        }
        .mission-hint h3 {
            font-size: 0.82rem;
            font-weight: 700;
            color: #F59E0B;
            margin-bottom: 8px;
        }
        .mission-hint p {
            font-size: 0.78rem;
            color: #94A3B8;
            line-height: 1.6;
        }
        .mission-hint code {
            background: rgba(245, 158, 11, 0.15);
            padding: 1px 6px;
            border-radius: 4px;
            color: #FBBF24;
            font-size: 0.78rem;
        }
    </style>
</head>
<body>
    <div class="target-banner">
        <div class="target-dot"></div>
        TARGET SYSTEM — SecureCorp Internal Admin Panel
    </div>

    <div class="login-card">
        <div class="logo">
            <div class="logo-icon">🔒</div>
            <h1>SecureCorp Admin</h1>
            <p>관리자 전용 로그인</p>
        </div>
        <form action="/login.php" method="POST">
            <div class="form-group">
                <label>Username</label>
                <input name="username" placeholder="관리자 계정을 입력하세요" autocomplete="off" />
            </div>
            <div class="form-group">
                <label>Password</label>
                <input name="password" type="password" placeholder="비밀번호" />
            </div>
            <button type="submit">로그인</button>
        </form>
        <p class="footer-info">SecureCorp v2.1.3 · 인가된 사용자만 접근 가능</p>
    </div>

    <div class="mission-hint">
        <h3>🎯 미션</h3>
        <p>
            이 로그인 페이지에는 SQL Injection 취약점이 존재합니다.<br>
            비밀번호를 모르는 상태에서 <code>admin</code> 계정으로 로그인하세요.
        </p>
    </div>
</body>
</html>
