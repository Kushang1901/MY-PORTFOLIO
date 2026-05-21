from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import os

# ── PREMIUM DESIGNER COLOR SYSTEM (A to Z Refined) ───────────────────────────
DARK_NAVY    = colors.HexColor("#0F172A")  # Slate 900 (Deep elegant charcoal)
ACCENT_BLUE  = colors.HexColor("#4F46E5")  # Indigo 600 (High-end designer brand color)
LIGHT_ACCENT = colors.HexColor("#EEF2FF")  # Indigo 50 (Soft tint badge background)
MID_BLUE     = colors.HexColor("#6366F1")  # Indigo 500
SIDEBAR_BG   = colors.HexColor("#F8FAFC")  # Slate 50 (Sleek minimalist sidebar)
TEXT_DARK    = colors.HexColor("#0F172A")  # Slate 900
TEXT_MED     = colors.HexColor("#334155")  # Slate 700
TEXT_LIGHT   = colors.HexColor("#64748B")  # Slate 500
WHITE        = colors.white
DIVIDER      = colors.HexColor("#E2E8F0")  # Slate 200
TAG_BG       = colors.HexColor("#F1F5F9")  # Slate 100
GREEN_DOT    = colors.HexColor("#10B981")  # Emerald 500 (Vibrant active indicator)

PAGE_W, PAGE_H = A4
MARGIN_LEFT   = 16 * mm  # Generous margins for a spacious layout
MARGIN_RIGHT  = 16 * mm
SIDEBAR_W     = 58 * mm  # Sleek, perfectly proportional sidebar width
MAIN_X        = MARGIN_LEFT + SIDEBAR_W + 8 * mm  # 22pt visual breathing room gutter
MAIN_W        = PAGE_W - MAIN_X - MARGIN_RIGHT


# ── PREMIUM VECTOR ICON DESIGN SYSTEM ─────────────────────────────────────────
def draw_envelope_icon(c, x, y, size=7.5):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#A5B4FC"))  # Indigo-300 for premium accent
    c.setLineWidth(0.8)
    c.setFillColor(colors.transparent)
    w = size * 1.4
    h = size
    # Outer rectangle
    c.rect(x, y, w, h, fill=0, stroke=1)
    # Envelope fold lines
    p = c.beginPath()
    p.moveTo(x, y + h)
    p.lineTo(x + w/2, y + h*0.4)
    p.lineTo(x + w, y + h)
    c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def draw_location_icon(c, x, y, size=8):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#A5B4FC"))
    c.setLineWidth(0.8)
    c.setFillColor(colors.HexColor("#A5B4FC"))
    cx = x + size/2
    cy = y + size - size/3
    # Top pin circle
    c.circle(cx, cy, size/3, fill=0, stroke=1)
    # Inner dot
    c.circle(cx, cy, 0.8, fill=1, stroke=0)
    # Bottom pin pointer
    p = c.beginPath()
    p.moveTo(cx - size/3, cy)
    p.lineTo(cx, y)
    p.lineTo(cx + size/3, cy)
    c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def draw_code_icon(c, x, y, size=8):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#A5B4FC"))
    c.setLineWidth(0.8)
    # Left chevron <
    p = c.beginPath()
    p.moveTo(x + size*0.3, y + size*0.8)
    p.lineTo(x, y + size*0.5)
    p.lineTo(x + size*0.3, y + size*0.2)
    # Right chevron >
    p.moveTo(x + size*0.7, y + size*0.8)
    p.lineTo(x + size, y + size*0.5)
    p.lineTo(x + size*0.7, y + size*0.2)
    # Slash /
    p.moveTo(x + size*0.4, y + size*0.1)
    p.lineTo(x + size*0.6, y + size*0.9)
    c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def draw_linkedin_icon(c, x, y, size=8):
    c.saveState()
    c.setFillColor(colors.HexColor("#A5B4FC"))
    # Draw rounded square
    draw_rounded_rect(c, x, y, size, size, 1.5, colors.HexColor("#A5B4FC"), stroke=False)
    # Draw "in" text
    c.setFillColor(colors.HexColor("#1E1B4B"))
    c.setFont("Helvetica-Bold", size * 0.65)
    c.drawString(x + 1.2, y + 1.8, "in")
    c.restoreState()


def draw_globe_icon(c, x, y, size=8):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#A5B4FC"))
    c.setLineWidth(0.8)
    cx = x + size/2
    cy = y + size/2
    c.circle(cx, cy, size/2, fill=0, stroke=1)
    c.line(x, cy, x + size, cy)
    c.line(cx, y, cx, y + size)
    c.restoreState()


