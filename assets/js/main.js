$(document).ready(function () {
    $('.slider-wrapper').slick({
        infinite: true,          // Enables infinite looping
        slidesToShow: 3,         // Number of slides to show at a time (default)
        slidesToScroll: 1,       // Number of slides to scroll at a time
        autoplay: true,          // Enables auto-play
        dots: true,
        autoplaySpeed: 2000,     // Delay between transitions in milliseconds
        arrows: false,           // Disables the navigation arrows
        responsive: [
            {
                breakpoint: 1024,  // For tablets and larger screens
                settings: {
                    slidesToShow: 2,  // Shows 3 slides at a time
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,   // For small tablets and phones
                settings: {
                    slidesToShow: 2,  // Shows 2 slides at a time
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 580,   // For mobile phones
                settings: {
                    slidesToShow: 1,  // Shows 1 slide at a time
                    slidesToScroll: 1,
                }
            }
        ]
    });
});
