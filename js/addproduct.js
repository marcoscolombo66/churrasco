$(document).ready(function() {
    $('#add-product-form').on('submit', function(event) {

        event.preventDefault(); 

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("No se encontró el token. Por favor, inicie sesión.");
            $('#app').load('views/login.html');
            return;
        }
         
        $('#loadingSpinner').show();
        
        const SKU = $('#SKU').val();
        const code = $('#code').val();
        const name = $('#name').val();
        const description = $('#description').val();
        const price = $('#price').val();
        const currency = $('#currency').val();
        const pictures = $('#pictures')[0].files; 

        if (pictures.length === 0) {
            alert("Debe seleccionar al menos una imagen.");
            return;
        }



const imageUrls = [];
const imageUploadPromises = [];


//Se suben a un servicio que devuelve URL
for (let i = 0; i < pictures.length; i++) {
    const formData = new FormData();
    formData.append('file', pictures[i]);
    
    imageUploadPromises.push(
        $.ajax({
            url: 'https://www.gestionst.com.ar/numerologia/index.php/Api/uploadImage',
            method: 'POST',
            headers: {
                //'Authorization': 'Bearer ' + token
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                imageUrls.push(response.url); 
            },
            error: function() {
                alert("Error al subir la imagen.");
                $('#loadingSpinner').hide();
            }
        })
    );
}

        //Espero que todas las imágenes se suban antes de enviar los datos del producto
        Promise.all(imageUploadPromises).then(function() {
            const productData = {
                SKU: SKU,
                code: code,
                name: name,
                description: description,
                pictures: imageUrls, // Usar las URLs obtenidas
                price: price,
                currency: currency,
                __v: 0
            };

            //Envio el formulario para agregar el producto
            $.ajax({
                url: 'http://vps.churrasco.digital:3000/addproduct',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(productData),
                success: function(response) {
                    alert("Producto agregado exitosamente.");
                    $('#app').load('views/products.html');
                },
                error: function(error) {
                    alert("Error al agregar el producto: " + error.responseText);
                },
                complete: function() {
                    $('#loadingSpinner').hide();
                }
            }).catch(function() {
                alert("Hubo un error en la carga de imágenes.");
                $('#loadingSpinner').hide(); 
            });
        });
    });
});