def draw_doc_icon(c, x, y, size=8):
    c.saveState()
    c.setStrokeColor(ACCENT_BLUE)
    c.setLineWidth(0.8)
    # Document page fold outline
    p = c.beginPath()
    p.moveTo(x, y)
    p.lineTo(x, y + size)
    p.lineTo(x + size*0.6, y + size)
    p.lineTo(x + size, y + size*0.6)
    p.lineTo(x + size, y)
    p.close()
    c.drawPath(p, fill=0, stroke=1)
    # Fold corner lines
    c.line(x + size*0.6, y + size, x + size*0.6, y + size*0.6)
    c.line(x + size*0.6, y + size*0.6, x + size, y + size*0.6)
    c.restoreState()


# ── PREMIUM CARD CONTAINER CLIPPING API ───────────────────────────────────────
def draw_rounded_rect(c, x, y, w, h, radius, fill_color, stroke=False,
                      stroke_color=None, stroke_width=0.5):
    c.saveState()
    c.setFillColor(fill_color)
    if stroke:
        c.setStrokeColor(stroke_color or fill_color)
        c.setLineWidth(stroke_width)
    p = c.beginPath()
    p.moveTo(x + radius, y)
    p.lineTo(x + w - radius, y)
    p.arcTo(x + w - 2*radius, y, x + w, y + 2*radius, -90, 90)
    p.lineTo(x + w, y + h - radius)
    p.arcTo(x + w - 2*radius, y + h - 2*radius, x + w, y + h, 0, 90)
    p.lineTo(x + radius, y + h)
    p.arcTo(x, y + h - 2*radius, x + 2*radius, y + h, 90, 90)
    p.lineTo(x, y + radius)
    p.arcTo(x, y, x + 2*radius, y + 2*radius, 180, 90)
    p.close()
    if stroke:
        c.drawPath(p, fill=1, stroke=1)
    else:
        c.drawPath(p, fill=1, stroke=0)
    c.restoreState()


