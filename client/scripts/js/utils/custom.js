/*******************************************************************************
 *
 *  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER. 
 *  Copyright (c) 2015 GransLive
 *  All Rights Reserved. All content is proprietary and confidential.
 *
 *******************************************************************************/
var $ = jQuery.noConflict();

function image_preload(selector, parameters) {
	var params = {
		delay: 250,
		transition: 400,
		easing: 'linear'
	};
	$.extend(params, parameters);
		
	$(selector).each(function() {
		var image = $(this);
		image.css({visibility:'hidden', opacity: 0, display:'block'});
		image.wrap('<span class="preloader" />');
		image.one("load", function(evt) {
			$(this).delay(params.delay).css({visibility:'visible'}).animate({opacity: 1}, params.transition, params.easing, function() {
				$(this).unwrap('<span class="preloader" />');
			});
		}).each(function() {
			if(this.complete) $(this).trigger("load");
		});
	});
}


function tab_widget(tabid) {
    
    var $sidebarWidgets = $('.sidebar-widgets-wrap');
    var $footerWidgets = $('.footer-widgets-wrap');
    
    $( tabid + " .tab_content").hide();
    $( tabid + " ul.tabs li:first").addClass("active").show();
    $( tabid + " .tab_content:first").show();
    
    if( window.location.hash != '' ) {
        
        var getTabHash = window.location.hash;
        
        if( $( getTabHash ).hasClass('tab_content') ) {
        
            $( tabid + " ul.tabs li").removeClass("active");
            $( tabid + ' ul.tabs li a[data-href="'+ getTabHash +'"]').parent('li').addClass("active");
            $( tabid + " .tab_content").hide();
            $( getTabHash + '.tab_content').show();
        
        }
        
    }
    
    $( tabid + " ul.tabs li").click(function() {    
		console.log("Tab Clicked : >>> ", tabid);
        $( tabid + " ul.tabs li").removeClass("active");
        $(this).addClass("active");		
        $( tabid + " .tab_content").hide();
        var activeTab = $(this).find("a").attr("data-href");
        var $selectTab = $(this);
        $(activeTab).fadeIn(600,function(){
            if( $selectTab.parent().parent().hasClass("side-tabs") ) {
                if( $(window).width() < 768 ) { if( $().scrollTo ) { jQuery.scrollTo( activeTab , 400, {offset:-20} ); } }
            }            
        });
        return false;
        
	});
    
}

