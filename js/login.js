$(document).ready(function() {
if (localStorage.getItem('authToken')) {
    //Si existe el authToken, cargar la vista de productos
    $('#app').load('views/products.html');
} else {
    //Si no existe el authToken, cargar la vista de login
    $('#app').load('views/login.html');
}
});
$(document).on('submit', '#loginForm', function (e) {    
    e.preventDefault();

    const username = $('#username').val();
    const password = $('#password').val();

    $.ajax({
        url: 'http://vps.churrasco.digital:3000/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function (response) {
            alert('Login successful!');
            localStorage.setItem('authToken', response.token);
            //Redirige a la vista principal 
            $('#app').load('views/products.html');
        },
        error: function (xhr) {
            let errorMessage = 'An error occurred';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            alert(errorMessage);
        }
    });
});