def draw_card_container(c, x, y, w, h, radius, bg_color, accent_color, accent_w=3.5,
                        stroke_color=None, stroke_width=0.5):
    """
    Draws a premium rounded container card with a left colored accent strip.
    Utilizes path clipping to guarantee the left accent strip perfectly matches
    the rounded corners of the card boundary with zero overlap or spill.
    """
    c.saveState()
    # Create the card path
    p = c.beginPath()
    p.moveTo(x + radius, y)
    p.lineTo(x + w - radius, y)
    p.arcTo(x + w - 2*radius, y, x + w, y + 2*radius, -90, 90)
    p.lineTo(x + w, y + h - radius)
    p.arcTo(x + w - 2*radius, y + h - 2*radius, x + w, y + h, 0, 90)
    p.lineTo(x + radius, y + h)
    p.arcTo(x, y + h - 2*radius, x + 2*radius, y + h, 90, 90)
    p.lineTo(x, y + radius)
    p.arcTo(x, y, x + 2*radius, y + 2*radius, 180, 90)
    p.close()
    
    # Draw background fill and border
    c.setFillColor(bg_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
        c.drawPath(p, fill=1, stroke=1)
    else:
        c.drawPath(p, fill=1, stroke=0)
        
    # Clip the left accent strip to the card boundary
    c.clipPath(p, stroke=0)
    c.setFillColor(accent_color)
    c.rect(x, y, accent_w, h, fill=1, stroke=0)
    c.restoreState()


def draw_tag(c, x, y, text, font_size=7, bg=TAG_BG, fg=ACCENT_BLUE):
    c.saveState()
    c.setFont("Helvetica-Bold", font_size)
    tw = c.stringWidth(text, "Helvetica-Bold", font_size)
    pad_x, pad_y, radius = 5.5, 3, 3
    bw = tw + pad_x * 2
    bh = font_size + pad_y * 2
    draw_rounded_rect(c, x, y - pad_y, bw, bh, radius, bg)
    c.setFillColor(fg)
    c.drawString(x + pad_x, y + 1, text)
    c.restoreState()
    return bw + 3.5


def draw_interactive_button(c, x, y, text, url, font_size=7,
                            bg_color=ACCENT_BLUE, fg_color=WHITE,
                            stroke_color=None, padding_x=8, padding_y=3.5,
                            radius=4):
    """
    Draws a beautiful rounded button and registers an active clickable link annotation.
    """
    c.saveState()
    c.setFont("Helvetica-Bold", font_size)
    text_w = c.stringWidth(text, "Helvetica-Bold", font_size)
    bw = text_w + padding_x * 2
    bh = font_size + padding_y * 2
    
    draw_rounded_rect(c, x, y, bw, bh, radius, bg_color,
                      stroke=(stroke_color is not None),
                      stroke_color=stroke_color, stroke_width=0.6)
    
    c.setFillColor(fg_color)
    c.drawString(x + padding_x, y + padding_y, text)
    c.linkURL(url, (x, y, x + bw, y + bh))
    c.restoreState()
    return bw, bh


def draw_header_badge_vector(c, x, y, icon_type, label, url=None):
    """
    Draws a sleek header contact badge with custom vector icons.
    Registers click link annotation if URL is specified.
    """
    c.saveState()
    font_size = 7.5
    c.setFont("Helvetica-Bold", font_size)
    
    icon_w = 9
    icon_padding = 5
    text_w = c.stringWidth(label, "Helvetica-Bold", font_size)
    
    pad_x = 8.5
    pad_y = 4.5
    radius = 4
    
    bw = pad_x * 2 + icon_w + icon_padding + text_w
    bh = font_size + pad_y * 2
    
    # Translucent dark indigo-slate background
    badge_bg = colors.HexColor("#1E1B4B")
    draw_rounded_rect(c, x, y - pad_y, bw, bh, radius, badge_bg)
    
    # Draw vector icon
    ix = x + pad_x
    iy = y - 1
    if icon_type == "email":
        draw_envelope_icon(c, ix, iy, size=7.5)
    elif icon_type == "location":
        draw_location_icon(c, ix, iy - 1, size=8)
    elif icon_type == "github":
        draw_code_icon(c, ix, iy - 0.5, size=8)
    elif icon_type == "linkedin":
        draw_linkedin_icon(c, ix, iy - 0.5, size=8)
    elif icon_type == "portfolio":
        draw_globe_icon(c, ix, iy - 0.5, size=8)
        
    c.setFillColor(colors.HexColor("#E2E8F0"))
    c.drawString(ix + icon_w + icon_padding, y + 1, label)
    
    if url:
        c.linkURL(url, (x, y - pad_y, x + bw, y - pad_y + bh))
        
    c.restoreState()
    return bw + 7


def draw_section_header(c, x, y, title, width):
    c.saveState()
    c.setFillColor(ACCENT_BLUE)
    c.rect(x, y - 1, 3.5, 14, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(TEXT_DARK)
    c.drawString(x + 9, y + 2, title.upper())
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.6)
    c.line(x + 9 + c.stringWidth(title.upper(), "Helvetica-Bold", 10.5) + 6,
           y + 6, x + width, y + 6)
    c.restoreState()
    return y - 18


def sidebar_section_header(c, x, y, title):
    c.saveState()
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(TEXT_DARK)
    c.drawString(x + 2, y, title.upper())
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.8)
    # The line ends exactly before the sidebar right boundary to prevent crossing divider
    c.line(x + 2, y - 3, x + SIDEBAR_W - 4, y - 3)
    c.restoreState()
    return y - 13


def draw_skill_bar(c, x, y, label, level, bar_w=SIDEBAR_W - 8):
    c.saveState()
    c.setFont("Helvetica", 7.5)
    c.setFillColor(TEXT_DARK)
    c.drawString(x, y + 1, label)
    track_y = y - 4
    track_h = 3.5
    draw_rounded_rect(c, x, track_y, bar_w, track_h, 1.75, colors.HexColor("#E2E8F0"))
    fill_w = bar_w * level
    if fill_w > 4:
        draw_rounded_rect(c, x, track_y, fill_w, track_h, 1.75, ACCENT_BLUE)
    c.restoreState()
    return y - 14


def para(c, x, y, text, font="Helvetica", size=8.5, color=TEXT_MED,
         max_w=None, leading=13):
    c.saveState()
    c.setFont(font, size)
    c.setFillColor(color)
    if max_w:
        style = ParagraphStyle("tmp", fontName=font, fontSize=size,
                               textColor=color, leading=leading,
                               spaceAfter=0, spaceBefore=0)
        p = Paragraph(text, style)
        _, ph = p.wrap(max_w, 999)
        p.drawOn(c, x, y - ph + size * 0.3)
        c.restoreState()
        return y - ph - 2.5
    else:
        c.drawString(x, y, text)
        c.restoreState()
        return y - leading


