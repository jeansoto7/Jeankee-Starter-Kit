<<<<<<< HEAD
// Signup Forms
$(function(){
  $('.form-display .mc-field-group input').focusout(function(){
    var text_val = $(this).val();
    if(text_val === "") {
      $(this).removeClass('has-value');
    } else {
      $(this).addClass('has-value');
    }
  });
=======
$(function() {
  // dsss
  smoothScroll(300);
>>>>>>> 11867e35e751920c1c4a62bdcfa6618dedbb95fe
});

// Stop Image being Draggable
$('img').attr('draggable', 'false');

// Glitch
function toggleGlitch(){

	var $glitchContainter = $('.sliced-content');
  var $glitchDiv =  $('.glitch');
	var $glitchIn =  $('.glitchIn');

	$glitchDiv.mgGlitch({
	  destroy: false,
	  glitch: true,
	  scale: true,
	  blend: true,
	  blendModeType: "hue",
	  glitch1TimeMin: 200,
	  glitch1TimeMax: 400,
	  glitch2TimeMin: 10,
	  glitch2TimeMax: 100
	});
	setTimeout(function(){
		$glitchDiv.mgGlitch({
			destroy: true
		});
	}, 1000);

	setInterval(function(){
      $glitchIn.toggleClass('glitchOut');
  }, 1000);
}

$(function(){
  setInterval(function(){toggleGlitch();}, 4000);
});
