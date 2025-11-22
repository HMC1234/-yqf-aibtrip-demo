/**
 * 移动端PWA测试检查脚本
 * 检查所有页面的移动端适配问题
 */

const fs = require('fs')
const path = require('path')

const pagesDir = path.join(__dirname, '../src/pages')
const issues = []

// 需要检查的问题类型
const checkPoints = {
  navigate: {
    pattern: /onClick.*navigate|navigate\(/g,
    description: '导航跳转逻辑',
  },
  mobile: {
    pattern: /@media.*max-width.*768/g,
    description: '移动端CSS适配',
  },
  button: {
    pattern: /min-height.*44|height.*44/g,
    description: '触摸友好按钮（44px最小高度）',
  },
  scroll: {
    pattern: /scroll.*x|overflow-x/g,
    description: '横向滚动支持',
  },
}

// 检查文件
function checkFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(pagesDir, filePath)
  
  // 检查导航跳转
  if (fileName.endsWith('.tsx') && !content.includes('useNavigate') && content.includes('navigate')) {
    issues.push({
      file: relativePath,
      type: '导航',
      issue: '可能缺少useNavigate导入',
    })
  }
  
  // 检查移动端适配
  if (fileName.endsWith('.css')) {
    if (!checkPoints.mobile.pattern.test(content)) {
      issues.push({
        file: relativePath,
        type: 'CSS',
        issue: '可能缺少移动端媒体查询（@media max-width: 768px）',
      })
    }
  }
}

// 递归检查目录
function checkDirectory(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      checkDirectory(filePath)
    } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
      checkFile(filePath, file)
    }
  })
}

// 执行检查
console.log('🔍 开始检查移动端适配问题...\n')
checkDirectory(pagesDir)

if (issues.length > 0) {
  console.log(`⚠️  发现 ${issues.length} 个潜在问题：\n`)
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.type}] ${issue.file}`)
    console.log(`   ${issue.issue}\n`)
  })
} else {
  console.log('✅ 未发现明显问题')
}

console.log('\n📝 请手动测试以下页面：')
console.log('1. 登录页面')
console.log('2. Dashboard首页')
console.log('3. 出差申请列表')
console.log('4. 出差申请详情')
console.log('5. AI预订页面')
console.log('6. 订单列表')
console.log('7. 订单详情')
console.log('8. 个人信息页面')

