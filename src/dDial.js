// dDials

// Version 1.3 : 05-Mar-2019
//    Added folders for images and css
//    Fixed min max dial issue
// Version 1.2 : 02-Mar-2019
//    Added Min Max dial
//    Fair amount of refactoring
// Version 1.1 : 01-Mar-2019
//    Add foredial functionality
// Version 1.0 : 27-Feb-2019
//   Initial release. 

function dDial(options){
	
	this.options = Object.assign({	
		element :null,
		name : "",
		backImage : null,
		foreDial : false, 
		foreImage : null,
		foreSize : 130,
		foreBackColour : "#222",
		foreHTML : null,
		foreBevelThickness : 2,
		backColour : "#111",
		bevelColour1 :"#c0c0c0",
		bevelColour2 : "#f0f0f0",
		bevelThickness : 5,
		size : 400 }, options);
	
	this.element = document.getElementById(this.options.element);
	this.element.className = "dial";
	
	var title = document.createElement("div");
	title.className = "dialTitle";
	title.innerHTML = this.options.name;
	this.element.appendChild(title);
	
	this.element.style.height = this.options.size + title.clientHeight + "px";
	this.element.style.width = this.options.size + "px";
	
	this.cvs = drawCreateAndDrawDial(this.element, 
			this.options.name,
			"can_",
			this.options.size, 
			this.options.backImage, 
			this.options.backColour,
			this.options.bevelColour1, 
			this.options.bevelColour2,
			this.options.bevelThickness);

	if (this.options.foreDial)
	{
		this.cvsFore = drawCreateAndDrawDial(this.element, 
				this.options.name,
				"can_fore_", 
				this.options.foreSize,
				this.options.foreImage, 
				this.options.foreBackColour,
				this.options.bevelColour1, 
				this.options.bevelColour2,
				this.options.foreBevelThickness);
				
		this.cvsFore.style.left = ((this.options.size - this.options.foreSize) / 2) + "px";
		this.cvsFore.style.top = this.cvsFore.style.left;	
		this.cvsFore.style.zIndex = 10;	
		
		if ( this.options.foreHTML != null)
		{
			cvsText = document.createElement("div");
			this.element.appendChild(cvsText);
			cvsText.innerHTML = this.options.foreHTML;
			cvsText.style.position = "relative";			
			cvsText.style.left = this.cvsFore.style.left;
			cvsText.style.top = this.cvsFore.style.top;
			cvsText.style.width = this.cvsFore.width + "px";
			cvsText.style.height = this.cvsFore.style.height + "px";
			cvsText.style.textAlign = "center";			
			cvsText.style.zIndex = 11;	
		}
	}	
}

dDial.prototype.draw = function() {
	drawDialContext(
		this.cvs.ctx, 
		this.options.size, 
		this.options.backColour, 
		this.options.bevelColour1, 
		this.options.bevelColour2, 
		this.options.bevelThickness);
	
	if (this.options.foreDial)
	{
		drawDialContext(
			this.cvsFore.ctx, 
			this.options.foreSize, 
			this.options.foreBackColour, 
			this.options.bevelColour1, 
			this.options.bevelColour2, 
			this.options.foreBevelThickness);
	}
}

function drawCreateAndDrawDial(element, name, extra_name, size, backImage, backColour,bevelColour1, bevelColour2, bevelThickness) {
	var canvas = document.createElement("canvas");
	element.appendChild(canvas);
	canvas.width = size;
	canvas.height = size;
	
	var ctx = canvas.getContext('2d');
	canvas.ctx = ctx;
	canvas.id = extra_name+name;
	canvas.className = extra_name;
	
	//Background Image	
	if (backImage != null)
	{
		canvas.style.backgroundImage = "url("+backImage+")";
		canvas.style.borderRadius = size/2 + "px";
		canvas.style.backgroundSize = "contain";
	}

	drawDialContext(ctx, size, backColour, bevelColour1, bevelColour2, bevelThickness);
	
	return canvas;
}

function drawDialContext(ctx, size, backColour, bevelColour1, bevelColour2, bevelThickness) {
	// Back of dial disc
	ctx.beginPath();
	ctx.fillStyle = backColour;
	ctx.arc(size/2,
		size/2, 
		(size/2)-bevelThickness, 
		0, 
		2*Math.PI);
	ctx.fill();
	
	ctx.beginPath();
	ctx.lineWidth = bevelThickness;
	var grd = ctx.createLinearGradient(0,0,size,size);
	grd.addColorStop(0, bevelColour1);
	grd.addColorStop(0.5, bevelColour1);
	grd.addColorStop(1, bevelColour2);
	ctx.strokeStyle = grd;
	
	ctx.arc(size/2,
		size/2, 
		(size/2)-bevelThickness, 
		0, 
		2*Math.PI);
		
	ctx.stroke();
}