def draw_bullet(c, x, y, text, bullet_color=ACCENT_BLUE, max_w=None, font_size=7.8):
    c.saveState()
    c.setFillColor(bullet_color)
    c.circle(x + 2.5, y - 5, 1.5, fill=1, stroke=0)
    c.restoreState()
    return para(c, x + 9, y, text, size=font_size, color=TEXT_MED,
                 max_w=max_w, leading=11.5)


def draw_page_footer(c, f_text1, f_text2, f_text3, f_right, bullet_sep):
    """
    Renders the unified premium page footer banner.
    """
    c.saveState()
    c.setFillColor(DARK_NAVY)
    c.rect(0, 0, PAGE_W, 10 * mm, fill=1, stroke=0)
    
    c.setFont("Helvetica", 7)
    c.setFillColor(colors.HexColor("#A8C4E0"))
    
    fx = MARGIN_LEFT
    fy = 3.5 * mm
    
    c.drawString(fx, fy, f_text1)
    c.linkURL("mailto:" + f_text1, (fx, fy - 2, fx + c.stringWidth(f_text1, "Helvetica", 7), fy + 8))
    fx += c.stringWidth(f_text1, "Helvetica", 7)
    
    c.drawString(fx, fy, bullet_sep)
    fx += c.stringWidth(bullet_sep, "Helvetica", 7)
    
    c.drawString(fx, fy, f_text2)
    c.linkURL("https://" + f_text2, (fx, fy - 2, fx + c.stringWidth(f_text2, "Helvetica", 7), fy + 8))
    fx += c.stringWidth(f_text2, "Helvetica", 7)
    
    c.drawString(fx, fy, bullet_sep)
    fx += c.stringWidth(bullet_sep, "Helvetica", 7)
    
    c.drawString(fx, fy, f_text3)
    c.linkURL("https://" + f_text3, (fx, fy - 2, fx + c.stringWidth(f_text3, "Helvetica", 7), fy + 8))
    
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(ACCENT_BLUE)
    rx = PAGE_W - MARGIN_RIGHT - c.stringWidth(f_right, "Helvetica-Bold", 7)
    c.drawString(rx, fy, f_right)
    c.linkURL("https://" + f_right, (rx, fy - 2, PAGE_W - MARGIN_RIGHT, fy + 8))
    c.restoreState()


