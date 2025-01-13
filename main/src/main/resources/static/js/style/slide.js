$(document).ready(function () {
    // Inicializa o slider
    $('.slider').slick({
        dots: false, // Habilita os pontos de navegação
        infinite: true, // Habilita a rotação infinita
        speed: 300, // Velocidade da transição
        slidesToShow: 1, // Mostra apenas um slide por vez
        slidesToScroll: 1, // Vai para o próximo slide por vez
        arrows: true, // Habilita as setas de navegação
        prevArrow: '.custom-prev', // Seleciona o botão anterior
        nextArrow: '.custom-next',  // Seleciona o botão próximo
        autoplay: true,          // Habilita o autoplay
        autoplaySpeed: 10000     // Define o intervalo de 30 segundos (em milissegundos)
      });

    // Botão "Anterior"
    $('.custom-prev').on('click', function () {
        $('.slider').slick('slickPrev'); // Vai para o slide anterior
    });

    // Botão "Próximo"
    $('.custom-next').on('click', function () {
        $('.slider').slick('slickNext'); // Vai para o próximo slide
    });
});