function pageloadCalls (){
        
console.log('IN pageloadCalls >>>>>>>>> ');
        
        if ( $().superfish ) {
        
            $("#primary-menu ul, .sticky-menu-wrap ul").superfish({ 
                delay: 250,
                speed: 300,
                animation: {opacity:'show', height:'show'},
                autoArrows: false,
                dropShadows: false
            });
        
        }

        // ToolTips
        
        if ( $().tipsy ) { nTip=function(){ $('.ntip').tipsy({gravity: 's', fade:true}); }; nTip(); }
		if ( $().tipsy ) { sTip=function(){ $('.stip').tipsy({gravity: 'n', fade:true}); }; sTip(); }
		if ( $().tipsy ) { eTip=function(){ $('.etip').tipsy({gravity: 'w', fade:true}); }; eTip(); }
		if ( $().tipsy ) { wTip=function(){ $('.wtip').tipsy({gravity: 'e', fade:true}); }; wTip(); }
        
        
        $("#primary-menu ul li:has(ul)").addClass('sub-menu');
        
        $(".sticky-menu-wrap ul li:has(ul)").addClass('sub-menu');
        
        
        var headerHeight = $('#header').outerHeight() + 170;
        
        stickyMenuFunction=function(){
        
        var scrollTimer = null;
        $(window).scroll(function () {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(handleScroll, 200);
        });
        
        function handleScroll() {
            scrollTimer = null;
            
            var stickyWindowWidth = $(window).width();
            
            if( stickyWindowWidth > 979 ) {
            
                if ($(window).scrollTop() > headerHeight) {
                    $('#sticky-menu').show();
                    $('#sticky-menu').filter(':not(:animated)').animate({top:'0px'}, 250);
                } else {
                    $('#sticky-menu').filter(':not(:animated)').animate({top:'-60px'}, 250, function(){
                        $(this).fadeOut();
                    });
                }
            
            } else {
                $('#sticky-menu').hide();
            }
        }
        
        };
		stickyMenuFunction();
        
        
        $('.sticky-search-trigger a').click(function() {
        	console.log('Search Image Clicked.....');
			$('.sticky-search-area').fadeIn('fast', function(){
                $(this).find('input').focus();
			});
            return false;
		});
        
        $('.sticky-search-area-close a').click(function() {
			$('.sticky-search-area').fadeOut('fast');
            return false;
		});


        // Scroll to Top
        
		$(window).scroll(function() {
			if($(this).scrollTop() > 450) {
                $('#gotoTop').fadeIn();
			} else {
				$('#gotoTop').fadeOut();
			}
		});
        
        
		$('#gotoTop').click(function() {
			$('body,html').animate({scrollTop:0},400);
            return false;
		});
        
        
        $(window).resize(function() {
            stickyMenuFunction();
        });
        
        
        // Siblings Fader
        
        siblingsFader=function(){
		$(".siblings_fade,.flickr_badge_image").hover(function() {
			$(this).siblings().stop().fadeTo(400,0.5);
		}, function() {
			$(this).siblings().stop().fadeTo(400,1);
		});
		};
		siblingsFader();
        
        
        // Images Preload
        
        image_preload('.portfolio-image:not(.port-gallery) img,#kwicks-slider img,.rs-slider img');
        
        $('.port-gallery').each(function(){ $(this).addClass('preloader'); });
        
        $('.fslider').each(function(){ $(this).addClass('preloader2'); });
        
        
        // Image Fade
        
		imgFade=function(){
		$('.image_fade,#top-menu li.top-menu-em a').hover(function(){
			$(this).filter(':not(:animated)').animate({opacity: 0.6}, 400);
		}, function () {
			$(this).animate({opacity: 1}, 400);
		});
		};
		imgFade();
        
        
        $(window).scroll(function () {
        
            $('.progress:in-viewport').each(function(){
    			var skillsBar = $(this),
    			skillValue = skillsBar.find('.bar').attr('data-width');
    			if (!skillsBar.hasClass('animated')) {
                    skillsBar.parent().find('span').hide();
    				skillsBar.addClass('animated');
    				skillsBar.find('.bar').animate({
    					width: skillValue + "%"
    				}, 500, function() {
    					skillsBar.parent().find('span').fadeIn(400);
    				});
    			}
    		});
        
        });
        
        
        // Toggles
        
        $(".togglec").hide();
    	
    	$(".togglet").click(function(){
    	
    	   $(this).toggleClass("toggleta").next(".togglec").slideToggle("normal");
    	   return true;
        
    	});
        
        
        // Pricing Tables
        
        $('.pricing-defines').each( function(){
            
            var pricingDefinesTop = $(this).next().find('.pricing-features').position();
            
            var pricingDefinesParentHeight = $(this).next().outerHeight();
            
            $(this).find('.pricing-features').css( 'margin-top', (pricingDefinesTop.top - 1) + 'px' );
            
            $(this).find('.pricing-inner').css( 'height', (pricingDefinesParentHeight - 1) + 'px' );
            
        });


        // Accordions
    
        $('.acc_content').hide(); //Hide/close all containers
        $('.acctitle:first').addClass('acctitlec').next().show(); //Add "active" class to first trigger, then show/open the immediate next container

        //On Click
        $('.acctitle').click(function(){
            if( $(this).next().is(':hidden') ) { //If immediate next container is closed...
                $('.acctitle').removeClass('acctitlec').next().slideUp("normal"); //Remove all "active" state and slide up the immediate next container
                $(this).toggleClass('acctitlec').next().slideDown("normal"); //Add "active" state to clicked trigger and slide down the immediate next container
            }
            return false; //Prevent the browser jump to the link anchor
        });
                
        
        // FitVids
        
//        if ( $().fitVids ) { $("#content,#footer,#slider:not(.layerslider-wrap),.landing-offer-media").fitVids( { customSelector: "iframe[src^='http://www.dailymotion.com/embed']"} ); }
        
        
        // prettyPhoto
        
        if ( $().prettyPhoto ) {
            
            initprettyPhoto=function(){
                
                $("a[rel^='prettyPhoto']").prettyPhoto({ theme: 'light_square', social_tools: false });
            
            };
            initprettyPhoto();
        
        }
        
        
        // Mobile Menu
        
        if( $().mobileMenu ) { $('#primary-menu ul#main-menu').mobileMenu({ subMenuDash: '&nbsp;&ndash;&nbsp;' }); }
        
        
        // UniForm
        
        // if( $().uniform ) { $("#primary-menu select").uniform({selectClass: 'rs-menu'}); }
        
        
        // Anchor Link Scroll
        
        $("a[data-scrollto]").click(function(){
    	
            var divScrollToAnchor = $(this).attr('data-scrollto');
            
            if( $().scrollTo ) { jQuery.scrollTo( $( divScrollToAnchor ) , 400, {offset:-20} ); }
            
            return false;
        
    	});

}

