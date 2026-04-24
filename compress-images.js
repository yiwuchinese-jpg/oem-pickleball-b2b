const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 尝试加载 sharp，如果没安装自动安装
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('正在为您安装图像压缩引擎 (sharp)... 请稍等...');
  execSync('npm install sharp --no-save', { stdio: 'inherit' });
  sharp = require('sharp');
}

// 获取要压缩的文件夹路径，默认为 public，也可以通过命令行参数传入
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'public');
const outputDir = path.join(targetDir, 'compressed');

if (!fs.existsSync(targetDir)) {
  console.error(`❌ 找不到文件夹: ${targetDir}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const MAX_WIDTH = 1200; // 最大宽度限制
const QUALITY = 80;     // 压缩质量 (0-100)

async function compressImages() {
  console.log(`\n🚀 开始扫描文件夹: ${targetDir}`);
  const files = fs.readdirSync(targetDir);
  
  let count = 0;
  for (const file of files) {
    if (file.match(/\.(png|jpe?g|webp)$/i)) {
      const inputPath = path.join(targetDir, file);
      
      // 我们把所有图片统一压成更小的 webp 格式或者强力压缩的 jpg
      const ext = path.extname(file).toLowerCase();
      // 如果原图是 png，为了极致压缩我们将其转为 jpg
      const isPng = ext === '.png';
      const outputFilename = isPng ? file.replace(/\.png$/i, '.jpg') : file;
      const outputPath = path.join(outputDir, outputFilename);
      
      try {
        const stats = fs.statSync(inputPath);
        const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        let sharpInstance = sharp(inputPath).resize({ width: MAX_WIDTH, withoutEnlargement: true });
        
        if (isPng || ext === '.jpg' || ext === '.jpeg') {
            sharpInstance = sharpInstance.jpeg({ quality: QUALITY, progressive: true, force: true });
        } else if (ext === '.webp') {
            sharpInstance = sharpInstance.webp({ quality: QUALITY });
        }

        await sharpInstance.toFile(outputPath);
        
        const newStats = fs.statSync(outputPath);
        const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
        
        console.log(`✅ [${originalSizeMB} MB -> ${newSizeMB} MB] 压缩成功: ${outputFilename}`);
        count++;
      } catch (err) {
        console.error(`❌ 压缩失败: ${file}`, err.message);
      }
    }
  }
  
  console.log(`\n🎉 压缩完毕！共处理了 ${count} 张图片。`);
  console.log(`📂 压缩后的图片保存在这里: ${outputDir}`);
  console.log(`👉 接下来您可以在 Evolution 301 里选择这个 compressed 文件夹里的图片进行上传。`);
}

compressImages();
