<?php
$con = mysqli_connect('localhost', 'root', '', 'datababes');

if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (empty($_POST["usernameEmail"])) {
        echo "Enter your username or email";
        exit;
    }

    if (empty($_POST["password"])) {
        echo "Enter your password";
        exit;
    }

    $usernameEmail = $_POST["usernameEmail"];
    $password = $_POST["password"];

    $sql = sprintf("SELECT * FROM users WHERE username = '%s' OR email = '%s'", 
                   mysqli_real_escape_string($con, $usernameEmail),
                   mysqli_real_escape_string($con, $usernameEmail));

    $result = mysqli_query($con, $sql);
    
    $user = mysqli_fetch_assoc($result);
    
    if ($user) {
        if (password_verify($password, $user["password"])) {
            session_start();
            session_regenerate_id();
            $_SESSION["user_id"] = $user["user_ID"]; 
            
            echo "Logged in successfully!"; 
        } else {
            echo "Incorrect password!";
        }
    } else {
        echo "Account not found.";
    }
}

mysqli_close($con);
?>
