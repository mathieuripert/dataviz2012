var data;
var colorHash = {};
var tweets;
var pixels = [];
	dim =64;
	espace = 5;
	var width = 960,
		height = 785,
		panel = d3.select("#viz").append("svg:svg")
					.attr("width", width)
					.attr("height", height);
					
					
	d3.json("/home/get_all_counts.json", function(json) {
	 tweets = json;
	 
	var canvas = document.createElement('canvas').getContext('2d');
	var hrefSplit = window.location.href.split("?", 2);
	var file = hrefSplit[1];
	
	name = tweets[0].name.substring(1,tweets[0].name.length);
	file = '/assets/'+name+'.png';
	var img = new Image();
	img.onload = function() { loadImage(this,0); };
	img.src = file;
	 
	 
	
	 
	  function loadImage(imageData,c) {
	    try {
		  
	      canvas.drawImage(imageData, 0, 0, dim, dim);
	      data = canvas.getImageData(0, 0, dim, dim).data;
	    } catch(e) {
	      alert("Failed to load image.");
	      return;
	    }
		
	    var t = 0;
	    for (y = Math.floor(c/3)*(dim+espace); y < Math.floor(c/3)*(dim+espace) + dim; y++) {
	      for (x = (c%3)*(dim+espace); x < (c%3)*(dim+espace) + dim; x++) {
	        var col = [data[t], data[t+1], data[t+2]];
	        colorHash['c' + [x,y].join('_')] = col;
	        t += 4;
	      }
	    }
		
	

			if(c < tweets.length-1)
			{
					name = tweets[c+1].name.substring(1,tweets[c+1].name.length);
					file = 'assets/'+name+'.png';
					var img = new Image();
					img.onload = function() { loadImage(this,c+1); };
					img.src = file;
			}
			else
			{
				
				viz();
			}
	    
	}
	});

	
	

function viz(){
		candidats_count = tweets.length;
		tweets.sort(function(a,b){
			return a.count > b.count;
		})
		
	for(i=0; i<= tweets[0].count; i=i+1){
		for(k=0; k< candidats_count; k=k+1)
			{
			pixels.push({x:i%dim+(k%3)*(dim+espace),y:Math.floor(i/dim)+(dim+espace)*Math.floor(k/3)});
			}
		}
		
    for (j=1; j < candidats_count; j=j+1){
		for(i=tweets[j-1].count; i<= Math.min(tweets[j].count,(candidats_count-1)*dim*dim); i=i+1){
			for(k=0; k< candidats_count -j; k=k+1)
			{
				pixels.push({x:i%dim+(k%3)*(dim+espace),y:Math.floor(i/dim)+(dim+espace)*Math.floor(k/3)});
			}
		}
	}
	panel.selectAll("circle")
		.data(pixels)
	.enter().append("svg:circle")
		.attr("cx", function(d) {return  5*d.x;})
		.attr("cy", function(d) { return 5*d.y;})
		.attr("class", function(d) {return 'c'+(d.x)+"_"+Math.floor(d.y);})
		.attr('fill', function(d, i) { return'rgb(' + colorHash['c'+(d.x)+"_"+Math.floor(d.y)].map(Math.round).join(',') + ')';})
		.attr("r", 2)
		.on("mouseover", function(){d3.select(this).style("stroke-width", 1).style("stroke", "red").attr("r",4);})
		.on("click", function(){
		  ;						
		}) 
        .on("mouseout", function() {d3.select(this).style("stroke-width", 0.000001).attr("r",2)});
	
};