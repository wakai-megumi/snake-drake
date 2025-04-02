const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes needed
const sizes = [16, 32, 48, 128];

// Ensure icons directory exists
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Generate icons for each size
sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, size, size);

    // Draw snake body (simplified snake shape)
    ctx.fillStyle = '#27ae60';
    
    // Calculate snake segment size
    const segmentSize = Math.max(Math.floor(size / 4), 1);
    const padding = Math.floor(segmentSize / 2);
    
    // Draw snake segments
    const segments = [
        { x: size/2, y: size/2 }, // head
        { x: size/2 - segmentSize, y: size/2 },
        { x: size/2 - segmentSize*2, y: size/2 },
        { x: size/2 - segmentSize*2, y: size/2 + segmentSize },
        { x: size/2 - segmentSize*2, y: size/2 + segmentSize*2 }
    ];

    segments.forEach((segment, index) => {
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, segmentSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add eye to the head
        if (index === 0 && size >= 32) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(segment.x + segmentSize/4, segment.y - segmentSize/4, segmentSize/4, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Save the icon
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
    console.log(`Generated ${size}x${size} icon`);
});

console.log('All icons generated successfully!');
