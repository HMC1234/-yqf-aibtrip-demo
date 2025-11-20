# 🚀 腾讯云部署说明

**项目名称**：YQFAIBTRIP 一起飞智能商旅系统 - DEMO  
**GitHub仓库**：https://github.com/HMC1234/-yqf-aibtrip-demo  
**部署方式**：GitHub Actions + 腾讯云COS静态网站托管

---

## 📋 快速开始（5步完成）

### ✅ 第1步：创建腾讯云COS存储桶

1. 访问：https://console.cloud.tencent.com/cos
2. 创建存储桶，配置：
   - **名称**：`yqf-aibtrip-demo`（需全局唯一）
   - **地域**：`广州`（或离您最近的地域）
   - **访问权限**：**公有读私有写**（重要！）

3. 开启静态网站托管：
   - 存储桶 → "基础配置" → "静态网站"
   - 开启托管
   - **索引文档**：`index.html`
   - **错误文档**：`index.html`（SPA需要）

---

### ✅ 第2步：获取API密钥

1. 访问：https://console.cloud.tencent.com/cam/capi
2. 点击"新建密钥"
3. 保存 `SecretId` 和 `SecretKey`

**⚠️ 重要：请妥善保管密钥！**

---

### ✅ 第3步：配置GitHub Secrets

1. 访问：https://github.com/HMC1234/-yqf-aibtrip-demo/settings/secrets/actions
2. 点击"New repository secret"
3. 添加以下Secrets：

| Name | Value | 说明 |
|------|-------|------|
| `TENCENT_SECRET_ID` | 您的SecretId | 必需 |
| `TENCENT_SECRET_KEY` | 您的SecretKey | 必需 |
| `TENCENT_BUCKET` | 您的存储桶名称 | 可选（默认：yqf-aibtrip-demo） |
| `TENCENT_REGION` | 您的地域 | 可选（默认：ap-guangzhou） |
| `TENCENT_CDN_DOMAIN` | 您的CDN域名 | 可选（如果配置了CDN） |

---

### ✅ 第4步：提交工作流文件

工作流文件已创建：`.github/workflows/deploy-tencent.yml`

```bash
git add .github/workflows/
git commit -m "feat: 添加腾讯云COS自动部署工作流"
git push origin main
```

---

### ✅ 第5步：等待自动部署

1. 查看部署状态：
   - https://github.com/HMC1234/-yqf-aibtrip-demo/actions

2. 部署成功后访问：
   ```
   https://<您的存储桶名称>.cos-website.<您的地域>.myqcloud.com
   ```
   
   示例：
   ```
   https://yqf-aibtrip-demo.cos-website.ap-guangzhou.myqcloud.com
   ```

---

## 🎯 完成！

部署完成后，每次推送到`main`分支都会自动部署到腾讯云！

---

## 📚 详细文档

- **详细部署指南**：查看 `腾讯云部署指南.md`
- **快速步骤**：查看 `腾讯云部署快速步骤.md`

---

## ❓ 常见问题

### 1. 部署失败：认证失败

**解决**：检查GitHub Secrets中的SecretId和SecretKey是否正确

### 2. 网站无法访问

**解决**：
- 确保存储桶权限为"公有读私有写"
- 确保静态网站托管已开启

### 3. 路由404错误

**解决**：确保错误文档设置为`index.html`

---

## 📞 支持

- **腾讯云COS文档**：https://cloud.tencent.com/document/product/436
- **GitHub Actions文档**：https://docs.github.com/en/actions

