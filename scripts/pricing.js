var interval = 10;
var duration= 1000;
var shake= 3;
var vibrateIndex = 0;	
var elemento;

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
				index : 3,
				stepSize : 1,
				slideRange : {
				    max : 500,
				    min  : 3
				},
				getPrice : function(){
				    return (this.index - 3)*10;
				}
    },
    write_reqs : {
        index : 0,
        stepSize : 10000,
        slideRange : {
            max : 5000000,
            min  : 0
        },
        getPrice : function(){
            return Math.round(this.index/1000 * 0.01);
        }
    },
    read_reqs: {
        index : 0,
        stepSize : 100000,
        slideRange : {
            max : 50000000,
            min  : 0
        },
        getPrice : function(){
            return Math.round(this.index/10000 * 0.01);
        }
    },
    data_transfer : {
        index : 0,
        stepSize : 100,
        slideRange : {
            max : 500000,
            min  : 0
        },
        getPrice : function(){
            return Math.round(this.index * 0.12);
        }
    }
}
//
    
var vibrate = function(){
    elemento.stop(true,false).css({left: 20+Math.round(Math.random() * shake) - ((shake + 1) / 2) +'px'});
}

var stopVibration = function() {
    clearInterval(vibrateIndex);
    elemento.stop(true,false).css({left: '20px'});
};

function contactHighlight(){
	$('.contactus').animate(
    {	color: '#ffcc66'},{
        "duration": "slow",
        "easing": "linear"
    }).animate(
    {	color: '#878787'},{
        "duration": "slow",
        "easing": "linear"
    });
}

function hideContactDialog(){
    $( '#contactDialog .modal' ).clearQueue();
    $( '#contactDialog .modal' ).animate(
    {	
        width: ['0', 'easeOutBounce'],
        height: ['0', 'easeOutBounce'],
        "margin-top": ['0', 'easeOutBounce'],
        "margin-left": ['0', 'easeOutBounce']
    },
    {
        "duration": 1000,
        "easing": "easeInOutBounce",
        "complete":function(){
            $( '#contactDialog' ).hide();
        }
    });
}

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
        
        var slidelimit =  targetParent.height() - target.height();
        
        var steps = (slideRange.max - slideRange.min) /slideValues[target.attr('jsMap')].stepSize;
        
        if(steps > slidelimit){
            steps = slidelimit;
        }
        
        // Normalize Steps
        var stepRange = slidelimit / steps;
        
        var realOffset = Math.round((event.offsetY - targetParent.offset().top)/stepRange) *stepRange ;
        
        if( realOffset >= 0 && realOffset <= slidelimit){
            sindex = realOffset;
        }else{
            if(realOffset < 0){
                
                sindex = 0;
                
                var displayContactUs = true;
                
            }else{
                
                sindex = slidelimit;

            }
        }
        
        target.css({
            top: Math.round( sindex )
        });
        
        var valmax = steps * slideValues[target.attr('jsMap')].stepSize;
        
        var xval = slidelimit - sindex;
        
        var shownIndex =  ((xval*valmax) / slidelimit) + slideRange.min;
				var base_unit = '';
				var K_unit = 'K';
				var M_unit = 'M';
        if(target.attr('id') == 'slideStorage' || target.attr('id') == 'slideTransfer') {
					base_unit = 'GB'; K_unit = 'TB'; M_unit = 'PB';
				} 
        
				if(shownIndex >= 1000000){
					target.children('.amount').text(shownIndex/1000000+M_unit);
				}
				else if(shownIndex >= 1000){
        	target.children('.amount').text(shownIndex/1000+K_unit);
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