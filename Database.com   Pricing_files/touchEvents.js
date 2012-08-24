var noPrevent;

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup"; break;
        default: return;
    }
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);
                                                                             
    first.target.dispatchEvent(simulatedEvent);
    if(!noPrevent){
		event.preventDefault();		
	}	
}

function initTouchEvents(elems,np)
{    
	noPrevent = np;
		
    elems.each(function(i,el,c){
            el.addEventListener("touchstart", touchHandler, true);
            el.addEventListener("touchmove", touchHandler, true);
            el.addEventListener("touchend", touchHandler, true);
    });
}
function removeTouchEvent(el){
	el.removeEventListener("touchstart", touchHandler, true);
	el.removeEventListener("touchmove", touchHandler, true);
	el.removeEventListener("touchend", touchHandler, true);
}