function drawTics(i, dNeedle){
	// To fix the annoying Floating point issue
	i = parseFloat((i).toFixed(3));
	// Convert the value to an angle for this needle.
	var ang = dNeedle.angle(i);

	if (Math.abs(i%dNeedle.options.largeTic)>0) {
		// Small Tic 
		if (dNeedle.options.smallTicColour != "none")
			arcIt(dNeedle.ctx, dNeedle.midP, dNeedle.midP,
				ang,
				ang + 1,
				dNeedle.options.smallTicColour,
				dNeedle.options.smallTicColour, 
				dNeedle.midP - dNeedle.options.margin, 
				dNeedle.midP - dNeedle.options.margin - dNeedle.options.smallTicSize);
	}
	else {
		// Large tic 
		if (dNeedle.options.largeTicColour != "none")
			arcIt(dNeedle.ctx, dNeedle.midP,dNeedle.midP,
				ang,
				ang + 1,
				dNeedle.options.largeTicColour,
				dNeedle.options.largeTicColour, 
				dNeedle.midP - dNeedle.options.margin, 
				dNeedle.midP - dNeedle.options.margin - dNeedle.options.largeTicSize);
	}
	
	//Text
	if (Math.abs(i%dNeedle.options.textTic)==0) {
		dNeedle.ctx.font = dNeedle.options.fontSize + "px " + dNeedle.options.fontName;
		dNeedle.ctx.textAlign = "center";
		dNeedle.ctx.textBaseline = 'middle';
		dNeedle.ctx.fillStyle = dNeedle.options.textColour;
		
		dNeedle.ctx.translate(
			(dNeedle.midP + Math.cos(ang*Math.PI/180) 
				* (dNeedle.midP - dNeedle.options.fontGap - dNeedle.options.margin)), 
			(dNeedle.midP + Math.sin(ang*Math.PI/180) 
				* (dNeedle.midP - dNeedle.options.fontGap - dNeedle.options.margin)));
		
		var rot = 0;
		
		if (dNeedle.options.textDir == "Tangent") {
			if (ang%360 > 0 && ang%360<180)
				rot = (ang+270)*Math.PI/180;
			else
				rot = (ang+90)*Math.PI/180;
		}
		
		if (dNeedle.options.textDir == "Normal") {
			if (ang%360 > 90 && ang%360<270)
				rot = (ang+180)*Math.PI/180;
			else
				rot = (ang+360)*Math.PI/180;
		}
		
		dNeedle.ctx.rotate(rot);
		dNeedle.ctx.fillText(i,0,0);
		dNeedle.ctx.rotate(-rot);
		dNeedle.ctx.translate(
			-(dNeedle.midP + Math.cos((ang)*Math.PI/180)
				* (dNeedle.midP - dNeedle.options.fontGap - dNeedle.options.margin)), 
			-(dNeedle.midP + Math.sin((ang)*Math.PI/180)
				* (dNeedle.midP - dNeedle.options.fontGap - dNeedle.options.margin)));
	}
}

function colourBar(minA, maxA, minCol, maxCol, width){
	this.minA = minA;
	this.maxA = maxA;
	this.minCol = minCol;
	this.maxCol = maxCol;
	this.width = width;
}

function arcIt(ctx, x,y,start,end,col1, col2, outerR, innerR){
	let colorStops = [];
	colorStops.push({ offset: 0, color: col1});
	colorStops.push({ offset: 1, color: col2});        
	ctx.fillArcGradient(x,y, start, end, colorStops, outerR,innerR, { useDegrees: true });
}

