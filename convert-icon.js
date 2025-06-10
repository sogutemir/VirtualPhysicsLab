const fs = require('fs');
const { execSync } = require('child_process');

// SVG dosyasını oku
const svgContent = fs.readFileSync('./assets/images/icon.svg', 'utf8');

// SVG'yi basit bir şekilde PNG canvas'a çeviren HTML sayfası oluştur
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; }
        canvas { border: none; }
    </style>
</head>
<body>
    <canvas id="canvas" width="1024" height="1024"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Gradient arka plan
        const backgroundGradient = ctx.createLinearGradient(0, 0, 1024, 1024);
        backgroundGradient.addColorStop(0, '#667eea');
        backgroundGradient.addColorStop(1, '#764ba2');
        
        // Arka plan çiz
        ctx.fillStyle = backgroundGradient;
        ctx.roundRect(0, 0, 1024, 1024, 180);
        ctx.fill();
        
        // Atom çiz
        const atomGradient = ctx.createLinearGradient(0, 0, 1024, 1024);
        atomGradient.addColorStop(0, '#f093fb');
        atomGradient.addColorStop(1, '#f5576c');
        
        // Ana çekirdek
        ctx.beginPath();
        ctx.arc(512, 512, 60, 0, 2 * Math.PI);
        ctx.fillStyle = atomGradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(512, 512, 40, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff6b6b';
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Elektronlar
        const electronGradient = ctx.createLinearGradient(0, 0, 1024, 1024);
        electronGradient.addColorStop(0, '#4facfe');
        electronGradient.addColorStop(1, '#00f2fe');
        
        // Elektronların yörüngeleri
        ctx.strokeStyle = electronGradient;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.7;
        
        // İlk yörünge
        ctx.save();
        ctx.translate(512, 512);
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 180, 120, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
        
        // İkinci yörünge
        ctx.save();
        ctx.translate(512, 512);
        ctx.rotate(-Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 180, 120, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
        
        // Üçüncü yörünge
        ctx.beginPath();
        ctx.ellipse(512, 512, 220, 80, 0, 0, 2 * Math.PI);
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Elektronları çiz
        ctx.fillStyle = electronGradient;
        ctx.beginPath();
        ctx.arc(692, 512, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(332, 512, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(612, 392, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(412, 632, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Fizik formülleri
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = 'italic 24px Arial';
        ctx.fillText('E=mc²', 150, 850);
        
        ctx.font = 'italic 20px Arial';
        ctx.fillText('F=ma', 800, 180);
        
        // Canvas'ı PNG olarak indir
        const link = document.createElement('a');
        link.download = 'icon.png';
        link.href = canvas.toDataURL();
        link.click();
    </script>
</body>
</html>
`;

// HTML dosyasını oluştur
fs.writeFileSync('./temp-icon-generator.html', htmlContent);

console.log('Ikon HTML dosyası oluşturuldu: temp-icon-generator.html');
console.log('Bu dosyayı tarayıcıda açın ve PNG otomatik olarak indirilecek.');
