
	visualizeCandidat("sarkozy");
	visualizeCandidat("hollande");
	visualizeCandidat("bayrou");
	visualizeCandidat("lepen");

	
function visualizeCandidat(candidat){
	
	var width = 350,
		height = 350,
		panel = d3.select("body").append("svg:svg")
					.attr("width", width)
					.attr("height", height),
		canvas = document.createElement('canvas').getContext('2d'),	
			dim = 128,
	     colorHash = {};

	 function avgCol(x, y, z, w) {
	    return [
	      (x[0] + y[0] + z[0] + w[0]) / 4,
	      (x[1] + y[1] + z[1] + w[1]) / 4,
	      (x[2] + y[2] + z[2] + w[2]) / 4
	    ];
	  }
	  var hrefSplit = window.location.href.split("?", 2);
	  var domian = hrefSplit[0];
	  var file = hrefSplit[1];
	  file = 'assets/'+ candidat +'.png';
	  var img = new Image();
	  img.onload = function() { loadImage(this); };
	  img.src = file;
	
	
function loadImage(imageData) {
	    try {
	      canvas.drawImage(imageData, 0, 0, dim, dim);
	      data = canvas.getImageData(0, 0, dim, dim).data;
	    } catch(e) {
	      alert("Failed to load image.");
	      return;
	    }
	    var depth = Math.round(Math.log(dim) / Math.log(2));
	    colorHash = {};
	    var t = 0;
	    for (y = 0; y < dim; y++) {
	      for (x = 0; x < dim; x++) {
	        var col = [data[t], data[t+1], data[t+2]];
	        colorHash['c' + [x,y,depth].join('_')] = col;
	        t += 4;
	      }
	    }

	    level = dim;
	    do {
	      level /= 2;
	      depth--;
	      for (y = 0; y < level; y++) {
	        for (x = 0; x < level; x++) {
	          colorHash['c' + [x,y,depth].join('_')] = avgCol(
	            colorHash['c' + [2*x  ,2*y  ,depth+1].join('_')],
	            colorHash['c' + [2*x+1,2*y  ,depth+1].join('_')],
	            colorHash['c' + [2*x  ,2*y+1,depth+1].join('_')],
	            colorHash['c' + [2*x+1,2*y+1,depth+1].join('_')]
	          );
	        }
	      }
	    } 
	while(level > 1);
	
	vizualize(candidat);
}
	

function vizualize(_candidat){

	d3.json("/home/get_all_tweets/"+ _candidat +".json", function(json) {
	var mestweets = json;
	panel.selectAll("circle")
		.data(mestweets)
	.enter().append("svg:circle")
		.attr("cx", function(d, i) {return 10 + (i%128)*3;})
		.attr("cy", function(d, i) { return 10 + Math.floor(i/128)*3 ;})
		.attr("class", function(d, i) {return 'c'+(i%dim)+"_"+Math.floor(i/dim)+"_"+"7";})
		.attr("r", 1)
		.attr('fill', function(d, i) { return'rgb(' + colorHash['c'+(i%dim)+"_"+Math.floor(i/dim)+"_"+"7"].map(Math.round).join(',') + ')'

		;})
		
	});

	return loadImage;
};

};