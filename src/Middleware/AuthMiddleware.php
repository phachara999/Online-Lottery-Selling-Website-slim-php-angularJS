<?php

namespace projectwebtech\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class AuthMiddleware {
    public function __invoke(Request $request, RequestHandler $handler): Response {
    // เรียกใช้ session_start() ที่นี่
     session_start();
        if (!isset($_SESSION['email'])) {
                // ไม่ได้ล็อกอิน ให้สร้างคำตอบและส่งกลับ
                $response = new \Slim\Psr7\Response();
                $response->getBody()->write(json_encode(['message' => 'ยังไม่ได้ล็อกอิน']));
                return $response->withHeader('Content-Type', 'application/json');
         }
         return $handler->handle($request);
    }
    
    
}