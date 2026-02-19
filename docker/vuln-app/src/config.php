<?php
$db_host = getenv('DB_HOST') ?: 'vuln-db';
$db_user = getenv('DB_USER') ?: 'vuln_user';
$db_pass = getenv('DB_PASS') ?: 'vuln_pass';
$db_name = getenv('DB_NAME') ?: 'vuln_db';

// PHP 8.1 기본값이 예외 던지기라서, 재시도를 위해 비활성화
mysqli_report(MYSQLI_REPORT_OFF);

$conn = null;
for ($i = 0; $i < 10; $i++) {
    $conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);
    if ($conn && !$conn->connect_error) break;
    $conn = null;
    sleep(2);
}

if (!$conn) {
    die("Database connection failed. Please wait a moment and refresh.");
}
?>