function dNeedle(dDial, options){

	this.options = Object.assign({	
		name : "",
		minV : 0, 
		maxV : 50,
		minA : 30, 
		maxA : 330, 
		smallTic : 1, 
		smallTicColour: "#BBB",
		smallTicSize : 15,
		largeTic : 5, 
		largeTicColour: "#FFF",
		largeTicSize : 30,
		textTic : undefined, 
		textDir : "Horizontal",
		textColour : "#CCC",
		clockwise : true, 
		colourBars : null,
		needlePath : "images/needle0.png",
		margin : 20,
		fontSize : 20, 
		fontName : "Arial",
		fontGap : 45,		
		foreUpdateID:null,
		lastMaxValue : null,
		maxValueCol : "#FAA",
		showMaxMin : false,
		lastMinValue : null,
		minValueCol : "#666",
		minMaxRadius : 75,
		minMaxWidth : 20,
		maxMinBar : null}, options);
		
	if ( this.options.textTic == undefined ) this.options.textTic = this.options.largeTic;
	
	this.dDial = dDial;
	
	// Adjust for user friendlyness
	this.options.minA += 90;
	this.options.maxA += 90;
	
	if ( this.options.needlePath != "none" ){
		var needleImg = document.createElement("img");
		needleImg.className = "dialNeedle";
		needleImg.src = this.options.needlePath;
	
		this.dDial.element.appendChild(needleImg);
		var midP = this.dDial.options.size/2;
		needleImg.style.top = midP - 46 + "px";
		needleImg.style.left = midP -260 + "px";
		needleImg.style.transform += "scale("+this.dDial.options.size/600+")";
		
		this.needleImage = needleImg;
		this.setMin();
	}
	
	if (this.options.lastMaxValue == null)
		this.options.lastMaxValue = this.options.minV;
	if (this.options.lastMinValue == null)
		this.options.lastMinValue = this.options.minV;

	if (this.options.showMaxMin) {
		// Wire up reset click button
		this.dDial.element.myParam = this;
		this.dDial.element.setAttribute("title", "Click to reset min/max settings");
		this.dDial.element.addEventListener("click", function(evn) 
		{
			ele = evn.target.parentElement.myParam;
			ele.resetMaxMin();
		}
		, false);					
	}
	
	// Save defaults for later
	this.midP = this.dDial.options.size/2;
	var canvas = document.getElementById('can_' + this.dDial.options.name);
	this.ctx = canvas.getContext('2d');
	
	this.draw();
	this.drawMaxMin();
}

dNeedle.prototype.drawMaxMin = function(){
	if (this.options.showMaxMin){
		if (this.options.lastMaxValue > this.options.lastMinValue){
			// We have a range to draw.
			arcIt(this.ctx, this.midP, this.midP, 
				this.angle(this.options.lastMinValue),
				this.angle(this.options.lastMaxValue),
				this.options.minValueCol,
				this.options.maxValueCol, 
				this.midP - this.options.margin - this.options.minMaxRadius, 
				this.midP - this.options.margin - this.options.minMaxRadius - this.options.minMaxWidth);
		}	
	}
}

dNeedle.prototype.resetMaxMin = function() {
	this.options.lastMaxValue = this.value;
	this.options.lastMinValue = this.value;
	this.reset();
	this.draw();
	this.drawMaxMin();
}

dNeedle.prototype.reset = function() {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	this.dDial.draw();	
	this.draw();
	this.drawMaxMin();
}
	
dNeedle.prototype.drawColourBars = function(colourBars){
	// Draw Colour Bars
	if (colourBars != null) {
		for (i = 0; i<colourBars.length; i++){
			arcIt(this.ctx, this.midP, this.midP, 
				colourBars[i].minA + 90,
				colourBars[i].maxA + 90,
				colourBars[i].minCol,
				colourBars[i].maxCol, 
				this.midP - this.options.margin, 
				this.midP - this.options.margin - this.options.colourBars[i].width);			
		}	
	}	
}

dNeedle.prototype.angle = function(value){
	var ang = 0;
	
	// Given a value for the needle, calculate the angles
	// for the needle, remembering if clockwise or not,
	
	if ( this.options.clockwise ){
		ang =  this.options.minA + (this.options.maxA - this.options.minA) 
			* (value-this.options.minV)/(this.options.maxV - this.options.minV);
	}
	else {
		ang =  this.options.maxA + (this.options.minA - this.options.maxA) 
			* (value-this.options.minV)/(this.options.maxV - this.options.minV);
	}
	
	return ang;
}

dNeedle.prototype.draw = function(){
	// Reset....
	//this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	
	// Colour Bars
	this.drawColourBars(this.options.colourBars);

	var stepA = (this.options.maxV-this.options.minV)/this.options.smallTic;
	
	this.ctx.fillStyle = this.dDial.options.foreColour;
	
	// Draw Tics and Numeric Text
	if ( this.options.clockwise ){
		for ( i = this.options.minV; i<= this.options.maxV; i += this.options.smallTic)
		{
			drawTics(i, this);
		}
	}
	else {
		for ( i = this.options.maxV; i>= this.options.minV; i -= this.options.smallTic)
		{
			drawTics(i, this);
		}
	}
}

dNeedle.prototype.setMax = function () {
	this.setValue(this.options.maxV);
}

dNeedle.prototype.setMin = function () {
	this.setValue(this.options.minV);
}

dNeedle.prototype.setValue = function (newValue){
	//Bounds Checking
	if (newValue < this.options.minV) this.value = this.options.minV
	else if (newValue > this.options.maxV) this.value = this.options.maxV
	else this.value = newValue;
 
 	var ang = this.angle(this.value)+ 180;
 	// Add 180 for fun - purely to assist the user in creating Dials
 	
	this.needleImage.style.transform = "rotate("+ang + "deg) scale("+this.dDial.options.size/600+")";    
	
	// Fore Dial check
	if ( this.options.foreUpdateID != null){
		document.getElementById(this.options.foreUpdateID).innerHTML = this.value.toFixed(1);
	}  

	// MinMax Checks
	if (this.options.showMaxMin){
		if (this.value > this.options.lastMaxValue )
		{
			this.options.lastMaxValue = this.value;
			this.drawMaxMin();
		}
		if (this.value < this.options.lastMinValue )
		{
			this.options.lastMinValue = this.value;
			this.drawMaxMin();
		}
	}	
}

