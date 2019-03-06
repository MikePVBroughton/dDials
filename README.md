# dDials
A Dials framework which allows simple customisation of colours and ranges etc.

These dials are free to use, butcher and report bugs on. They are designed primerily for boat dials - but feel free to use them in any way you want.

The are a multitude of dials shown in the example file, Dials.html in the src folder.

For a dial we have the following options;

<pre>
var myDial = new dDial( { 
  element            : "dialHTML",    _(mandatory)_ Where to render
  name               : "Small",       _(mandatory)_ Title for dial - MUST be unique on page
  size               : 400            _(default)_ Size in pixels
  backImage          : null,          _(default)_ Optional backimage 
  foreDial           : false,         _(default)_ Should the fore dial be shown
  foreImage          : null,          _(default)_ Image for fore dial
  foreSize           : 130,           _(default)_ What size should the fore dial be 
  foreBackColour     : "#222",        _(default)_ Not implemented yet
  foreHTML           : null,          _(default)_ Pure HTML to be rendered in the dial
  foreBevelThickness : 2,             _(default)_ The thickness of the bevel on the fore dial
  backColour         : "#111",        _(default)_ Backcolour if no image
  bevelThickness     : 5,             _(default)_ The thickness of the bevel on the mail dial 
  bevelColour1       : "#c0c0c0",     _(default)_ One of the bevel colours (gradient)
  bevelColour2       : "#f0f0f0"      _(default)_ Another colour doe the bevel (gradient) 
});
</pre>

And for the needle we have the following (all angles measured from bottom centre clockwise);

var myNeedle = new dNeedle(  
  myDial, _(Mandatory)_ Handle to dial to put the needle on
  {
  name               : "Fuel",        _(mandatory)_ Name of needle, unique to dial.
  minV               : 0,             _(default)_ Minimum value
  maxV               : 50,            _(default)_ Maximum value
  minA               : 30,            _(default)_ Angle (deg) from bottom center clockwise 
  maxA               : 330,           _(default)_ As above
  smallTic           : 1,             _(default)_ Draw a small tic mark every '1' value.
  smallTicColour     : "#BBB",        _(default)_ RGB or 'none' for no tic
  smallTicSize       : 15,            _(default)_ In pixels
  largeTic           : 5,             _(default)_ Draw a large tic mark every '5' values.
  largeTicColour     : "#FFF",        _(default)_ RGB or 'none' for no tic
  largeTicSize       : 30,            _(default)_ In pixels
  textTic            : 5,             _(default)_ Draw a text numeric every '5' values.
  textColour         : "#CCC",        _(default)_ RGB
  textDir            : "Horizontal",  _(default)_ "Tangent" or "Normal" are other options.
  clockwise          : true,          _(default)_ Which was do the numbers go.
  colourBars         : null,          _(default)_ See below.
  needlePath         : "needle0.png", _(default)_ Path to image to use. 'none' means no needle, 
                                                only scale drawn.
  margin             : 20,            _(default)_ Gap between dial edge and tics being drawn
  fontSize           : 20,            _(default)_ Font size to use on dial.
  fontName           : "Arial",       _(default)_ Font to use.
  fontGap            : 45,            _(default)_ Distance from tic to font on dial.
  foreUpdateID       : null           _(default)_ Will attempt to update the text of this field
                                                to the VALUE of the needle.
  showMaxMin         : false,         _(default)_ Show th	e min max indicators
  lastMinValue       : null,          _(default)_ What is/was the last min - can be used to set it.
  lastMaxValue       : null,          _(default)_ What is/was the last max - can be used to set it. 
  minValueCol        : "#666",        _(default)_ The colour gradient for the minimum
  maxValueCol        : "#FAA",        _(default)_ The colour gradient for the maximum
  minMaxRadius       : 75,            _(default)_ The offset from the dial outer edge to draw from
  minMaxWidth        : 20             _(default)_ The width of the line to draw
  });

ColourBars is an array which allows you to draw the gradients or solid colours around the edge of the needle dial. Simple specify as below and pass the array into the needle when creating it.

var portstarBar =
  [
   {minA: 30, maxA: 180, minCol: "#f00", maxCol: "#000", width: 10},
   {minA: 180, maxA: 330, minCol: "#000", maxCol: "#0f0", width: 10}
  ];

  minA   - The angle to start drawing from
  maxA   - The angle to stop drawing
  minCol - The colour to start from
  maxCol - The colour to end on (can be the same as minCol for solid
  width  - How thick should this bar be.  Note if negative then the bar
           is drawn outside of the dial Tics, See multi example above.
