<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap Editor</title>
    <link rel="shortcut icon" href="src/img/favicon.ico" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="canonical" href="https://getbootstrap.com/docs/5.3/examples/sidebars/">
    <link rel="stylesheet" href="src/css/style.css">
</head>

<body>
    <aside id="aside" class="flex-column flex-shrink-0 p-3 bg-body-tertiary">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <svg class="bi pe-none me-2" width="40" height="32">
                <use xlink:href="#bootstrap" />
            </svg>
            <span class="fs-4">Bootstrap Editor</span>
        </a>
        <hr>
        <ul id="nav_items" class="nav nav-pills flex-column mb-auto">

        </ul>
        <hr>
        <p>This website utilizes front-end code foundations from Bootstrap (<a
                href="https://getbootstrap.com/">getbootstrap.com</a>), a freely available toolkit for building
            responsive websites. We have modified the Bootstrap components to allow for user editing, a feature not
            natively included.</p>
        <div class="dropdown">
            <a href="#" class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://avatars.githubusercontent.com/u/109874942?v=4" alt="" width="32" height="32"
                    class="rounded-circle me-2">
                <strong>By JustWait</strong>
            </a>
            <ul class="dropdown-menu text-small shadow">
                <li><a class="dropdown-item" href="https://justwaitforme.de/">Website</a></li>
                <li><a class="dropdown-item" href="https://github.com/justwaitfor-me">Github</a></li>
                <li><a class="dropdown-item" href="https://justwaitforme.de/contact/">Legal Notice</a></li>
            </ul>
        </div>
    </aside>
    <main class="edit">
        <section></section>
    </main>
    <footer>
        <hr>
        <div class="footer-content">
            <div>
                <img src="https://avatars.githubusercontent.com/u/109874942?v=4" alt="" width="32" height="32"
                    class="rounded-circle me-2">
                <strong>By JustWait</strong>
            </div>
            <div>
                <a href="https://justwaitforme.de/">Website</a>
                <a href="https://github.com/justwaitfor-me">Github</a>
                <a href="https://justwaitforme.de/contact/">Legal Notice</a>
            </div>
        </div>
    </footer>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-clipboard-plus-fill" viewBox="0 0 16 16" style="margin-right: 10px;">
                    <path
                        d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                    <path
                        d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm4.5 6V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5a.5.5 0 0 1 1 0" />
                </svg>
                <strong class="me-auto">Info</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Code copied to clipboard!
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
        </script>
    <script src="src/js/main.js"></script>
    <script type="module" src="src/js/listener.js"></script>
</body>

</html>