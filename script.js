$(document).ready(function() {
    // Function to generate thumbnails from main slider content
    function generateThumbnails() {
        const mainSlides = $('.gallery-main .gallery-slide');
        const thumbnailContainer = $('.gallery-thumbnails');
        
        // Clear existing thumbnails
        thumbnailContainer.empty();
        
        // Generate thumbnail for each main slide
        mainSlides.each(function(index) {
            const slide = $(this);
            const slideImg = slide.find('img');
            const slideTitle = slide.find('h3').text();
            
            // Create thumbnail div
            const thumbnail = $('<div class="gallery-thumbnail-slide"></div>');
            
            // Create thumbnail image
            const thumbnailImg = $('<img>').attr({
                'src': slideImg.attr('src'),
                'alt': slideImg.attr('alt'),
                'title': slideTitle
            });
            
            // Add click handler for thumbnail navigation
            thumbnailImg.on('click', function() {
                $('.gallery-main').slick('slickGoTo', index);
            });
            
            // Append image to thumbnail
            thumbnail.append(thumbnailImg);
            
            // Append thumbnail to container
            thumbnailContainer.append(thumbnail);
        });
    }
    
    // Function to get thumbnail settings from data attributes
    function getThumbnailSettings() {
        const galleryMain = $('.gallery-main');
        const desktopThumbs = parseInt(galleryMain.data('thumbs-desktop')) || 4;
        const tabletThumbs = parseInt(galleryMain.data('thumbs-tablet')) || 3;
        const mobileThumbs = parseInt(galleryMain.data('thumbs-mobile')) || 2;
        
        return {
            slidesToShow: desktopThumbs,
            slidesToScroll: desktopThumbs,
            asNavFor: '.gallery-main',
            dots: false,
            centerMode: false,
            focusOnSelect: true,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: tabletThumbs,
                        slidesToScroll: tabletThumbs
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: mobileThumbs,
                        slidesToScroll: mobileThumbs
                    }
                }
            ]
        };
    }
    
    // Initialize main slider
    function initMainSlider() {
        $('.gallery-main').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: false,
            infinite: false,
            speed: 1000,
            asNavFor: '.gallery-thumbnails',
            prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">‹</button>',
            nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">›</button>',
            dots: false,
            adaptiveHeight: false
        });
    }
    
    // Initialize thumbnail slider
    function initThumbnailSlider() {
        $('.gallery-thumbnails').slick(getThumbnailSettings());
    }
    
    // Handle window resize for responsive behavior
    function handleResize() {
        if ($('.gallery-thumbnails').hasClass('slick-initialized')) {
            $('.gallery-thumbnails').slick('unslick');
        }
        initThumbnailSlider();
    }
    
    // Initialize everything
    function init() {
        // Generate thumbnails first
        generateThumbnails();
        
        // Initialize sliders
        initMainSlider();
        initThumbnailSlider();
        
        // Add resize handler
        $(window).on('resize', handleResize);
        
        // Add keyboard navigation
        $(document).on('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                $('.gallery-main').slick('slickPrev');
            } else if (e.key === 'ArrowRight') {
                $('.gallery-main').slick('slickNext');
            }
        });
    }
    
    // Start initialization
    init();
    
    // Optional: Add touch/swipe support for better mobile experience
    let startX = 0;
    let startY = 0;
    
    $('.gallery-main').on('touchstart', function(e) {
        startX = e.originalEvent.touches[0].clientX;
        startY = e.originalEvent.touches[0].clientY;
    });
    
    $('.gallery-main').on('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.originalEvent.changedTouches[0].clientX;
        const endY = e.originalEvent.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next slide
                $('.gallery-main').slick('slickNext');
            } else {
                // Swipe right - previous slide
                $('.gallery-main').slick('slickPrev');
            }
        }
        
        startX = 0;
        startY = 0;
    });
    
    // Add loading state management
    $('.gallery-main img').on('load', function() {
        $(this).closest('.gallery-slide').addClass('loaded');
    });
    
    // Add error handling for broken images
    $('.gallery-main img').on('error', function() {
        $(this).attr('src', 'https://via.placeholder.com/800x400/cccccc/666666?text=Image+Not+Found');
    });
});
