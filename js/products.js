
 function handleNuevoProducto(){
    $('#app').load('views/addproduct.html');
 }
 
 function handleImageError(event) {
    event.target.src = './assets/images/sin_imagen.png';  
}
$(document).ready(function() {
    let currentPage = 1;  
    const productsPerPage = 12;  
    let allProducts = [];  
    
    function loadProducts() {
        $('#loadingSpinner').show();
        const token = localStorage.getItem('authToken');
        if (!token) {
            $('#app').load('views/login.html');
        } else {
            $.ajax({
                url: 'http://vps.churrasco.digital:3000/products',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function(response) {
                    allProducts = response;  
                    renderPage(currentPage);  
                    renderPagination(); 
                    $('#loadingSpinner').hide(); 
                },
                error: function(error) {
                    alert("Error al cargar los productos: " + error.responseText);
                }
            });
        }
    }   
    
    function renderPage(page) {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const currentProducts = allProducts.slice(start, end);    
        let productHtml = '';
        let imagePromises = []; 
    
        currentProducts.forEach(function(product) {            
            var productCardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card product-card shadow-sm border-0">
                        <img src="${product.pictures[0]}" class="card-img-top" alt="${product.name}" onerror="handleImageError(event)">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
                            <a href="#" class="btn btn-primary btn-block">Ver producto</a>
                        </div>
                    </div>
                </div>
            `;
            
            //Objeto Image para verificar si la URL es válida
            var img = new Image();
            const imgPromise = new Promise(function(resolve, reject) {
                img.onload = function() {
                    resolve(productCardHtml);  //promesa con el HTML del producto
                };
                img.onerror = function() {
                    reject();  // Si falla rechazamos promesa
                };
                img.src = product.pictures[0];
            });    
            //Agrego la promesa al array
            imagePromises.push(imgPromise);
        });    
        //Esperamos a que todas las promesas se resuelvan antes de actualizar el HTML
        Promise.allSettled(imagePromises).then(function(results) {
            //Agrego los productos con link de imagen ok
            results.forEach(function(result) {
                if (result.status === 'fulfilled') {
                    productHtml += result.value;
                } else {
                    //console.log('Hubo un error con una imagen');
                }
            });            
            $('#product-list').html(productHtml);
        });
    }    

    // Función para paginación
    function renderPagination() {
        const totalPages = Math.ceil(allProducts.length / productsPerPage);
        let paginationHtml = '';

        // Botón "Anterior"
        if (currentPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">&laquo; Anterior</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>`;
        }          

        // Botón "Siguiente"
        if (currentPage < totalPages) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente &raquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><a class="page-link" href="#">Siguiente</a></li>`;
        }

        $('#pagination').html(paginationHtml);
    }

    //Carga de productos
    loadProducts();

    //Clics en los botones de la paginación
    $(document).on('click', '.page-link', function(event) {
        event.preventDefault();
        const page = $(this).data('page');
        if (page) {
            currentPage = page;
            renderPage(currentPage);  
            renderPagination();
        }
    });
});
