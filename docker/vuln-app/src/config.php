<?php
$db_host = getenv('DB_HOST') ?: 'vuln-db';
$db_user = getenv('DB_USER') ?: 'vuln_user';
$db_pass = getenv('DB_PASS') ?: 'vuln_pass';
$db_name = getenv('DB_NAME') ?: 'vuln_db';

$conn = null;
$retries = 5;
for ($i = 0; $i < $retries; $i++) {
    try {
        $conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);
        if (!$conn->connect_error) break;
    } catch (Exception $e) {
        // retry
    }
    $conn = null;
    sleep(1);
}

if (!$conn || $conn->connect_error) {
    die("Database connection failed. Please wait a moment and refresh.");
}
?>
