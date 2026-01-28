# SwitchQR Logo Package

Complete brand assets for SwitchQR in multiple formats and sizes for all use cases.

## 📁 Directory Structure

```
switchqr_logos/
├── png/          # PNG raster images (transparent background)
├── svg/          # SVG vector graphics (scalable)
├── PDF/          # PDF vector graphics (print-ready)
├── logo.svg      # Original master logo
├── favicon.svg   # Icon-only favicon
└── favicon.png   # High-res favicon (1024×1024)
```

## 🎨 Logo Files

### PNG Format (Transparent Background)
**Location**: `png/`  
**Best for**: Web, social media, presentations, email

| File | Width | Use Case |
|------|-------|----------|
| `logo-256w.png` | 256px | Small web headers, email signatures |
| `logo-512w.png` | 512px | Medium web use, social media posts |
| `logo-1024w.png` | 1024px | Large web banners, presentations |
| `logo-2048w.png` | 2048px | High-DPI displays, marketing materials |

### SVG Format (Vector)
**Location**: `svg/`  
**Best for**: Web (scalable), responsive design, modern browsers

| File | Dimensions | Use Case |
|------|------------|----------|
| `logo-256w.svg` | 256×68 | Small responsive headers |
| `logo-512w.svg` | 512×137 | Medium responsive use |
| `logo-1024w.svg` | 1024×273 | Large responsive banners |
| `logo-2048w.svg` | 2048×546 | Ultra-high resolution displays |

### PDF Format (Print-Ready)
**Location**: `PDF/`  
**Best for**: Print materials, professional documents, press kits

| File | Dimensions | Use Case |
|------|------------|----------|
| `logo-256w.pdf` | 256×68 | Small print applications |
| `logo-512w.pdf` | 512×137 | Business cards, letterheads |
| `logo-1024w.pdf` | 1024×273 | Brochures, flyers |
| `logo-2048w.pdf` | 2048×546 | Large format printing, banners |

## 📱 Social Media Specifications

### Twitter/X
- **Header**: `png/logo-2048w.png` (crop to 1500×500)
- **Profile**: Use `favicon.png` (crop to square)

### LinkedIn
- **Company Banner**: `png/logo-2048w.png` (crop to 1128×191)
- **Profile**: Use `favicon.png` (crop to 300×300)

### Facebook
- **Cover Photo**: `png/logo-2048w.png` (crop to 820×312)
- **Profile**: Use `favicon.png` (crop to 180×180)

### Instagram
- **Profile**: Use `favicon.png` (crop to 320×320)
- **Posts**: `png/logo-1024w.png` on branded backgrounds

### YouTube
- **Channel Banner**: `png/logo-2048w.png` (crop to 2560×1440)
- **Profile**: Use `favicon.png` (crop to 800×800)

## 🌐 Website Usage

### HTML Implementation
```html
<!-- Standard -->
<img src="/logo.svg" alt="SwitchQR" height="36">

<!-- High-DPI Responsive -->
<img 
  src="/png/logo-512w.png" 
  srcset="/png/logo-512w.png 1x, /png/logo-1024w.png 2x"
  alt="SwitchQR" 
  height="36">

<!-- SVG (Recommended) -->
<img src="/svg/logo-512w.svg" alt="SwitchQR" height="36">
```

### CSS Background
```css
.logo {
  background-image: url('/svg/logo-512w.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## 🎨 Brand Guidelines

### Colors
- **Primary Purple**: `#8B5CF6`
- **Dark Text**: `#1e293b`
- **White**: `#ffffff`

### Logo Specifications
- **Aspect Ratio**: 3.75:1 (180:48)
- **Minimum Width**: 120px (maintain legibility)
- **Clear Space**: Minimum 16px padding around logo
- **Background**: Works best on white or light backgrounds

### Dark Mode
For dark backgrounds, use the white version or apply CSS filter:
```css
filter: brightness(0) invert(1);
```

### Don'ts
- ❌ Don't distort or stretch the logo
- ❌ Don't change the colors
- ❌ Don't separate the icon from the text
- ❌ Don't add effects (shadows, gradients, outlines)
- ❌ Don't rotate or skew the logo
- ❌ Don't place on busy backgrounds

## 📄 Print Guidelines

### Resolution
- **Minimum**: 300 DPI for print
- **Recommended**: Use PDF files for print
- **Large Format**: Use `logo-2048w.pdf`

### Color Mode
- **Digital**: RGB (#8B5CF6)
- **Print**: CMYK equivalent (convert in design software)

### File Selection
| Print Size | Recommended File |
|------------|------------------|
| Business Card | `PDF/logo-512w.pdf` |
| Letterhead | `PDF/logo-512w.pdf` |
| Brochure | `PDF/logo-1024w.pdf` |
| Poster | `PDF/logo-2048w.pdf` |
| Banner | `PDF/logo-2048w.pdf` |

## 📦 Quick Reference

### Need a logo for...
- **Website header?** → `svg/logo-512w.svg`
- **Email signature?** → `png/logo-256w.png`
- **Social media?** → `png/logo-2048w.png`
- **Presentation?** → `png/logo-1024w.png`
- **Print materials?** → `PDF/logo-1024w.pdf` or `PDF/logo-2048w.pdf`
- **App icon?** → `favicon.png`
- **Favicon?** → `favicon.svg` (with `favicon.png` fallback)

## 📋 File Locations in Project

These logo files are deployed in:
- `/client/public/logo.svg`
- `/client/public/favicon.svg`
- `/website/public/logo.svg`
- `/website/public/favicon.svg`

## 📝 Version History
- **v1.0** (2026-01-27): Initial logo and favicon creation
- **v1.1** (2026-01-28): Complete multi-format package (PNG, SVG, PDF in 4 sizes)

---

**Questions?** Contact the design team or refer to the brand guidelines document.