# ── MAIN GENERATOR FUNCTION ───────────────────────────────────────────────────
def generate_cv(output_path="kushang_acharya_cv.pdf"):
    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle("Kushang Acharya – Web Developer & Frontend Specialist CV")

    # Footer constants
    f_text1 = "kushangacharya8830@gmail.com"
    f_text2 = "github.com/Kushang1901"
    f_text3 = "linkedin.com/in/kushang-acharya"
    f_right = "kushangacharya.vercel.app"
    bullet_sep = "   •   "

    # =========================================================================
    # ── PAGE 1 (Branding, Summary, Skills, Work Experience, Education) ───────
    # =========================================================================

    # ── HEADER BANNER ──
    banner_h = 52 * mm
    c.setFillColor(DARK_NAVY)
    c.rect(0, PAGE_H - banner_h, PAGE_W, banner_h, fill=1, stroke=0)

    # Decorative background vector circles
    c.saveState()
    c.setFillColor(colors.HexColor("#1E1B4B"))
    c.circle(PAGE_W - 18*mm, PAGE_H - 8*mm, 42, fill=1, stroke=0)
    c.circle(PAGE_W - 8*mm, PAGE_H - 30*mm, 26, fill=1, stroke=0)
    c.circle(12*mm, PAGE_H - banner_h + 8*mm, 20, fill=1, stroke=0)
    c.restoreState()

    # Brand color accent line
    c.setFillColor(ACCENT_BLUE)
    c.rect(0, PAGE_H - banner_h, PAGE_W, 3, fill=1, stroke=0)

    # Name
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(WHITE)
    c.drawString(MARGIN_LEFT, PAGE_H - 24*mm, "KUSHANG ACHARYA")

    # Title Badge (Precisely centered, bold premium style)
    c.saveState()
    title_text = "Web Developer  •  Frontend Specialist"
    c.setFont("Helvetica-Bold", 8.5)
    tw = c.stringWidth(title_text, "Helvetica-Bold", 8.5)
    
    badge_h = 17
    badge_w = tw + 16
    badge_x = MARGIN_LEFT
    badge_y = PAGE_H - 34*mm
    
    # Beautiful rounded badge container
    draw_rounded_rect(c, badge_x, badge_y, badge_w, badge_h, 5, colors.HexColor("#312E81"))
    c.setFillColor(WHITE)
    c.drawString(badge_x + 8, badge_y + 5.5, title_text)
    c.restoreState()

    # Clickable vector badge header items
    contacts = [
        ("email", "kushangacharya8830@gmail.com", "mailto:kushangacharya8830@gmail.com"),
        ("location", "Vadodara, Gujarat", "https://maps.google.com/?q=Vadodara,+Gujarat,+India"),
        ("github", "GitHub", "https://github.com/Kushang1901"),
        ("linkedin", "LinkedIn", "https://linkedin.com/in/kushang-acharya"),
        ("portfolio", "Portfolio", "https://kushangacharya.vercel.app"),
    ]
    cx = MARGIN_LEFT
    cy = PAGE_H - banner_h + 9*mm
    for icon_type, label, url in contacts:
        cx += draw_header_badge_vector(c, cx, cy, icon_type, label, url)

    # ── TWO-COLUMN GRID ──
    sb_top = PAGE_H - banner_h - 2
    c.setFillColor(SIDEBAR_BG)
    c.rect(0, 0, SIDEBAR_W + MARGIN_LEFT, sb_top, fill=1, stroke=0)
    
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.6)
    c.line(SIDEBAR_W + MARGIN_LEFT, 0, SIDEBAR_W + MARGIN_LEFT, sb_top)

    # ── PAGE 1 SIDEBAR ──
    sx = MARGIN_LEFT + 2
    sy = sb_top - 14*mm

    # 1. Technical Skills
    sy = sidebar_section_header(c, sx, sy, "Technical Skills")
    skill_bars = [
        ("HTML5 / CSS3",      0.95),
        ("JavaScript",        0.88),
        ("React.js / Next.js",0.85),
        ("Python",            0.80),
        ("Java",              0.78),
        ("Node.js",           0.72),
        ("MongoDB / SQL",     0.70),
        ("Git & GitHub",      0.88),
    ]
    for label, level in skill_bars:
        sy = draw_skill_bar(c, sx, sy, label, level)
        sy -= 3.5

    # 2. Tools & Concepts
    sy -= 4
    sy = sidebar_section_header(c, sx, sy, "Tools & Concepts")
    tools = ["Vite", "REST APIs", "OpenCV", "PIL", "PostgreSQL",
             "SSR / SSG", "OOP", "Component Architecture",
             "Responsive Design", "SEO Optimisation"]
    tx, ty = sx, sy
    row_x = tx
    for tool in tools:
        tag_w = c.stringWidth(tool, "Helvetica-Bold", 7) + 11  # pad_x is 5.5 (11 total)
        if row_x + tag_w > sx + SIDEBAR_W - 4*mm:
            row_x = tx
            ty -= 14
        draw_tag(c, row_x, ty, tool, font_size=7, bg=TAG_BG, fg=ACCENT_BLUE)
        row_x += tag_w + 3.5
    sy = ty - 16

    # 3. Languages
    sy -= 4
    sy = sidebar_section_header(c, sx, sy, "Languages")
    for lang, level in [("Gujarati", "Native"), ("Hindi", "Fluent"), ("English", "Professional")]:
        c.saveState()
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(TEXT_DARK)
        c.drawString(sx + 2, sy, lang)
        c.setFont("Helvetica", 7)
        c.setFillColor(TEXT_LIGHT)
        # Shift level horizontally to align in a pristine second column with zero overlap
        c.drawString(sx + 32*mm, sy, level)
        c.restoreState()
        sy -= 11

    # 4. Certifications (Consolidated on Page 1 Sidebar)
    sy -= 4
    sy = sidebar_section_header(c, sx, sy, "Certifications")
    certs = [
        "TCS iON NQT – Cognitive &\nPsychometric Skills",
        "TCS iON NQT IT – Programming\n& Technical Skills",
        "CMAT – Common Management\nAdmission Test (Qualified)",
    ]
    for cert in certs:
        c.saveState()
        c.setFillColor(ACCENT_BLUE)
        c.circle(sx + 3, sy + 2, 2, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(TEXT_DARK)
        lines = cert.split("\n")
        c.drawString(sx + 9, sy + 1, lines[0])
        if len(lines) > 1:
            c.setFont("Helvetica", 7.2)
            c.setFillColor(TEXT_LIGHT)
            c.drawString(sx + 9, sy - 8, lines[1])
            sy -= 10
        c.restoreState()
        sy -= 16

    # 5. Soft Skills (Consolidated on Page 1 Sidebar)
    sy -= 4
    sy = sidebar_section_header(c, sx, sy, "Soft Skills")
    soft = ["Problem Solving", "Team Collaboration", "Communication",
            "Time Management", "Adaptability", "Attention to Detail"]
    tx, ty = sx, sy
    row_x = tx
    for skill in soft:
        tag_w = c.stringWidth(skill, "Helvetica-Bold", 7) + 11
        if row_x + tag_w > sx + SIDEBAR_W - 4*mm:
            row_x = tx
            ty -= 14
        draw_tag(c, row_x, ty, skill, font_size=7,
                 bg=colors.HexColor("#ECFDF5"),  # Soft emerald background
                 fg=colors.HexColor("#059669"))  # Deep emerald
        row_x += tag_w + 3.5
    sy = ty - 16

    # ── PAGE 1 MAIN COLUMN ──
    my = sb_top - 12*mm
    mw = MAIN_W

    # 1. Professional Summary
    my = draw_section_header(c, MAIN_X, my, "Professional Summary", mw)
    summary = (
        "IT professional with an <b>MSc in Information Technology</b>, "
        "specialising in Web Development and Java Development. Experienced in "
        "building innovative, real-world solutions with a focus on efficient, "
        "user-friendly applications and exceptional user experiences across "
        "<b>full-stack environments</b>. Passionate about clean code, modern UI/UX, "
        "and delivering measurable impact through technology."
    )
    style = ParagraphStyle("sum", fontName="Helvetica", fontSize=8.5, textColor=TEXT_MED, leading=13.5)
    p = Paragraph(summary, style)
    _, ph = p.wrap(mw, 200)
    p.drawOn(c, MAIN_X, my - ph + 4)
    my = my - ph - 16

    # 2. Work Experience (DreamsDesign)
    my = draw_section_header(c, MAIN_X, my, "Work Experience", mw)

    intern_bullets = [
        "Developed and maintained responsive web interfaces using React.js and modern CSS.",
        "Collaborated with the design team to implement pixel-perfect UI from Figma mockups.",
        "Improved page load performance and cross-browser compatibility across client projects.",
    ]

    # Pre-calculate experience bullets height to size the card dynamically
    style_bullet = ParagraphStyle("work_bullet", fontName="Helvetica", fontSize=7.8, leading=12)
    bullets_h = 0
    for b in intern_bullets:
        p_b = Paragraph(b, style_bullet)
        _, ph = p_b.wrap(mw - 26, 999)
        bullets_h += ph + 2
    
    # Elegant, extremely spacious card height sizing
    card_h = 69 + bullets_h
    card_y = my - card_h
    
    # Draw card container with clipped left brand colored accent bar
    draw_card_container(c, MAIN_X - 2, card_y, mw + 4, card_h, 6,
                        LIGHT_ACCENT, ACCENT_BLUE, accent_w=4,
                        stroke_color=colors.HexColor("#C0D0F0"), stroke_width=0.6)

    # Active emerald indicator dot
    c.setFillColor(GREEN_DOT)
    c.circle(MAIN_X + 11, my - 12, 3.5, fill=1, stroke=0)
    
    # Title
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(TEXT_DARK)
    c.drawString(MAIN_X + 20, my - 15, "Frontend Developer Intern")

    # Company & Location
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(ACCENT_BLUE)
    c.drawString(MAIN_X + 20, my - 28, "DreamsDesign")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_LIGHT)
    c.drawString(MAIN_X + 20 + c.stringWidth("DreamsDesign", "Helvetica-Bold", 8) + 4, my - 28, "– Vadodara, Gujarat")

    # Date badge
    date_text = "Dec 2025 – May 2026"
    c.saveState()
    c.setFont("Helvetica-Bold", 7.5)
    date_w = c.stringWidth(date_text, "Helvetica-Bold", 7.5)
    draw_rounded_rect(c, MAIN_X + mw - date_w - 14, my - 17, date_w + 10, 14, 4, colors.HexColor("#1D3A8A"))
    c.setFillColor(WHITE)
    c.drawString(MAIN_X + mw - date_w - 9, my - 13, date_text)
    c.restoreState()

    # Premium interactive Certificate button badge (with vector doc icon)
    cert_text = "   View Certificate"
    cert_url  = "https://drive.google.com/file/d/1XD8T9zm6AjRMDNrvXmua7YbOXdLY2IIL/view?usp=sharing"
    draw_interactive_button(c, MAIN_X + 20, my - 46, cert_text, cert_url,
                            font_size=7, bg_color=LIGHT_ACCENT, fg_color=ACCENT_BLUE,
                            stroke_color=colors.HexColor("#BFDBFE"),
                            padding_x=7, padding_y=3, radius=4)
    # Draw vector doc icon inside the button
    draw_doc_icon(c, MAIN_X + 24, my - 43.5, size=6)

    # Bullet points with ideal spacing
    iy = my - 62
    for b in intern_bullets:
        iy = draw_bullet(c, MAIN_X + 11, iy, b, bullet_color=ACCENT_BLUE, max_w=mw - 26, font_size=7.8)

    my -= card_h + 16

    # 3. Education (Taller, balanced spacious cards)
    my = draw_section_header(c, MAIN_X, my, "Education", mw)
    
    education_data = [
        ("MSc Information Technology", "Web & Java Development", "2024 – 2026", "Gujarat, India"),
        ("BCA – Computer Applications", "Core CS Concepts", "2021 – 2024", "Gujarat, India"),
    ]
    
    for deg, spec, yr, grade in education_data:
        c.saveState()
        card_y = my - 38
        # Premium card container
        draw_card_container(c, MAIN_X - 2, card_y, mw + 4, 42, 5,
                            WHITE, ACCENT_BLUE, accent_w=3,
                            stroke_color=DIVIDER, stroke_width=0.5)
        
        # Details
        c.setFont("Helvetica-Bold", 8.5)
        c.setFillColor(TEXT_DARK)
        c.drawString(MAIN_X + 8, my - 8, deg)
        c.setFont("Helvetica", 7.8)
        c.setFillColor(TEXT_MED)
        c.drawString(MAIN_X + 8, my - 19, spec)
        
        # Year
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(ACCENT_BLUE)
        c.drawString(MAIN_X + 8, my - 30, yr)
        
        # Location / Grade
        c.setFont("Helvetica", 7.5)
        c.setFillColor(TEXT_LIGHT)
        c.drawString(MAIN_X + 8 + c.stringWidth(yr, "Helvetica-Bold", 7.5) + 6, my - 30, "| " + grade)
        c.restoreState()
        my -= 48

    # Page 1 Footer
    draw_page_footer(c, f_text1, f_text2, f_text3, f_right, bullet_sep)

    # =========================================================================
    # ── PAGE 2 (Header bar, Certifications, Soft Skills, Key Projects) ───────
    # =========================================================================
    c.showPage()

    # ── PAGE 2 TOP BAR HEADER ──
    header2_h = 16 * mm
    c.setFillColor(DARK_NAVY)
    c.rect(0, PAGE_H - header2_h, PAGE_W, header2_h, fill=1, stroke=0)
    
    c.setFillColor(ACCENT_BLUE)
    c.rect(0, PAGE_H - header2_h, PAGE_W, 2.5, fill=1, stroke=0)
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(WHITE)
    c.drawString(MARGIN_LEFT, PAGE_H - 10*mm, "KUSHANG ACHARYA")
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#A8C4E0"))
    c.drawRightString(PAGE_W - MARGIN_RIGHT, PAGE_H - 10*mm, "Key Projects & Credentials")

    # ── PAGE 2 MAIN COLUMN (FULL WIDTH) ──
    sb_top2 = PAGE_H - header2_h - 2
    my = sb_top2 - 12*mm
    mx2 = MARGIN_LEFT
    mw2 = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT

    # 1. Key Projects
    my = draw_section_header(c, mx2, my, "Key Projects", mw2)

    projects = [
        {
            "title": "SoundWave E-Commerce Website",
            "tags": ["HTML5", "CSS3", "JavaScript", "Responsive"],
            "url":  "https://my-soundwave.vercel.app/",
            "button_text": "Visit Site",
            "bullets": [
                "Built a fully responsive online store with modern UI and interactive shopping cart.",
                "Implemented secure checkout flow and dynamic product filtering for smooth UX.",
            ],
        },
        {
            "title": "Hotel Devang – Business Website",
            "tags": ["HTML5", "CSS3", "JavaScript", "WhatsApp API"],
            "url":  "https://www.hoteldevang.com/",
            "button_text": "Visit Site",
            "bullets": [
                "Developed a multi-page hotel booking site with real-time WhatsApp API reservation.",
                "Designed mobile-first responsive layout with gallery and amenities showcase.",
            ],
        },
        {
            "title": "Java Image Processing Software",
            "tags": ["Java", "OOP", "Desktop App", "Batch Processing"],
            "url":  "https://github.com/Kushang1901/java-image-processing",
            "button_text": "View Code",
            "bullets": [
                "Designed advanced desktop app supporting image filters and geometric transformations.",
                "Architected using OOP principles with a modular, extensible codebase.",
            ],
        },
        {
            "title": "Python Image Processing Application",
            "tags": ["Python", "OpenCV", "PIL", "ML / Facial Recognition"],
            "url":  "https://github.com/Kushang1901/Python-Image-Processing",
            "button_text": "View Code",
            "bullets": [
                "Leveraged OpenCV and PIL for facial recognition, image enhancement, and noise reduction.",
                "Integrated ML-based detection pipelines for production-grade real-time accuracy.",
            ],
        },
        {
            "title": "Personal Portfolio Website",
            "tags": ["Next.js", "React.js", "SSG", "SEO"],
            "url":  "https://kushangacharya.vercel.app/",
            "button_text": "Visit Site",
            "bullets": [
                "Designed and deployed personal portfolio with Next.js SSG for optimised performance.",
                "Showcases projects, skills, and contact info with SEO best practices.",
            ],
        },
    ]

    for proj in projects:
        # Pre-calculate project bullets height dynamically
        style_bullet = ParagraphStyle("proj_bullet", fontName="Helvetica", fontSize=7.8, leading=11.5)
        bullets_h = 0
        for b in proj["bullets"]:
            p_b = Paragraph(b, style_bullet)
            _, ph = p_b.wrap(mw2 - 22, 999)
            bullets_h += ph + 2
            
        # Taller, extremely roomy visual card container
        card_h = 49 + bullets_h
        
        # Safe page break triggers
        if my - card_h < 18*mm:
            c.showPage()
            my = PAGE_H - 20*mm
            c.setFillColor(DARK_NAVY)
            c.rect(0, PAGE_H - header2_h, PAGE_W, header2_h, fill=1, stroke=0)
            c.setFillColor(ACCENT_BLUE)
            c.rect(0, PAGE_H - header2_h, PAGE_W, 2.5, fill=1, stroke=0)
            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(WHITE)
            c.drawString(MARGIN_LEFT, PAGE_H - 10*mm, "KUSHANG ACHARYA")
            c.setFont("Helvetica", 8)
            c.setFillColor(colors.HexColor("#A8C4E0"))
            c.drawRightString(PAGE_W - MARGIN_RIGHT, PAGE_H - 10*mm, "Key Projects & Credentials")

        card_y = my - card_h
        # Draw clipped card container
        draw_card_container(c, mx2 - 2, card_y, mw2 + 4, card_h, 5,
                            WHITE, ACCENT_BLUE, accent_w=3.5,
                            stroke_color=DIVIDER, stroke_width=0.5)

        # Title
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(TEXT_DARK)
        c.drawString(mx2 + 7, my - 13, proj["title"])

        # Clickable CTA button badge
        btn_label = proj["button_text"]
        c.saveState()
        c.setFont("Helvetica-Bold", 7)
        btn_text_w = c.stringWidth(btn_label, "Helvetica-Bold", 7)
        padding_x = 8
        btn_w = btn_text_w + padding_x * 2
        bx = mx2 + mw2 - btn_w - 6
        by = my - 16.5
        draw_interactive_button(c, bx, by, btn_label, proj["url"],
                                font_size=7, bg_color=ACCENT_BLUE,
                                fg_color=WHITE, stroke_color=None,
                                padding_x=padding_x, padding_y=3, radius=4)
        c.restoreState()

        # Tech Tags
        tx_start = mx2 + 7
        ty_tag   = my - 27
        for tag in proj["tags"]:
            adv = draw_tag(c, tx_start, ty_tag, tag)
            tx_start += adv

        # Bullets
        by = my - 42
        for b in proj["bullets"]:
            by = draw_bullet(c, mx2 + 9, by, b, bullet_color=MID_BLUE, max_w=mw2 - 22, font_size=7.8)

        my -= card_h + 8

    # Page 2 Footer
    draw_page_footer(c, f_text1, f_text2, f_text3, f_right, bullet_sep)

    c.save()
    print(f"Success! CV generated: {output_path}")


if __name__ == "__main__":
    generate_cv(r"C:\Users\kusha\Downloads\kushang_acharya_cv_improved.pdf")
