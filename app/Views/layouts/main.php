<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Explora todos los personajes del universo Rick & Morty">
    <title><?= e($title ?? 'Rick & Morty') ?> </title>

    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛸</text></svg>">

    <link rel="preconnect" href="https://rickandmortyapi.com">

    <link rel="stylesheet" href="<?= asset('css/app.css') ?>">
</head>

<body class="bg-white font-sans text-gray-900 antialiased">
    <main id="app">
        <?= $content ?? '' ?>
    </main>

    <script type="module" src="<?= asset('js/main.js') ?>"></script>
</body>

</html>