/**
 * @description Options used when calling CanvasRenderingContext2D.strokeArcGradient() and 
 *              CanvasRenderingContext2D.fillArcGradient().
 * @property {Boolean} useDegrees Whether the specified angles should be interpreted as degrees rather than radians. 
 *                                (default: false)
 * @property {Number} resolutionFactor The number of lines to render per pixel along the arc.  A higher number produces 
 *                                     a cleaner gradient, but has worse performance for large radii.  Must be greater 
 *                                     than 0. (default: 8)
 */
class ArcGradientOptions {
    constructor(options) {
        function validateParam(test, errorMessage, fatal = false) {
            if (!test) {
                if (fatal) {
                    throw new Error(errorMessage);
                } else {
                    console.assert(false, errorMessage);
                }
            }
        }

        options = Object.assign({
            useDegrees: false,
            resolutionFactor: 8,
        }, options);

        validateParam(
            (options.resolutionFactor instanceof Number | typeof options.resolutionFactor === 'number') && 
                options.resolutionFactor > 0, 
            `ArcGradientOptions.resolutionFactor must be a Number greater than 0.  Given: ${options.resolutionFactor}`, 
            true);

        Object.assign(this, options);
    }
};

(function () {
    /**
     * @description Strokes an arc using a linear gradient.
     * @param {number} x The x-component of origin of the arc.
     * @param {number} y The y-component of the origin of the arc.
     * @param {number} radius The radius of the arc.
     * @param {number} startAngle Where in the circle to begin the stroke.
     * @param {number} endAngle Where in the circle to end the stroke.
     * @param {ArcGradientOptions} options Additional options.
     */
    CanvasRenderingContext2D.prototype.strokeArcGradient = function (x, y, radius, startAngle, endAngle, colorStops, 
            options) {
        options = new ArcGradientOptions(options);
        let lineWidth = this.lineWidth;
        this.fillArcGradient(x, y, startAngle, endAngle, colorStops, radius + lineWidth / 2, radius - lineWidth / 2, 
            options);
    }

    /**
     * @description Fills a sector or a portion of a ring with a linear gradient.
     * @param {number} x The x-component of origin of the arc
     * @param {number} y The y-component of the origin of the arc
     * @param {number} startAngle Where in the circle to begin the fill.
     * @param {number} endAngle Where in the circle to end the fill.
     * @param {number} outerRadius The radius of the arc.
     * @param {number} innerRadius The radius of the arc that won't be filled.  An innerRadius = 0 will fill the whole 
     *                             arc. (default: 0)
     * @param {ArcGradientOptions} options Additional options.
     */
    CanvasRenderingContext2D.prototype.fillArcGradient = function (x, y, startAngle, endAngle, colorStops, outerRadius, 
            innerRadius = 0, options) {
        options = new ArcGradientOptions(options);

        let oldLineWidth = this.lineWidth,
            oldStrokeStyle = this.strokeStyle;

        if (options.useDegrees) {
            startAngle = startAngle * Math.PI / 180;
            endAngle = endAngle * Math.PI / 180;
        }

        let deltaArcAngle = endAngle - startAngle;
            gradientWidth = Math.floor(outerRadius * Math.abs(deltaArcAngle) * options.resolutionFactor),
            gData = generateGradientImgData(gradientWidth, colorStops).data;

        this.lineWidth = Math.min(4 / options.resolutionFactor, 1);

        for (let i = 0; i < gradientWidth; i++) {
            let gradi = i * 4,
                theta = startAngle + deltaArcAngle * i / gradientWidth;

            this.strokeStyle = `rgba(${gData[gradi]}, ${gData[gradi + 1]}, ${gData[gradi + 2]}, ${gData[gradi + 3]})`;

            this.beginPath();
            this.moveTo(x + Math.cos(theta) * innerRadius, y + Math.sin(theta) * innerRadius);
            this.lineTo(x + Math.cos(theta) * outerRadius, y + Math.sin(theta) * outerRadius);
            this.stroke();
            this.closePath();
        }

        this.lineWidth = oldLineWidth;
        this.strokeStyle = oldStrokeStyle;
    }

    function generateGradientImgData(width, colorStops) {
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', 1);
        let ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, width, 0);

        for (let i = 0; i < colorStops.length; i++) {
            gradient.addColorStop(colorStops[i].offset, colorStops[i].color);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, 1);
        return ctx.getImageData(0, 0, width, 1);
    }
})();
