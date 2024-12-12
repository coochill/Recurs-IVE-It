export function initMatrix(canvas) {
    const ctx = canvas.getContext("2d");
  
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Characters to simulate the rain
    const characters = "RECURSION ALGORITHM RECURS-IVE IT!";
    const charArray = characters.split("");
    const fontSize = 20;
    const columns = canvas.width / fontSize;
  
    // Y positions of the rain drops for each column
    const drops = Array(Math.floor(columns)).fill(0);
  
    function drawRain() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.font = `${fontSize}px monospace`;
  
      // Draw characters
      drops.forEach((y, index) => {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = index * fontSize;
  
        // Alternate between two colors for each character
        ctx.fillStyle = Math.random() > 0.5 ? "rgb(37, 150, 190)" : "rgba(52,94,170,255)"; // Blue or Green
  
        ctx.fillText(text, x, y * fontSize);
  
        // Reset or move drop
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        } else {
          drops[index]++;
        }
      });
    }
  
    // Refresh rain animation
    setInterval(drawRain, 50);
  
    // Adjust canvas size dynamically
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }