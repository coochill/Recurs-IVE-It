import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './styles.css';

const RecursionTree = ({ data, algorithmName, onPlay, onPause, isPlaying }) => {
  const [playing, setPlaying] = useState(isPlaying);
  const svgRef = useRef(null);
  const animationStateRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 


    const width = 200; 
    const fixedHeight = 600; 

    svg
      .attr("width", "100%")
      .attr("height", "900px")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0)
      .style("overflow", "auto");

    // Append marker definitions for arrows
    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 5, 0 10")
      .attr("fill", "black");

    // Create a group for the tree
    const treeGroup = svg.append("g").attr("transform", "translate(50, 50)");

    const treeLayout =
      algorithmName === "factorial"
        ? d3.tree().nodeSize([0, 100]) 
        : d3.tree().size([width - 200, fixedHeight - 150]); 


    const root = d3.hierarchy(data);
    treeLayout(root);

    // Positioning nodes dynamically for factorial
    if (algorithmName === "factorial" || algorithmName === "catalan") {
      const totalNodes = root.descendants().length;

      const horizontalSpacing = Math.min(700 / (totalNodes + 1), 150); 
      const verticalSpacing = Math.min(900 / root.height, 60); 

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 3;

      root.each((d) => {
        d.x = centerX - d.depth * horizontalSpacing; 
        d.y = centerY + (d.depth - root.height / 3) * verticalSpacing;
      });
    }


    const linkSelection = treeGroup
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const nodeRadius = 20; 
        const arrowOffset = 5; 


        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const offsetX = (dx / distance) * (nodeRadius + arrowOffset);
        const offsetY = (dy / distance) * (nodeRadius + arrowOffset);


        const startX = d.source.x;
        const startY = d.source.y;
        const endX = d.target.x - offsetX;
        const endY = d.target.y - offsetY;


        return `M${startX},${startY} L${endX},${endY}`;
      })
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)")
      .attr("opacity", 0);

    const filter = defs
      .append("filter")
      .attr("id", "innerNeumorphic")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");


    filter
      .append("feComponentTransfer")
      .append("feFuncA")
      .attr("type", "table")
      .attr("tableValues", "1 1"); 


    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2)
      .attr("result", "blur");


    filter
      .append("feOffset")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("result", "offsetBlur");


    filter
      .append("feComposite")
      .attr("in2", "SourceAlpha")
      .attr("operator", "arithmetic")
      .attr("k2", -1)
      .attr("k3", 1)
      .attr("result", "innerShadow");


    filter
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["innerShadow", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);

    // Draw nodes
    const nodeSelection = treeGroup
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .style("opacity", 0); 

    nodeSelection
      .append("circle")
      .attr("r", (d) => {
        if (algorithmName === "fibonacci" && d.data.n <= 8 && d.data.n >= 0) {
          return Math.max(10, 20 - d.depth * 2); 
        }
        return 20; 
      })
      .attr("fill", (d) => d.data.color || "#E0E0E0") 
      .attr("stroke", "none")
       .attr("stroke", "black")
      .style("filter", "url(#innerNeumorphic)");

    nodeSelection
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data.n)
      .style("font-size", "12px");

    nodeSelection
      .append("text")
      .attr("dy", "3em")
      .attr("text-anchor", "middle")
      .text((d) => (d.data.return_value !== undefined ? d.data.return_value : ""))
      .style("fill", "#C62E2E") 
      .style("opacity", 0);


   
      const animateNode = async (node) => {
        try {
          const nodeSelection = d3.select(node.nodeElement);
 
          if (node.parent && !node.linkElement.hasAnimated) {
            const linkSelection = d3.select(node.linkElement);
            const pathLength = linkSelection.node().getTotalLength();
            await linkSelection
              .transition()
              .duration(1200)
              .attr("opacity", 1)
              .attr("stroke", "orange")
              .attr("stroke-dasharray", pathLength)
              .attr("stroke-dashoffset", 0)
              .end();
            node.linkElement.hasAnimated = true; 
          }
 
          await nodeSelection
            .transition()
            .duration(1200)
            .style("opacity", 1)
            .select("circle")
            .transition()
            .duration(800)
            .attr("stroke", "black");
 
          if (node.data.is_initial) {
            await nodeSelection
              .select("circle")
              .transition()
              .duration(1800)
              .attr("fill", "#825B32");
          } else if (node.data.type === "base_case") {
            await nodeSelection
              .select("circle")
              .transition()
              .duration(1800)
              .attr("fill", "#6EC207");
          } else {
            await nodeSelection
              .select("circle")
              .transition()
              .duration(1800)
              .attr("fill", "white");
          }

          for (let child of node.children || []) {
            await animateNode(child);
          }
 
          if (node.data.return_value !== undefined) {
            const returnValueText = nodeSelection.select("text:nth-of-type(2)");
            await returnValueText
              .transition()
              .duration(100)
              .style("opacity", 1);
          }

          if (node.parent) {
            const linkSelection = d3.select(node.linkElement);
            await linkSelection
              .transition()
              .duration(2000)
              .attr("stroke", "black")
              .end();
          }
 
          if (node.data.type === "repeat" && node.data.return_value !== undefined) {
            await nodeSelection
              .select("circle")
              .transition()
              .duration(500)
              .attr("fill", "#0D92F4");
          }
        } catch (error) {
          console.error("Error in animateNode:", error);
        }
      };
 
      root.descendants().forEach((d) => {
        d.nodeElement = treeGroup.selectAll(".node").filter((n) => n === d).node();
        if (d.parent) {
          d.linkElement = treeGroup.selectAll(".link").filter((l) => l.target === d).node();
        }
      });
 
      if (isPlaying) {
        (async () => {
          try {
            for (let i = 0; i < root.descendants().length; i++) {
              const node = root.descendants()[i];
              await animateNode(node);
            }
          } catch (error) {
            console.error("Error starting animation:", error);
          }
        })();
      }
 
      return () => {

        if (animationStateRef.current) {

        }
      };
    }, [data, algorithmName, isPlaying]);
 
    useEffect(() => {
      if (isPlaying) {
        setPlaying(true);
        onPlay?.();
      } else {
        onPause?.();
      }
    }, [isPlaying, onPlay, onPause]);
 
    return (
      <div>
        <svg ref={svgRef}></svg>
      </div>
    );
  };
 
  export default RecursionTree;