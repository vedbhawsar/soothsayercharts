const d3 = require("d3");

const XAXIS_LABEL_HEIGHT = 20;
const defaultOptions = {    
    data: [{name:'default',value:50}],
    height: 400,
    width: 400,
    color: "steelblue",
    tooltip:{
        format:"{{name}} = {{value}}"
    },
    xAxis:{
        name:"xAxis"
    },
    
    yAxis:{
        name:"yAxis"
    },
    backgroundColor:"#f4f4f4",
    barPadding: 1,
    animationDelay: 10,
    animationDuration: 500,
    margin : {
        top: 30,
        right: 10,
        bottom: 30,
        left: 40
    }
}

exports.barChart =  (options) => {    
    
    options = Object.assign(defaultOptions,options);
        
    options.barPadding = options.barPadding && +options.barPadding <= 5 ? options.barPadding/10 : 0.10 
    x = d3.scaleBand()
        .domain(d3.range(options.data.length))
        .range([options.margin.left, options.width - options.margin.right])
        .padding(options.barPadding);

    y = d3.scaleLinear()
        .domain([0, d3.max(options.data, d => d.value)]).nice()
        .range([options.height - options.margin.bottom - XAXIS_LABEL_HEIGHT, options.margin.top]);
        
    xAxis = g => g
            .attr("transform", `translate(0,${options.height - options.margin.bottom - XAXIS_LABEL_HEIGHT})`)
            .call(d3.axisBottom(x).tickFormat(i => options.data[i].name).tickSizeOuter(0))
            .call(g => g.append("text")
                .attr("x", (options.width/2 -options.margin.left))
                .attr("y", options.margin.bottom + XAXIS_LABEL_HEIGHT/2)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
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
            ele.selectAll('svg').remove();
    const svg = ele.append("svg").style("background",options.backgroundColor);
                svg.attr("background",options.backgroundColor)
                .attr("height",options.height)
                .attr("width",options.width)
                .attr("viewBox", [0, 0, options.width, options.height]);
    
    const svgChart = svg.append("g")
            .attr("fill", options.color)
            .selectAll("rect")
                .data(options.data)
                .enter().append("rect")
                    .attr("x", (d, i) => x(i))
                    .attr("y", options.height)
                    .attr("height",0)
                    .attr("width", x.bandwidth())                      

        svgChart.on("mouseover",function(event,d){
                if(options.tooltip){
                    tooltip.transition().style('opacity',1)                
                    let tooltipText = `${d.name} = ${d.value.toFixed(2)}`;
                    if(options.tooltip.format){
                        tooltipText = options.tooltip.format.replace("{{name}}",d.name).replace("{{value}}",d.value.toFixed(2))
                    }
                    tooltip.html(tooltipText)
                        .style('left',(event.pageX + 'px'))
                        .style('top',(event.pageY + 'px'))
                }
                //event.target.style.opacity = 0.7;
                d3.select(this).style('opacity','0.7');
            })      
            .on("mouseout",function(event,d){
                tooltip.transition().style('opacity',0)
                tooltip.html(`soothsayer charts`)
                    .style('left','-999px')
                    .style('top','-999px')
                event.target.style.opacity = 1;
            });
            
        
        svgChart.transition()            
            .attr('height',function(d){
                console.log('height',{d})
                return options.height-y(d.value)-options.margin.bottom - XAXIS_LABEL_HEIGHT
            })
            .attr('y',function(d){
                console.log('y',{d})
                return y(d.value)
            })
            .duration(options.animationDuration)
            .delay(function(d,i){
                return i*options.animationDelay
            })
            .ease(function(){return 'elastic'})

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);    

    return svg.node();
    
}