var pageLoadCompleted = function(){

		pageloadCalls();
	    
	    $('#pageLoader').fadeOut(800, function(){
	        $(this).remove();
	    });
	    
	    
	    siblingsFader();
	    
	    
	    // Flex Slider
	    
	    if ( $().flexslider ) {
	        
	        $('.fslider .flexslider').each(function() {
	            
	            var flexsAnimation = $(this).parent('.fslider').attr('data-animate');
	            var flexsEasing = $(this).parent('.fslider').attr('data-easing');
	            var flexsDirection = $(this).parent('.fslider').attr('data-direction');
	            var flexsSlideshow = $(this).parent('.fslider').attr('data-slideshow');
	            var flexsPause = $(this).parent('.fslider').attr('data-pause');
	            var flexsSpeed = $(this).parent('.fslider').attr('data-speed');
	            var flexsVideo = $(this).parent('.fslider').attr('data-video');
	            var flexsSheight = true;
	            var flexsUseCSS = false;
	            
	            if( !flexsAnimation ) { flexsAnimation = 'slide'; }
	            if( !flexsEasing || flexsEasing == 'swing' ) {
	                flexsEasing = 'swing';
	                flexsUseCSS = true;
	            }
	            if( !flexsDirection ) { flexsDirection = 'horizontal'; }
	            if( !flexsSlideshow ) { flexsSlideshow = true; }
	            if( !flexsPause ) { flexsPause = 5000; }
	            if( !flexsSpeed ) { flexsSpeed = 600; }
	            if( !flexsVideo ) { flexsVideo = false; }
	            if( flexsDirection == 'vertical' ) { flexsSheight = false; }
	            
	            $(this).flexslider({
	                
	                selector: ".slider-wrap > .slide",
	                animation: flexsAnimation,
	                easing: flexsEasing,
	                direction: flexsDirection,
	                slideshow: flexsSlideshow,
	                slideshowSpeed: Number(flexsPause),
	                animationSpeed: Number(flexsSpeed),
	                pauseOnHover: true,
	                video: flexsVideo,
	                controlNav: false,
	                directionNav: true,
	                smoothHeight: flexsSheight,
	                useCSS: flexsUseCSS,
	                start: function(slider){
	                    slider.parent('.fslider').removeClass('preloader2');
	                    slider.parent('.fslider').parent('.port-gallery').removeClass('preloader');
	                }
	                
	            });
	        
	        });
	    
	    }

}

