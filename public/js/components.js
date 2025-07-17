// Inserta el header y el footer en todas las páginas públicas
// y enlaza el CSS de los componentes si no está presente

function loadComponent(url, _targetSelector, position = 'afterbegin') {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            if (position === 'afterbegin') {
                document.body.insertAdjacentHTML('afterbegin', html);
            } else {
                document.body.insertAdjacentHTML('beforeend', html);
            }
        });
}

function ensureComponentCSS() {
    const cssHref = '/components/components.css';
    if (!Array.from(document.styleSheets).some(s => s.href && s.href.includes(cssHref))) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ensureComponentCSS();
    loadComponent('/components/header.html', 'body', 'afterbegin');
    loadComponent('/components/footer.html', 'body', 'beforeend');
});
