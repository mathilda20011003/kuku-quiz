# AWS S3 完整配置指南

## 重要说明

AWS S3 有两个独立的配置需要设置：
1. **Bucket Policy（存储桶策略）** - 控制谁可以访问你的文件
2. **CORS Configuration（跨域配置）** - 控制浏览器如何访问你的文件

**两者都需要配置，互不影响！**

---

## 配置 1：Bucket Policy（存储桶策略）- 已有，保持不变

### 当前配置（正确，不要修改）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kuku-quiz/*"
    }
  ]
}
```

### 作用
- 允许任何人读取（GET）你存储桶中的所有文件
- 这样你的图片、素材等可以被公开访问
- **保持这个配置不变！**

### 在哪里查看/编辑
1. AWS 控制台 → S3 → kuku-quiz 存储桶
2. **Permissions** 标签
3. **Bucket policy** 部分

---

## 配置 2：CORS Configuration（跨域配置）- 需要添加

### 需要添加的配置

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

### 作用
- 允许浏览器从任何网站跨域访问你的图片
- 让 html2canvas 可以截取包含 S3 图片的内容
- 不影响你的素材图展示，只是让浏览器允许跨域访问

### 在哪里添加
1. AWS 控制台 → S3 → kuku-quiz 存储桶
2. **Permissions** 标签
3. 滚动到 **Cross-origin resource sharing (CORS)** 部分
4. 点击 **Edit** 按钮
5. 粘贴上面的 JSON 配置
6. 点击 **Save changes**

---

## 完整配置步骤（图文说明）

### 步骤 1：检查 Bucket Policy（不需要修改）

```
AWS Console → S3 → kuku-quiz
  ↓
Permissions 标签
  ↓
Bucket policy 部分
  ↓
确认有你原来的配置（PublicRead）
  ↓
✅ 不需要修改，保持原样
```

### 步骤 2：添加 CORS Configuration（需要添加）

```
AWS Console → S3 → kuku-quiz
  ↓
Permissions 标签
  ↓
Cross-origin resource sharing (CORS) 部分
  ↓
点击 Edit 按钮
  ↓
粘贴 CORS 配置 JSON
  ↓
点击 Save changes
  ↓
✅ 完成！
```

---

## 配置后的效果

### ✅ 保持不变的功能
- 所有素材图正常展示
- 网站正常访问图片
- 公开访问权限不变

### ✅ 新增的功能
- 浏览器允许跨域访问图片
- html2canvas 可以截取图片
- 下载/分享功能正常工作

---

## 两个配置的区别

| 配置项 | Bucket Policy | CORS Configuration |
|--------|---------------|-------------------|
| **位置** | Permissions → Bucket policy | Permissions → CORS |
| **作用** | 控制谁可以访问文件 | 控制浏览器如何访问文件 |
| **格式** | JSON（带 Version, Statement） | JSON 数组 |
| **你的状态** | ✅ 已配置（PublicRead） | ❌ 需要添加 |
| **是否修改** | ❌ 保持不变 | ✅ 需要添加新配置 |

---

## 使用 AWS CLI 配置（可选）

如果你更喜欢用命令行：

### 查看当前 Bucket Policy（不需要修改）
```bash
aws s3api get-bucket-policy --bucket kuku-quiz
```

### 添加 CORS Configuration
```bash
aws s3api put-bucket-cors --bucket kuku-quiz --cors-configuration file://AWS_S3_CORS_CONFIG.json
```

---

## 验证配置

### 1. 检查 Bucket Policy
```bash
aws s3api get-bucket-policy --bucket kuku-quiz
```
应该看到你原来的 PublicRead 配置。

### 2. 检查 CORS Configuration
```bash
aws s3api get-bucket-cors --bucket kuku-quiz
```
应该看到新添加的 CORS 配置。

### 3. 测试网站
1. 刷新网页
2. 完成测验到达结果页
3. 点击下载按钮
4. 应该可以成功下载图片

---

## 常见问题

### Q: 添加 CORS 会影响我的素材图展示吗？
**A:** 不会！CORS 只是告诉浏览器"允许跨域访问"，不影响正常的图片展示。

### Q: 我需要修改原来的 Bucket Policy 吗？
**A:** 不需要！保持原样即可。Bucket Policy 和 CORS 是独立的配置。

### Q: 配置后多久生效？
**A:** 通常立即生效，但可能需要等待 1-2 分钟。如果不行，清除浏览器缓存后重试。

### Q: 我可以限制只有我的网站可以访问吗？
**A:** 可以！将 CORS 配置中的 `"AllowedOrigins": ["*"]` 改为：
```json
"AllowedOrigins": [
    "http://localhost:3000",
    "https://your-domain.com"
]
```

---

## 总结

你需要做的：
1. ✅ **保持** Bucket Policy 不变（已有的 PublicRead 配置）
2. ✅ **添加** CORS Configuration（新的跨域配置）

两个配置都在同一个地方（Permissions 标签），但是不同的部分，互不影响！
