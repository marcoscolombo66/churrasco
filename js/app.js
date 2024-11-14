$(document).ready(function () {
    //Cargar vistas en el contenedor
    function loadView(view) {
        $('#app').load(`views/${view}.html`);
    }

    // Cargar vista de login
    loadView('login');

    
    $(document).on('click', '[data-view]', function (e) {
        e.preventDefault();
        const view = $(this).data('view');
        loadView(view);
    });
});
