<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;

$app->group('/loterry', function (RouteCollectorProxy $group) {
    $group->get('', function (Request $request, Response $response) {

        $conn = $GLOBALS['connect'];

        $sql = "SELECT * FROM `lotterry` LEFT JOIN `order` ON `lotterry`.`id` = `order`.`lot_ID` WHERE `order`.`lot_ID` IS NULL ORDER BY rand() limit 6;";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        foreach ($result as $row) {
            array_push($data, $row);
        }

        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    $group->get('/all', function (Request $request, Response $response) {

        $conn = $GLOBALS['connect'];

        $sql = "SELECT * FROM `lotterry` LEFT JOIN `order` ON `lotterry`.`id` = `order`.`lot_ID` WHERE `order`.`lot_ID` IS NULL";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        foreach ($result as $row) {
            array_push($data, $row);
        }

        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus(200);
    });
    $group->get('/{search}/{set}/{period}', function (Request $request, Response $response, $args) {
        $search = $args['search'];
        $set = $args['set'];
        $period = $args['period'];


        $conn = $GLOBALS['connect'];

        $sql = 'SELECT * FROM `lotterry` LEFT JOIN `order` ON `lotterry`.`id` = `order`.`lot_ID` WHERE `order`.`lot_ID` IS NULL AND `number` LIKE ? AND `set_lot` LIKE ? AND `period_lot` LIKE ?;';
        $stmt = $conn->prepare($sql);

        $search = '%' . $search;

        $stmt->bind_param('sss', $search, $period, $set);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });
    $group->get('/gettobuy/{id}', function (Request $request, Response $response, $args) {

        $id = $args['id'];

        $conn = $GLOBALS['connect'];

        $sql = 'SELECT * FROM lotterry INNER JOIN lotterycarts ON lotterry.id = lotterycarts.ticket_id WHERE lotterycarts.user_ID = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });

    $group->post('/buylot', function (Request $request, Response $response) {
        $json = $request->getBody();
        $jsonData = json_decode($json, true);

        $conn = $GLOBALS['connect'];

        $userid = $jsonData['userid'];
        $lotid = $jsonData['id_lot'];
        $total_price = $jsonData['total_price'];
        $total_bai = $jsonData['total_bai'];

        $sql = 'INSERT INTO order_list (user_id,total,total_bai) VALUES (?,?,?)';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('iii', $userid, $total_price, $total_bai);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close(); // ปิด statement object
        if ($affected > 0) {
            $sql = 'SELECT ID FROM order_list ORDER BY ID DESC LIMIT 1';
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            if ($row = $result->fetch_assoc()) {
                foreach ($lotid as $value) {
                    $sql = 'INSERT INTO `order`(`order_list_ID`, `lot_ID`) VALUES (?,?)';
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param('ii', $row['ID'], $value);
                    if ($stmt->execute() === false) {
                        die("เกิดข้อผิดพลาดในการ Insert: " . $stmt->error);
                    }
                }
                $stmt->close();
                $response->getBody()->write(json_encode(['message' => 'เรียบร้อย']));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
            }
        } else {
            $response->getBody()->write(json_encode(['message' => 'เกิดข้อผิดพลาดอะไรสักอย่าง']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }
    });

    $group->delete('/deleteLotIncart/{id}', function (Request $request, Response $response, $args) {
      
        $conn = $GLOBALS['connect'];
        $id = $args['id'];

        $sql = 'DELETE FROM `lotterycarts` WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // คำสั่ง SQL DELETE ได้ลบข้อมูลออกจากฐานข้อมูล
            // คุณสามารถส่งค่าอะไรก็ได้เพื่อรายงานว่าลบสำเร็จ
            $response->getBody()->write(json_encode(['message' => 'ลบเรียบร้อย']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            // คำสั่ง SQL DELETE ไม่ได้ลบข้อมูลออกจากฐานข้อมูล
            // คุณสามารถส่งค่าอื่น ๆ เพื่อรายงานว่าไม่สามารถลบข้อมูลได้
            $response->getBody()->write(json_encode(['message' => 'ไม่สามารถลบข้อมูลได้']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }
    });

    //ล้อตเตอรี่ใส่กระเป๋า
    $group->post('/addtocart', function (Request $request, Response $response) {
        $json = $request->getBody();
        $jsonData = json_decode($json, true);

        $conn = $GLOBALS['connect'];

        $userid = $jsonData['userid'];
        $lotid = $jsonData['lot_id'];

        $sql = 'SELECT * FROM lotterycarts WHERE user_id = ? AND ticket_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $userid, $lotid);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            $response->getBody()->write(json_encode(['message' => 'เกิดข้อผิดพลาดอะไรสักอย่าง']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }
        $stmt->close(); // ปิด statement object


        $sql = 'INSERT INTO lotterycarts (user_id,ticket_id) VALUES (?, ?)';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $userid, $lotid);
        $stmt->execute();

        $affected = $stmt->affected_rows;
        $stmt->close(); // ปิด statement object

        if ($affected > 0) {
            $response->getBody()->write(json_encode(['message' => 'เพิ่มลงตระกร้าเรียบร้อย']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['message' => 'เกิดข้อผิดพลาดอะไรสักอย่าง']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }

    });

    //ดีเทลการซื้อผ่านไอดีการซื้อ
    $group->get('/getdetail/{id}', function (Request $request, Response $response, $args) {
        $orderid = $args['id'];

        $conn = $GLOBALS['connect'];

        $sql = 'SELECT `order_list`.`total`,`order_list`.`total_bai`,`order_list`.`date`,`lotterry`.`price_lot`,`lotterry`.`number` FROM `order_list` INNER JOIN `order` ON `order_list`.`ID` = `order`.`order_list_ID` JOIN `lotterry` ON `lotterry`.`id` = `order`.`lot_ID` WHERE `order_list`.`ID` = ?;';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $orderid);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });
    //ประวัติการซื้อของตัวเอง
    $group->get('/gethis/{id}', function (Request $request, Response $response, $args) {
        $conn = $GLOBALS['connect'];

        $id = $args['id'];

        // Check connection
        // if ($conn->connect_error) {
        //     die("Connection failed: " . $conn->connect_error);
        // }

        $sql = 'select ID,date,total_bai,total from order_list where user_ID = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });


    ///แก้ไขรายละเอียดล็อต
    $group->post('/addlot', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];

        $json = $request->getBody();
        $jsonData = json_decode($json, true);

        $price_lot = $jsonData['price'];
        $number = $jsonData['number'];
        $period_lot = $jsonData['period_lot'];
        $set_lot = $jsonData['set_lot'];

        $sql = 'INSERT INTO `lotterry`(`price_lot`, `number`, `period_lot`, `set_lot`) VALUES (?, ?, ?, ?);';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('isss', $price_lot, $number, $period_lot, $set_lot);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();
        if ($affected > 0) {
            $response->getBody()->write(json_encode(['ms' => 'เรียบร้อย']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['ms' => 'ไม่เรียบร้อย']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        }
    });
    //ลบล็อต
    $group->post('/editlot', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];

        $json = $request->getBody();
        $jsonData = json_decode($json, true);

        $price_lot = $jsonData['price_lot'];
        $number = $jsonData['number'];
        $period_lot = $jsonData['period_lot'];
        $set_lot = $jsonData['set_lot'];
        $id = $jsonData['id'];

        $sql = 'UPDATE `lotterry` SET `price_lot`=?, `number`=?, `period_lot`=?, `set_lot`=? WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('isssi', $price_lot, $number, $period_lot, $set_lot, $id);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();
        if ($affected > 0) {
            $response->getBody()->write(json_encode(['ms' => 'เรียบร้อย']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['ms' => 'ไม่มีการอัพเดท']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        }
    });

    $group->delete('/delete/{id}', function (Request $request, Response $response, $args) {
        $conn = $GLOBALS['connect'];
        $id = $args['id'];

        $sql = 'DELETE FROM `lotterry` WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // คำสั่ง SQL DELETE ได้ลบข้อมูลออกจากฐานข้อมูล
            // คุณสามารถส่งค่าอะไรก็ได้เพื่อรายงานว่าลบสำเร็จ
            $response->getBody()->write(json_encode(['message' => 'ลบเรียบร้อย']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            // คำสั่ง SQL DELETE ไม่ได้ลบข้อมูลออกจากฐานข้อมูล
            // คุณสามารถส่งค่าอื่น ๆ เพื่อรายงานว่าไม่สามารถลบข้อมูลได้
            $response->getBody()->write(json_encode(['message' => 'ไม่สามารถลบข้อมูลได้']));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }
    });

    $group->get('/getnowday', function (Request $request, Response $response) {
        $conn = $GLOBALS['connect'];

        $sql = 'SELECT user.fname, user.lname, lotterry.number,`lotterry`.`price_lot` FROM user INNER JOIN order_list ON user.id = order_list.user_ID INNER JOIN `order` ON order_list.ID = `order`.`order_list_ID` INNER JOIN lotterry ON `order`.`lot_ID` = lotterry.id Where DATE(date) = CURDATE();';
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });

    $group->get('/konha/{id}/{day}/{month}/{year}', function (Request $request, Response $response, $args) {

        $conn = $GLOBALS['connect'];

        $userid = $args['id'];
        $day = $args['day'];
        $month = $args['month'];
        $year = $args['year'];

        $date = sprintf('%s-%s-%s', $day, $month, $year);

        $sql = 'SELECT `user_ID`, `date`, `total`, `ID`, `total_bai` FROM `order_list` WHERE user_ID = ? AND date = ?;';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('is', $userid, $date);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });


    //เอาวันที่ไปทำ dropdown
    $group->get('/gethisdate/{id}', function (Request $request, Response $response, $args) {
        $conn = $GLOBALS['connect'];
        $id = $args['id'];

        $sql = 'SELECT DISTINCT(date) FROM order_list WHERE user_ID = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });

    //ค้นหาล็อตเตอรี่ที่เคยซื้อ
    $group->get('/konh/{id}/{day}/{month}/{year}', function (Request $request, Response $response, $args) {

        $conn = $GLOBALS['connect'];

        $userid = $args['id'];
        $day = $args['day'];
        $search = '%' . $day . '%'; //ก็อปมาทำเลยไม่ได้เปลี่ยนตัวแปล
        // $mount = $args['mount'];
        // $year = $args['year'];

        // $date = sprintf('%s-%s-%s', $day, $mount, $year);

        $sql = 'SELECT `order_list`.`date`, `lotterry`.`price_lot`,`lotterry`.`number` FROM `order` INNER JOIN `lotterry` ON `order`.`lot_ID` = `lotterry`.`id` JOIN `order_list` ON `order_list`.`ID` = `order`.`order_list_ID` WHERE `order_list`.`user_ID` = ? AND `lotterry`.`number` like ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('is', $userid, $search);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });
    //ประวัติตามวันที่
    $group->get('/konhaAll/{day}/{month}/{year}', function (Request $request, Response $response, $args) {

        $conn = $GLOBALS['connect'];

        // $userid = $args['id'];
        $day = $args['day'];
        $month = $args['month'];
        $year = $args['year'];

        $date = sprintf('%s-%s-%s', $year, $month, $day);

        $sql = 'SELECT user.fname, user.lname, lotterry.number,`lotterry`.`price_lot` FROM user INNER JOIN order_list ON user.id = order_list.user_ID INNER JOIN `order` ON order_list.ID = `order`.`order_list_ID` INNER JOIN lotterry ON `order`.`lot_ID` = lotterry.id WHERE order_list.date = ?;';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $date);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });


    //แอดมินรายงานตามเดือน
    $group->get('/konhaAllmo/{day}/{month}/{year}', function (Request $request, Response $response, $args) {

        $conn = $GLOBALS['connect'];

        // $userid = $args['id'];

        //รับวันที่เข้ามา
        $day = $args['day'];
        $month = $args['month'];
        $year = $args['year'];

        // $date = sprintf('%s-%s-%s', $year, $mount, $day);

        //คำสั่ง sql
        $sql = 'SELECT user.fname, user.lname, lotterry.number,`lotterry`.`price_lot` FROM user INNER JOIN order_list ON user.id = order_list.user_ID INNER JOIN `order` ON order_list.ID = `order`.`order_list_ID` INNER JOIN lotterry ON `order`.`lot_ID` = lotterry.id WHERE YEAR(date) = ? AND MONTH(date) = ?;';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $year,$month);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array();
        //เก็บข้อมูลใส่ data
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }

        //ส่งข้อมูลกลับ เป็น
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    });

});
