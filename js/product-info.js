let comments =[];  
document.addEventListener("DOMContentLoaded", function() {
  let producto = localStorage.getItem("selectedProductId");

  if (producto) {
    const url = PRODUCT_INFO_COMMENTS_URL+ producto + '.json'
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        ShowComments(data);
        commentsData = data; // Guardar los comentarios en la variable global
      })
      .catch(error => console.error('Error al obtener los comentarios:', error));
  } else {
    alert("No se ha seleccionado ningún producto.");
  }
});
// Función para mostrar comentarios
function ShowComments(comments) {
  const CommentsList = document.getElementById('ProductsComments');
  CommentsList.innerHTML = ''; 
  comments.forEach(comentario => { 
    const listaItem = document.createElement('p');
    listaItem.innerHTML = 
        `
        ${comentario.user}
        <br>
        <span>${comentario.score} <i class="fa-solid fa-star"></i></span>
        ${comentario.dateTime}
        <br>
        ${comentario.description}
        <br>
        <strong><i class="fa-regular fa-thumbs-up"></i> Me gusta</strong> 
    `

    ;

    CommentsList.appendChild(listaItem); 
  });
}



// Función para obtener los datos del producto de la API
function getProductData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Asignación de los valores recibidos de la API
      const productName = data.name || 'Nombre no disponible';
      const productCost = data.cost || 'Precio no disponible';
      const soldCount = data.soldCount || '0';
      const currency = data.currency || 'Moneda no disponible';
      const productDescription = data.description || 'Descripción no disponible';
      const productImage = data.images[0] || 'default.jpg'; // Si no hay imagen, usa una por defecto

      // Mostrar la información en el HTML
      document.querySelector('#product-name').textContent = productName;
      document.querySelector('#product-cost').textContent = `Precio: $${productCost}`;
      document.querySelector('#soldCount').textContent = `Cantidad vendidos: ${soldCount}`;
      document.querySelector('#currency').textContent = `Moneda: ${currency}`;
      document.querySelector('#product-image').src = productImage;
      document.querySelector('#product-description').textContent = productDescription;
          // Cargar productos relacionados
          if (data.relatedProducts) {
            setRelatedProducts(data.relatedProducts);
          }
    })
    .catch((error) => console.error('Error:', error)); // Captura errores de la solicitud
}

// Ejecutar cuando la página esté cargada
document.addEventListener("DOMContentLoaded", function() {
  // Recuperar el identificador del producto desde localStorage
  let productId = localStorage.getItem("selectedProductId");

  if (productId) {
    // Construir la URL con el ID del producto
    const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
    getProductData(url);
  } else {
    alert("No se ha seleccionado ningún producto.");
  }
});
document.addEventListener("DOMContentLoaded", function() {
  const submitButton = document.getElementById('submit-comment');
  let scoreValue= 0; 

  // Maneja el evento de clic para las estrellas
  const stars = document.querySelectorAll('.star'); 
  stars.forEach(star => {
      star.addEventListener('click', () => {
          scoreValue = parseInt(star.getAttribute('data-value')); // Obtiene el valor de la estrella clicada
          updateStars(); 
          console.log('Calificación seleccionada:', scoreValue); // Muestra la calificación seleccionada
      });
  });

  // Función para actualizar las estrellas seleccionadas
  function updateStars() {
      stars.forEach(star => {
          star.classList.remove('selected'); // Limpia todas las selecciones
          if (parseInt(star.getAttribute('data-value')) <= scoreValue) {
              star.classList.add('selected'); // Marca las estrellas hasta la seleccionada
          }
      });
  }

  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();

      const comentarioInput = document.getElementById('ComentarioInput').value;

      // Comprobar si no se ha seleccionado ninguna calificación
      if (scoreValue === 0) {
        alert("Por favor, selecciona una calificación antes de enviar tu comentario.");
        return; // Salir de la función si no se seleccionó ninguna calificación
    }
      // Recuperar el nombre del usuario desde el local storage
      const username = localStorage.getItem('username')
      // crear nuevo comentario 
      const newComment = { 
        description: comentarioInput,
        user:  username,
        dateTime: new Date().toISOString().split('T')[0],
        score : scoreValue,  // Obtener la calificación seleccionada por el usuario (de 1 a 5)  
        
      };

       
       commentsData.push(newComment);
       ShowComments(commentsData)
       console.log (newComment)

      // Limpiar los campos del formulario
      document.getElementById('ComentarioInput').value = '';
    });
  } else {
    console.error("Error en el envío del comentario");
  }
});

function setRelatedProducts(relatedProducts) {
  relatedProducts.forEach((product, index) => {
    if (index < 2) {  
      const productName = product.name || 'Nombre no disponible';
      const productImage = product.image || 'default.jpg'; 

      document.querySelector(`#related-product-name-${index + 1}`).textContent = productName;
      document.querySelector(`#related-product-image-${index + 1}`).src = productImage;
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  let productId = localStorage.getItem("selectedProductId");

  if (productId) {
    const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
    setRelatedProducts(url);
  } else {
    alert("No se ha seleccionado ningún producto.");
  }
});



