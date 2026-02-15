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
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo "<html><body>";
    echo "<h1>Welcome, " . htmlspecialchars($user['username']) . "!</h1>";
    if ($user['role'] === 'admin') {
        echo "<p>Admin panel access granted.</p>";
        echo "<p>Flag: CTF{sql_injection_success_2024}</p>";
    } else {
        echo "<p>You are logged in as a regular user.</p>";
    }
    echo "</body></html>";
} else {
    echo "<html><body>";
    echo "<h1>Login Failed</h1>";
    echo "<p>Invalid username or password.</p>";
    echo '<p><a href="/">Try again</a></p>';
    echo "</body></html>";
}

$conn->close();
?>
