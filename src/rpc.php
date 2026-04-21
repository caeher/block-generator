<?php

class BitcoinRPC {
    private string $url;
    private string $user;
    private string $password;

    public function __construct() {
        // Read credentials from environment variables
        $this->url      = getenv('BITCOIN_RPC_URL') ?: 'http://127.0.0.1:18443';
        $this->user     = getenv('BITCOIN_RPC_USER') ?: 'local_rpc';
        $this->password = getenv('BITCOIN_RPC_PASSWORD') ?: 'local_rpc_password';
    }

    /**
     * Executes an RPC call to the Bitcoin node.
     */
    private function call(string $method, array $params = []): array {
        $payload = json_encode([
            'jsonrpc' => '1.0',
            'id'      => 'block-generator-php',
            'method'  => $method,
            'params'  => $params,
        ]);

        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode($this->user . ':' . $this->password),
        ]);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false) {
            return ['error' => 'Connection error: ' . $error];
        }

        if ($httpCode === 401) {
            return ['error' => 'Unauthorized: Check RPC credentials.'];
        }

        $data = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['error' => 'Invalid JSON response from node.'];
        }

        return $data;
    }

    /**
     * Generates a specified number of blocks to a given address.
     */
    public function generateToAddress(int $nblocks, string $address): array {
        $result = $this->call('generatetoaddress', [$nblocks, $address]);

        if (isset($result['error']) && $result['error'] !== null) {
            $msg = is_array($result['error']) ? $result['error']['message'] : $result['error'];
            return [
                'success' => false,
                'message' => 'RPC Error: ' . $msg
            ];
        }

        return [
            'success' => true,
            'data' => $result['result'], // Array of block hashes
            'count' => count($result['result'])
        ];
    }
}
