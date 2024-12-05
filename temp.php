<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize form data
    $recipename = isset($_POST['recipename']) ? trim($_POST['recipename']) : '';
    $recipedescrip = isset($_POST['recipedescrip']) ? trim($_POST['recipedescrip']) : '';
    $recipesteps = isset($_POST['recipesteps']) ? trim($_POST['recipesteps']) : '';
    $difficulty = isset($_POST['difficulty']) ? $_POST['difficulty'] : '';
    $dish_types = isset($_POST['dish_types']) ? implode(',', $_POST['dish_types']) : '';

    // Check if required fields are not empty
    if (empty($recipename) || empty($recipedescrip) || empty($recipesteps) || empty($difficulty)) {
        die("All fields are required.");
    }

    $image_file_name = ''; 
    if (isset($_FILES['recipe_image']) && $_FILES['recipe_image']['error'] == 0) {
        $image = $_FILES['recipe_image'];
        $image_name = $image['name'];
        $image_tmp_name = $image['tmp_name'];
        $image_size = $image['size'];

        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 5 * 1024 * 1024; // 5MB

        if (in_array($image['type'], $allowed_types) && $image_size <= $max_size) {
            $image_file_name = uniqid() . '-' . basename($image_name);
            $upload_dir = 'images/';

            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true); 
            }

            $upload_path = $upload_dir . $image_file_name;

            if (move_uploaded_file($image_tmp_name, $upload_path)) {
                echo "Image uploaded successfully.";
            } else {
                echo "Error uploading image.";
            }
        } else {
            echo "Invalid image type or size exceeded.";
        }
    }

    // Database connection
    $con = mysqli_connect('localhost', 'root', '', 'datababes');
    
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Get the logged-in user's ID from the session
    $user_id = $_SESSION['user_id'];

    // Prepare the SQL query to insert the recipe into the database
    $sql = "INSERT INTO recipes (recipename, recipedescrip, recipesteps, user_ID, recipe_image, difficulty, dish_types) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Prepare the statement
    if ($stmt = mysqli_prepare($con, $sql)) {
        // Bind parameters to the SQL query
        mysqli_stmt_bind_param($stmt, "sssssss", $recipename, $recipedescrip, $recipesteps, $user_id, $image_file_name, $difficulty, $dish_types);
        
        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            header ("Location: temp.html");
            exit;
        } else {
            echo "Error inserting recipe: " . mysqli_error($con);
        }

        // Close the prepared statement
        mysqli_stmt_close($stmt);
    } else {
        echo "Error preparing the statement: " . mysqli_error($con);
    }

    // Close the database connection
    mysqli_close($con);
}
?>
