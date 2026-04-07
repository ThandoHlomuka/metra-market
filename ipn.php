<?php
/**
 * PayFast Instant Transaction Notification (ITN) Handler
 * 
 * This file receives payment notifications from PayFast and updates order status.
 * 
 * IMPORTANT: Upload this to your web server and update the notify_url in PAYFAST_CONFIG
 * to point to this file (e.g., https://yourdomain.com/ipn.php)
 */

// Log file for debugging
$logFile = 'payfast_itn.log';

function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

logMessage('ITN received');

// Get all POST data
$postData = array();
foreach ($_POST as $key => $value) {
    $postData[$key] = $value;
    logMessage("$key = $value");
}

// Validate security signature
$passphrase = getenv('PAYFAST_PASSPHRASE') ?: 'YOUR_PAYFAST_PASSPHRASE'; // Your PayFast passphrase
$signature = md5(http_build_query($postData) . '&passphrase=' . urlencode($passphrase));

if (!isset($_POST['signature']) || $_POST['signature'] !== $signature) {
    logMessage('ERROR: Invalid signature');
    http_response_code(403);
    echo 'Invalid signature';
    exit;
}

logMessage('Signature validated');

// Verify transaction with PayFast (sandbox or production)
$isSandbox = isset($_POST['test_request']) && $_POST['test_request'] === '1';
$verifyUrl = $isSandbox 
    ? 'https://sandbox.payfast.co.za/eng/query/verify' 
    : 'https://www.payfast.co.za/eng/query/verify';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $verifyUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

logMessage("PayFast verification response: $response (HTTP $httpCode)");

if ($httpCode !== 200 || strpos($response, 'VALID') === false) {
    logMessage('ERROR: Transaction verification failed');
    http_response_code(400);
    echo 'Invalid transaction';
    exit;
}

logMessage('Transaction verified as VALID');

// Extract order information
$orderId = $_POST['item_name'] ?? ''; // Format: "Order ORD-xxxxxxxxx"
$paymentStatus = $_POST['payment_status'] ?? '';
$amountGross = $_POST['amount_gross'] ?? '0';
$transactionId = $_POST['pf_payment_id'] ?? '';

logMessage("Order: $orderId, Status: $paymentStatus, Amount: R$amountGross, Transaction ID: $transactionId");

// Update BobGo shipment status via serverless proxy
// Extract clean order ID from "Order ORD-xxxxxxxxx" format
$cleanOrderId = preg_replace('/Order\s*/', '', $orderId);
if (empty($cleanOrderId)) {
    $cleanOrderId = $orderId;
}

$bobgoUpdateUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http')
    . '://' . $_SERVER['HTTP_HOST'] . '/api/bobgo-update-shipment';

$bobgoPayload = json_encode([
    'orderId' => $cleanOrderId,
    'paymentStatus' => strtolower($paymentStatus),
    'orderStatus' => $paymentStatus === 'COMPLETE' ? 'processing' : strtolower($paymentStatus),
    'notes' => "PayFast ITN: $paymentStatus - Transaction $transactionId"
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $bobgoUpdateUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $bobgoPayload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$bobgoResponse = curl_exec($ch);
$bobgoHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

logMessage("BobGo status update: HTTP $bobgoHttpCode - Response: $bobgoResponse");

// For frontend-only apps, we can't directly update server database
// But we can log the successful payment for manual processing
if ($paymentStatus === 'COMPLETE') {
    // Save successful payment notification
    $paymentData = [
        'order_id' => $orderId,
        'transaction_id' => $transactionId,
        'amount' => $amountGross,
        'status' => $paymentStatus,
        'timestamp' => date('Y-m-d H:i:s'),
        'payer_email' => $_POST['payer_email'] ?? '',
        'payment_method' => $_POST['payment_method'] ?? ''
    ];
    
    $paymentsFile = 'payments.json';
    $payments = [];
    if (file_exists($paymentsFile)) {
        $payments = json_decode(file_get_contents($paymentsFile), true) ?? [];
    }
    $payments[] = $paymentData;
    file_put_contents($paymentsFile, json_encode($payments, JSON_PRETTY_PRINT));
    
    logMessage('Payment recorded successfully');
    
    // Send confirmation email (if mail is configured on server)
    $to = $_POST['payer_email'] ?? '';
    if (!empty($to)) {
        $subject = "Payment Received - $orderId";
        $message = "Thank you for your payment!\n\n";
        $message .= "Order: $orderId\n";
        $message .= "Amount: R$amountGross\n";
        $message .= "Transaction ID: $transactionId\n";
        $message .= "Status: $paymentStatus\n\n";
        $message .= "Thank you for shopping with Metra Market!";
        
        $headers = "From: orders@metramarket.co.za\r\n";
        $headers .= "Reply-To: orders@metramarket.co.za\r\n";
        
        @mail($to, $subject, $message, $headers);
        logMessage("Confirmation email sent to: $to");
    }
}

// Respond to PayFast
http_response_code(200);
echo 'OK';
logMessage('ITN processing complete');
?>
