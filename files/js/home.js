
// Notify me tab
;(function(window) {

	'use strict';

	var mainContainer = document.querySelector('.sliced-content'),
		openCtrl = document.getElementById('icon-open'),
		closeCtrl = document.getElementById('icon-close'),
		notifyContainer = document.querySelector('.notify'),
		inputNotify = notifyContainer.querySelector('.subscribe-form');

	function init() {
		initEvents();
	}

	function initEvents() {
		openCtrl.addEventListener('click', openNotify);
		closeCtrl.addEventListener('click', closeNotify);
		document.addEventListener('keyup', function(ev) {
			// escape key.
			if( ev.keyCode == 27 ) {
				closeNotify();
			}
		});
	}

	function openNotify() {
		mainContainer.classList.add('zoom-out');
		notifyContainer.classList.add('is-opened');
		setTimeout(function() {
			inputNotify.focus();
		}, 600);
	}

	function closeNotify() {
		mainContainer.classList.remove('zoom-out');
		notifyContainer.classList.remove('is-opened');
		inputNotify.blur();
		inputNotify.value = '';
	}

	init();

})(window);

// $(document).ready(function() {
//     var loops = 3 * 2;
//     function removeAddClass() {
//       $("#glitch").toggleClass(".glitching");
//       if (--loops > 0)
// 				setTimeout(removeAddClass, 2000);
//     }
//     removeAddClass();
// });

// setInterval(function(){
//    // toggle the class every five second
//    $('.glitch').toggleClass('.glitching');
//    setTimeout(function(){
//      // toggle back after 1 second
//      $('.glitch').toggleClass('.glitching');
//    },2000)
//
// },5000);

// setInterval(function(){
//    // toggle the class every five second
//    $('.glitch').toggleClass('.glitching');
//    setTimeout(function(){
//      // toggle back after 1 second
//      $('.glitch').toggleClass('.glitching');
//    },2000)
//
// },5000);

// $(".glitch").mgGlitch({
//   destroy: false,
//   glitch: true,
//   scale: true,
//   blend: true,
//   blendModeType: "hue",
//   glitch1TimeMin: 200,
//   glitch1TimeMax: 400,
//   glitch2TimeMin: 10,
//   glitch2TimeMax: 100
// });
// setTimeout(function(){
// 	$(".glitch").mgGlitch({
// 		destroy: true
// 	});
// }, 2000);
// console.log("DOG");

///////////////////////////////////////////////////////////////////////////////
// function toggleGlitch(){
//
// 	var $glitchContainter = $('.sliced-content');
//   var $glitchDiv =  $('.glitch');
// 	var $glitchIn =  $('.glitchIn');
//
// 	$glitchDiv.mgGlitch({
// 	  destroy: false,
// 	  glitch: true,
// 	  scale: true,
// 	  blend: true,
// 	  blendModeType: "hue",
// 	  glitch1TimeMin: 200,
// 	  glitch1TimeMax: 400,
// 	  glitch2TimeMin: 10,
// 	  glitch2TimeMax: 100
// 	});
// 	setTimeout(function(){
// 		$glitchDiv.mgGlitch({
// 			destroy: true
// 		});
// 	}, 2000);
//
// 	// console.log("DOG");
//
// 	setInterval(function(){
//       // scope changed, this is bound to window
//       $glitchIn.toggleClass('glitchOut');
//   }, 2000);
// }
//
// $(function(){
//   setInterval(function(){toggleGlitch();}, 4000);
// });


// $(function() {
//
// 	var $glitchContainter = $('.sliced-content');
//   var $glitchDiv =  $('.glitch');
// 	var $glitchIn =  $('.glitchIn');
//
//   // var interval;
// 	function startGlitch() {
// 		$glitchDiv.mgGlitch({
// 		  destroy: false,
// 		  glitch: true,
// 		  scale: true,
// 		  blend: true,
// 		  blendModeType: "hue",
// 		  glitch1TimeMin: 200,
// 		  glitch1TimeMax: 400,
// 		  glitch2TimeMin: 10,
// 		  glitch2TimeMax: 100
// 		});
// 	}
//
//   // function stopGlitch(){
// 	// 	$glitchDiv.mgGlitch({
// 	// 	  destroy: true
// 	// 	});
// 	// }
//
//   function stopGlitch(){
// 		// $glitchIn.toggleClass('.glitchOut');
// 		setTimeout(function(){
// 			$glitchDiv.mgGlitch({
// 				destroy: true
// 			});
// 		}, 2000);
//   }
//
//   $glitchDiv.on('mouseenter', stopGlitch).on('mouseleave', startGlitch);
//
//
//
//   // startGlitch();
// });

// $(function() {
//
// 	var $glitchContainter = $('.sliced-content');
//   var $glitchDiv =  $glitchContainter.find('.glitch');
//
//   var interval;
//
// 	function startGlitch() {
//     interval = setInterval(function() {
//       $glitchDiv.mgGlitch({
//  	     destroy: false,
//  	     glitch: true,
//  	     scale: true,
//  	     blend: true,
//  	     blendModeType: "hue",
//  	     glitch1TimeMin: 200,
//  	     glitch1TimeMax: 400,
//  	     glitch2TimeMin: 10,
//  	     glitch2TimeMax: 100
//  	   });
// 	 }, 2000);
// 	}
//
//   function stopGlitch(){
// 		// $(".glitching").mgGlitch({
// 	  //   destroy: true
// 	  // });
//     clearInterval(interval);
//   }
//
//   $glitchContainter.on('mouseenter', stopGlitch).on('mouseleave', startGlitch);
//
//   startGlitch();
// },5000);


// setInterval(function(){
//    // toggle the class every five second
//    $('.glitch').mgGlitch({
// 		 destroy: true
// 	 });
//    setTimeout(function(){
//      // toggle back after 1 second
//      $('.glitch').mgGlitch({
// 	     destroy: false,
// 	     glitch: true,
// 	     scale: true,
// 	     blend: true,
// 	     blendModeType: "hue",
// 	     glitch1TimeMin: 200,
// 	     glitch1TimeMax: 400,
// 	     glitch2TimeMin: 10,
// 	     glitch2TimeMax: 100
// 	   });
//    },2000)
//
// },5000);

// $(function() {
//   $(".glitching").mgGlitch({
//     destroy: false,
//     glitch: true,
//     scale: true,
//     blend: true,
//     blendModeType: "hue",
//     glitch1TimeMin: 200,
//     glitch1TimeMax: 400,
//     glitch2TimeMin: 10,
//     glitch2TimeMax: 100
//   });
// });
