<?php
$db_host = getenv('DB_HOST') ?: 'vuln-db';
$db_user = getenv('DB_USER') ?: 'vuln_user';
$db_pass = getenv('DB_PASS') ?: 'vuln_pass';
$db_name = getenv('DB_NAME') ?: 'vuln_db';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
