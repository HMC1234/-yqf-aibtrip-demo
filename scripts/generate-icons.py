#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成PWA应用图标
创建 192x192 和 512x512 的PNG图标
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# 设置UTF-8编码输出（Windows）
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

def create_icon(size):
    """创建指定尺寸的图标"""
    # 创建新图片，背景为品牌紫色
    img = Image.new('RGB', (size, size), color='#9333EA')
    draw = ImageDraw.Draw(img)
    
    # 计算文字位置（居中）
    text = "一起飞"
    
    # 尝试加载字体，如果失败则使用默认字体
    try:
        # Windows字体路径
        font_path = "C:/Windows/Fonts/msyh.ttc"  # 微软雅黑
        if not os.path.exists(font_path):
            font_path = "C:/Windows/Fonts/simsun.ttc"  # 宋体
        if os.path.exists(font_path):
            # 根据图标大小调整字体大小
            font_size = size // 3
            font = ImageFont.truetype(font_path, font_size)
        else:
            font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
    
    # 获取文字尺寸
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # 居中绘制文字
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - text_height // 4  # 微调垂直位置
    
    # 绘制白色文字
    draw.text((x, y), text, fill='white', font=font)
    
    # 如果尺寸较大，添加装饰性圆形边框
    if size >= 256:
        margin = size // 8
        draw.ellipse(
            [margin, margin, size - margin, size - margin],
            outline='white',
            width=max(2, size // 128)
        )
    
    return img

def main():
    """主函数"""
    # 确保public目录存在
    public_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
    os.makedirs(public_dir, exist_ok=True)
    
    # 生成不同尺寸的图标
    sizes = [192, 512]
    
    print("[*] 开始生成应用图标...")
    
    for size in sizes:
        print(f"   [*] 生成 {size}x{size} 图标...")
        icon = create_icon(size)
        icon_path = os.path.join(public_dir, f'icon-{size}.png')
        icon.save(icon_path, 'PNG')
        print(f"   [+] 已保存: {icon_path}")
    
    print("\n[+] 图标生成完成！")
    print(f"[*] 图标位置: {public_dir}")

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print("[!] 错误: 需要安装 Pillow 库")
        print("   请运行: pip install Pillow")
        exit(1)
    except Exception as e:
        print(f"[!] 错误: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

