<?php
require_once __DIR__ . '/../src/rpc.php';

$status = null;
$resultData = null;
$address = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_SPECIAL_CHARS);
    $nblocks = filter_input(INPUT_POST, 'nblocks', FILTER_VALIDATE_INT);

    if (!$address) {
        $status = ['type' => 'error', 'message' => 'Por favor, ingresa una dirección de billetera válida.'];
    } elseif ($nblocks === false || $nblocks < 1) {
        $status = ['type' => 'error', 'message' => 'Cantidad de bloques no válida.'];
    } else {
        $rpc = new BitcoinRPC();
        $response = $rpc->generateToAddress($nblocks, $address);

        if ($response['success']) {
            $status = ['type' => 'success', 'message' => "¡Éxito! se generaron {$response['count']} bloque(s)."];
            $resultData = $response['data'];
        } else {
            $status = ['type' => 'error', 'message' => $response['message']];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bitcoin Block Generator | Regtest</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" href="favicon.ico">
</head>
<body>
    <div class="container">
        <main class="card">
            <header>
                <h1>Block Generator</h1>
                <p class="subtitle">Bitcoin Regtest Mining Utility</p>
            </header>

            <form method="POST" action="index.php" id="generatorForm">
                <div class="form-group">
                    <label for="address">Dirección de Billetera (Regtest)</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        placeholder="bcrt1q..." 
                        value="<?= htmlspecialchars($address) ?>" 
                        required
                    >
                </div>

                <label>Cantidad de Bloques a Generar</label>
                <div class="button-grid">
                    <button type="submit" name="nblocks" value="1">1 Bloque</button>
                    <button type="submit" name="nblocks" value="10">10 Bloques</button>
                    <button type="submit" name="nblocks" value="100">100 Bloques</button>
                </div>
            </form>

            <?php if ($status): ?>
                <div class="status visible status-<?= $status['type'] ?>">
                    <strong><?= $status['type'] === 'success' ? 'Éxito' : 'Error' ?>:</strong>
                    <p><?= $status['message'] ?></p>
                    
                    <?php if ($resultData): ?>
                        <div class="hash-list">
                            <strong>Último hash:</strong><br>
                            <?= end($resultData) ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </main>
        
        <footer>
            <p>&copy; <?= date('Y') ?> Bitcoin Node Helper | Powered by PHP</p>
        </footer>
    </div>

    <script>
        // Simple UI handling
        document.querySelectorAll('button[type="submit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const form = document.getElementById('generatorForm');
                // Optional: Show loading state
                btn.style.opacity = '0.7';
                btn.innerText = 'Generando...';
            });
        });
    </script>
</body>
</html>
