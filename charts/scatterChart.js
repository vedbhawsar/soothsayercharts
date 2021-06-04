const d3 = require("d3");
const XAXIS_LABEL_HEIGHT = 20;
const defaultOptions = {    
    data: [{name:'default',x:0.5, y:7}],
    height: 400,
    width: 400,    
    circleRadius: 5,
    color: "steelblue",
    tooltip:{
        format:"{{name}} = ({{x}},{{y}})"
    },
    xAxis:true,
    yAxis:true,
    backgroundColor:"#f4f4f4",
    barPadding: 1,
    animationDelay: 10,
    animationDuration: 500,
    margin:  {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
}

exports.scatterChart =  (options) => {        

    options = Object.assign(defaultOptions,options);
    options.barPadding = options.barPadding && +options.barPadding <= 5 ? options.barPadding/10 : 0.10 
    
    x = d3.scaleLinear()
        .domain([0, d3.max(options.data, d => d.x)]).nice()
        .range([options.margin.left, options.width - options.margin.right]);

    y = d3.scaleLinear()
        .domain([0, d3.max(options.data, d => d.y)]).nice()
        .range([options.height - options.margin.bottom - XAXIS_LABEL_HEIGHT, options.margin.top]);
        
    xAxis = g => g
            .attr("transform", `translate(0,${options.height - options.margin.bottom - XAXIS_LABEL_HEIGHT})`)
            .call(d3.axisBottom(x).ticks(null,''))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", (options.width/2 -options.margin.left))
                .attr("y", options.margin.bottom + XAXIS_LABEL_HEIGHT/2)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(options.xAxis.label).style('font-size','12px'));

    yAxis = g => g
            .attr("transform", `translate(${options.margin.left},0)`)
            .call(d3.axisLeft(y).ticks(10))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -options.height/2-options.margin.bottom)
                .attr("y", XAXIS_LABEL_HEIGHT/2 -options.margin.left)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")                
                .text(options.yAxis.label)
                .style("transform",`rotate(-90deg)`)
                .style('font-size','12px'));
    
    const tooltip = d3.select("body").append('div')
                .style('position','absolute')
                .style('background','#f4f4f4')
                .style('padding','5px 15px')
                .style('border','1px solid #333')
                .style('border-radius','5px')
                .style('opacity','0');

    const ele = d3.select(options.element)
    const svg = ele.append("svg").style("background",options.backgroundColor);
                svg.attr("background",options.backgroundColor)
                .attr("height",options.height)
                .attr("width",options.width)
                .attr("viewBox", [0, 0, options.width, options.height]);
    
        const dot = svg.append("g")
                .attr("fill", options.color)
                .selectAll("circle")
                    .data(options.data)
                    .enter().append("circle")
                        // .attr("cx", (d, i) => x(d.x))
                        // .attr("cy", (d,i) =>y(d.y))
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r",options.circleRadius)
                        

            dot.on("mouseover",function(event,d){
                if(options.tooltip){
                    tooltip.transition().style('opacity',1)                
                    let tooltipText = `${d.name} = (${d.x.toFixed(2)}, ${d.y.toFixed(2)})`;
                    if(options.tooltip.format){
                        tooltipText = options.tooltip.format.replace("{{name}}",d.name).replace("{{x}}",d.x.toFixed(2)).replace("{{y}}",d.y.toFixed(2))
                    }
                    tooltip.html(tooltipText)
                        .style('left',(event.pageX + 'px'))
                        .style('top',(event.pageY + 'px'))
                }
                //event.target.style.opacity = 0.7;
                d3.select(this).style('opacity','0.5');
            })      
            .on("mouseout",function(event,d){
                tooltip.transition().style('opacity',0)
                tooltip.html(`soothsayer charts`)
                    .style('left','-999px')
                    .style('top','-999px')
                event.target.style.opacity = 1;
            });
            
        
        dot.transition()            
            .attr('cx',(d, i) => x(d.x))
            .attr('cy',(d, i) => y(d.y))
            .duration(options.animationDuration)
            .delay(function(d,i){
                return i*options.animationDelay
            })
            .ease(function(){return 'elastic'})

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
    
    //   return svg.node();
}