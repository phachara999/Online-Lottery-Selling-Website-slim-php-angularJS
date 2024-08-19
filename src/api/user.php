<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;

$app->group('/user', function (RouteCollectorProxy $group) {
    $group->post('/login', function (Request $request, Response $response) {
        $json = $request->getBody();
        $jsonData = json_decode($json, true);

        if ($user = attemptLogin($jsonData['email'], $jsonData['pass'])) {
            session_start();
            $_SESSION['email'] = $jsonData['email'];
            $response->getBody()->write(json_encode($user));
            return $response->withHeader('Content-Type', 'application/json');
        } else {
            $response->getBody()->write(json_encode(['message' => 'ล็อกอินไม่สำเร็จ']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }
    });
    $group->post('/register', function (Request $request, Response $response) {
        $json = $request->getBody();
        $jsonData = json_decode($json, true);
    
        if (isset($jsonData['fname']) && isset($jsonData['lname']) && isset($jsonData['email']) && isset($jsonData['bdate']) && isset($jsonData['pass']) && isset($jsonData['toe'])) {
    
            $servername = 'myadminphp.bowlab.net';
            $username = 'u583789277_DBWebtechG20';
            $password = 'Tingtong66';
            $dbname = 'u583789277_DBWebtechG20';
            // Create connection
            $conn = new mysqli($servername, $username, $password, $dbname);
    
            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            // $conn = $GLOBALS['connect'];
    
            $sql = 'select email from user where email = ?';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $jsonData['email']);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            if ($result->num_rows > 0) {
                // มีผลลัพธ์จากการค้นหา email ในฐานข้อมูล
                $response->getBody()->write(json_encode(['message' => 'Email นี้ถูกใช้งานแล้ว']));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400); // ให้ส่ง HTTP status code 400 Bad Request
            } else {
                $passHash = $hashedPassword = password_hash($jsonData['pass'], PASSWORD_DEFAULT);
                $sql = 'INSERT INTO user (fname, lname, email, password, bdate,phon_num) VALUES (?, ?, ?, ?, ?, ?)';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('ssssss', $jsonData['fname'], $jsonData['lname'], $jsonData['email'], $passHash, $jsonData['bdate'], $jsonData['toe']);
                $stmt->execute();
    
                $affected = $stmt->affected_rows;
                $stmt->close(); // ปิด statement object
    
                if ($affected > 0) {
                    $response->getBody()->write(json_encode(['message' => 'สมัครเรียบร้อย']));
                    return $response
                        ->withHeader('Content-Type', 'application/json')
                        ->withStatus(200);
                }
            }
        } else {
            $response->getBody()->write(json_encode(['message' => "ไม่พบข้อมูล"]));
            return $response->withHeader('Content-Type', 'application/json');
        }
    });
    

    $group->get('/logout', function (Request $request, Response $response) {
        session_start();
        session_destroy();
        $response->getBody()->write(json_encode(['message' => 'ออกจากระบบสำเร็จ']));
        return $response->withHeader('Content-Type', 'application/json');
    });
});

function attemptLogin($email, $password)
{
    $db = new PDO('mysql:host=myadminphp.bowlab.net;dbname=u583789277_DBWebtechG20', 'u583789277_DBWebtechG20', 'Tingtong66');
    // $conn = $GLOBALS['connect'];
    $query = "SELECT * FROM user WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    // ตรวจสอบว่าพบผู้ใช้ที่ตรงกันในฐานข้อมูลหรือไม่
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // ถ้าพบผู้ใช้ที่ตรงกัน
    if ($user) {
        // ตรวจสอบรหัสผ่าน
        if (password_verify($password, $user['password'])) {
            // รหัสผ่านถูกต้อง ส่งค่า true แสดงว่าล็อกอินสำเร็จ
            return $user;
        }
    }

    // หรือถ้าไม่พบผู้ใช้หรือรหัสผ่านไม่ตรงกัน
    return false;
}
