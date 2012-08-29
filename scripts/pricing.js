var interval = 10;
var duration= 1000;
var shake= 3;
var vibrateIndex = 0; 
var elemento;

// test cases:
// 5TB storage = 578.56 
function progressivePrice(rates, amount) {
	var total = 0;
	
	for (i in rates){
		if(amount > rates[i].from){
			total += rates[i].cumlative;
			if(amount <= rates[i].to){
				total += (amount - rates[i].from) * rates[i].percentage;
				break;
			}
		}
	}
	
	return Math.round(total);
}

var slideValues ={
		getTotalPrice : function(){
				var total = 0;
				for(var i in this){
						if( typeof this[i].getPrice != 'undefined' ){
								total += this[i].getPrice();
						}
				}
				return total;
		},
		storage : {
				index : 0,
				stepSize : 256,
				slideRange : {
						max : 20*1024,
						min	 : 0
				},
				getPrice : function(){
					var rates = [
						{ from: 0, to: 1024, percentage: 0.125, cumlative: 0 },
						{ from: 1024, to: 50*1024, percentage: 0.11, cumlative: 126.976 }, 
						// UI uses to line above.. the below for completeness / later use
						{ from: 50*1024, to: 500*1024, percentage: 0.095, cumlative: 5646.336 }, 
						{ from: 500*1024, to: 1000*1024, percentage: 0.09, cumlative: 49422.336 }, 
						{ from: 1000*1024, to: 5000*1024, percentage: 0.08, cumlative: 418062.336 }, 
						{ from: 5000*1024, to: 100000*1024, percentage: 0.055, cumlative: 745742.336 } 
					];
					return progressivePrice(rates, this.index);
				}
		},
		write_reqs : {
				index : 0,
				stepSize : 50000,
				slideRange : {
						max : 5000000,
						min	 : 0
				},
				getPrice : function(){
						return Math.round(this.index / 1000 * 0.01);
				}
		},
		read_reqs: {
				index : 0,
				stepSize : 500000,
				slideRange : {
						max : 50000000,
						min	 : 0
				},
				getPrice : function(){
						return Math.round(this.index/10000 * 0.01);
				}
		},
		data_transfer : {
				index : 0,
				stepSize : 256,
				slideRange : {
						max : 5*1024,
						min	 : 0
				},
				getPrice : function(){
					var rates = [
						{ from: 0, to: 1, percentage: 0, cumlative: 0 },
						{ from: 1, to: 1024, percentage: 0.12, cumlative: 0 },
						// UI uses to line above.. the below for completeness / later use
						{ from: 1024, to: 50*1024, percentage: 0.09, cumlative: 122.76 },
						{ from: 50*1024, to: 150*1024, percentage: 0.07, cumlative: 7290.76 },
						{ from: 150*1024, to: 500*1024, percentage: 0.05, cumlative: 14458.76 }
					];
					return progressivePrice(rates, this.index);
				}
		}
}

var vibrate = function(){
		elemento.stop(true,false).css({left: 20+Math.round(Math.random() * shake) - ((shake + 1) / 2) +'px'});
}

var stopVibration = function() {
		clearInterval(vibrateIndex);
		elemento.stop(true,false).css({left: '20px'});
};

$(document).ready(function () {
    
	// Add Draggable Helper
	$('.pricingslider .cursor').each(function(){
		$(this).append('<div class="helper">&nbsp;</div>');
		//Init Touch events if is in Ipad
		if(isIpad){
			 initTouchEvents($(this).children('.helper'),false);
		}
	});
	// Ipad Fix
	$('.pricingslider .cursor .helper').live('touchstart touchmove touchend',function(){});
	
		$('.pricingslider .cursor .helper').live('drag',function(other, event){
		
				var sindex= 0;
				var target = $(event.target).parent();
				var targetParent = target.parent();
				
				var slideRange = slideValues[target.attr('jsMap')].slideRange;
				var slideLimit =	targetParent.height() - target.height();
				var stepSize = slideValues[target.attr('jsMap')].stepSize;
				var steps = (slideRange.max - slideRange.min) / stepSize;
				
				if(steps > slideLimit){
						steps = slideLimit;
				}
				
				// Normalize Steps
				var stepRange = slideLimit / steps;
				var realOffset = Math.round((event.offsetY - targetParent.offset().top)/stepRange) *stepRange ;
				
				if( realOffset >= 0 && realOffset <= slideLimit){
						sindex = realOffset;
				} else{
						if(realOffset < 0){
								sindex = 0;
								var displayContactUs = true;
						} else {
								sindex = slideLimit;
						}
				}
				
				target.css({ top: Math.round( sindex ) });
			 
				var valmax = steps * stepSize;
				var xval = slideLimit - sindex;
				var shownIndex =	((xval*valmax) / slideLimit) + slideRange.min;
				shownIndex = Math.round(shownIndex/stepSize) * stepSize; // round to the nearest step
				
				var base_unit = '';
				var K_unit = 'K';
				var M_unit = 'M';
				var K_val = 1000;
				if(target.attr('id') == 'slideStorage' || target.attr('id') == 'slideTransfer') {
					base_unit = 'GB'; K_unit = 'TB'; M_unit = 'PB';
					K_val = 1024;
				} 
				if(shownIndex >= K_val*K_val){
					target.children('.amount').text((shownIndex/(K_val*K_val)).toFixed(1)+M_unit);
				}
				else if(shownIndex >= K_val){
					target.children('.amount').text(shownIndex/K_val+K_unit);
				}	 
				else {
						target.children('.amount').text(shownIndex+base_unit);
				}
				slideValues[target.attr('jsMap')].index = shownIndex;
				
				targetParent.siblings('.pricingheader').children('.price')
					.text(slideValues[target.attr('jsMap')].getPrice());
				
				$('#pricingtotal .pricingheader .price').text(slideValues.getTotalPrice());
				
		});
});