"""Regenerate precise studio cell assets and two visual plates.

No historical artwork is reconstructed here. The wave is a chosen sine model,
the spiral an Archimedean model, and the star has eight alternating-radius tips.
All 12 cell PNGs are transparent, 800 x 800 pixels. Pillow supersampling provides
antialiased strokes. Run with Python 3 and Pillow from any working directory.
"""

from pathlib import Path
from math import sin, cos, pi, sqrt
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets"
CELLS = OUT / "cells"
S = 3
INK = "#233538"
TEAL = "#397A7B"
RUST = "#B56446"
GOLD = "#A5803A"
PAPER = "#F6F2E9"
CARD = "#FFFCF5"
MUTED = "#657270"
RULE = "#D6D8CC"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(px, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, int(px * S))


def new_canvas(w, h, bg):
    return Image.new("RGBA", (w * S, h * S), bg)


def text(draw, xy, value, size=20, fill=INK, bold=False, anchor=None):
    draw.text(tuple(int(v * S) for v in xy), value, font=font(size, bold),
              fill=fill, anchor=anchor)


def line(draw, points, fill=INK, width=10, close=False, caps=True):
    points = [(round(x * S), round(y * S)) for x, y in points]
    if close:
        points.append(points[0])
    draw.line(points, fill=fill, width=round(width * S), joint="curve")
    if caps and not close:
        r = width * S / 2
        for x, y in (points[0], points[-1]):
            draw.ellipse((round(x-r), round(y-r), round(x+r), round(y+r)), fill=fill)


def circle(draw, center, radius, fill=None, outline=INK, width=10):
    x, y = center
    box = ((x-radius)*S, (y-radius)*S, (x+radius)*S, (y+radius)*S)
    draw.ellipse(tuple(round(v) for v in box), fill=fill, outline=outline,
                 width=round(width*S) if outline else 1)


def poly(draw, points, fill=None, outline=INK, width=10):
    if fill:
        draw.polygon([(round(x*S), round(y*S)) for x, y in points], fill=fill)
    if outline:
        line(draw, points, fill=outline, width=width, close=True, caps=False)


def rounded_box(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(tuple(round(v*S) for v in box), radius=int(radius*S),
                           fill=fill, outline=outline, width=int(width*S))


def save(canvas, path):
    canvas.resize((canvas.width // S, canvas.height // S), Image.Resampling.LANCZOS).save(path)


def arc_points(cx=0, cy=0, radius=280, start=-150, sweep=120, steps=160):
    return [(cx + radius*cos((start+sweep*i/steps)*pi/180),
             cy + radius*sin((start+sweep*i/steps)*pi/180))
            for i in range(steps+1)]


def draw_cell(canvas, slug, center=(400, 400), scale=1, color=INK):
    d = ImageDraw.Draw(canvas)
    cx, cy = center
    def p(points):
        return [(cx+x*scale, cy+y*scale) for x, y in points]
    def path(points, width=11, close=False):
        line(d, p(points), color, width*scale, close=close)
    if slug == "dot":
        circle(d, center, 42*scale, fill=color, outline=None)
    elif slug == "line-segment":
        path([(-245, 0), (245, 0)])
    elif slug == "arc":
        path(arc_points(cy=210))
    elif slug == "circle":
        circle(d, center, 222*scale, outline=color, width=11*scale)
    elif slug == "crescent":
        # Filled set difference D((0,0),222) \ D((108,-26),215).
        # The erase operation preserves actual transparency in the exported cell.
        circle(d, center, 222*scale, fill=color, outline=None)
        circle(d, (cx+108*scale, cy-26*scale), 215*scale,
               fill=(0, 0, 0, 0), outline=None)
    elif slug == "triangle":
        radius = 255
        path([(radius*cos(a), radius*sin(a)) for a in (-pi/2, pi/6, 5*pi/6)], close=True)
    elif slug == "square":
        path([(-205, -205), (205, -205), (205, 205), (-205, 205)], close=True)
    elif slug == "wave":
        path([(-252+504*i/240, -105*sin(4*pi*i/240)) for i in range(241)])
    elif slug == "spiral":
        turns = 2.5
        path([((10+238*i/500)*cos(2*pi*turns*i/500-pi/2),
               (10+238*i/500)*sin(2*pi*turns*i/500-pi/2))
              for i in range(501)])
    elif slug == "star":
        # 16 ordered vertices: eight outer tips, eight inner vertices.
        path([((250 if i%2 == 0 else 116)*cos(-pi/2+i*pi/8),
               (250 if i%2 == 0 else 116)*sin(-pi/2+i*pi/8))
              for i in range(16)], close=True)
    elif slug in ("hatch", "cross-hatch"):
        # Bounded family of parallel segments. No claim of mathematical fractality.
        for k in range(-3, 4):
            path([(-215, k*49-82), (215, k*49+82)], width=9)
        if slug == "cross-hatch":
            for k in range(-3, 4):
                path([(-215, k*49+82), (215, k*49-82)], width=9)
    else:
        raise ValueError(slug)


RECORDS = [
    ("C01", "dot", "Dot", "Place / punctuate", "position · size"),
    ("C02", "line-segment", "Line segment", "Draw / direct", "length · angle · weight"),
    ("C03", "arc", "Arc", "Curve / turn", "radius · sweep · angle"),
    ("C04", "circle", "Circle", "Close / encircle", "center · radius · weight"),
    ("C05", "crescent", "Crescent", "Offset / subtract", "two radii · offset"),
    ("C06", "triangle", "Triangle", "Join / point", "side lengths · angles"),
    ("C07", "square", "Square", "Frame / partition", "side · rotation · weight"),
    ("C08", "wave", "Wave", "Oscillate / repeat", "amplitude · wavelength"),
    ("C09", "spiral", "Spiral", "Wind / expand", "start radius · growth"),
    ("C10", "star", "Eight-point star", "Alternate / radiate", "outer + inner radii"),
    ("C11", "hatch", "Hatch", "Repeat / shade", "spacing · angle · weight"),
    ("C12", "cross-hatch", "Cross-hatch", "Cross / densify", "two angles · spacing"),
]


def make_cells_plate():
    im = new_canvas(2000, 1580, PAPER)
    d = ImageDraw.Draw(im)
    text(d, (66, 48), "GEOMETRY / ORNAMENT", 18, TEAL, True)
    text(d, (64, 80), "A starter cabinet of cells", 48, INK, True)
    text(d, (66, 148), "12 reusable units  ·  marks become arrangements; arrangements become layers", 22, MUTED)
    x0, y0, cw, ch, gap = 65, 202, 454, 420, 18
    for index, (tag, slug, name, verb, params) in enumerate(RECORDS):
        col, row = index % 4, index // 4
        x, y = x0 + col*(cw+gap), y0+row*(ch+14)
        rounded_box(d, (x, y, x+cw, y+ch), 21, CARD, RULE)
        accent = (TEAL, RUST, GOLD)[row]
        text(d, (x+24, y+19), tag, 16, accent, True)
        text(d, (x+24, y+50), name, 27, INK, True)
        # Render into a transparent layer, then composite to keep crescent cutout clear.
        unit = new_canvas(cw, ch, (0, 0, 0, 0))
        draw_cell(unit, slug, (cw/2, 209), .36)
        im.alpha_composite(unit, (int(x*S), int(y*S)))
        d = ImageDraw.Draw(im)
        text(d, (x+24, y+333), verb, 22, accent, True)
        text(d, (x+24, y+370), params, 19, MUTED)
    text(d, (66, 1528), "STUDIO CONSTRUCTIONS", 16, TEAL, True)
    text(d, (320, 1528), "Chosen models: sine wave · Archimedean spiral · alternating-radius star", 17, MUTED)
    save(im, OUT / "cells-plate.png")


def petal_points(length=145, samples=100):
    """A lens petal, consisting of two identical 120-degree arcs.

    The lower arc is the upper arc reflected. Each endpoint is on the petal axis.
    Repeating this two-arc unit by rotation creates an exact sixfold arrangement.
    """
    r = length/sqrt(3)
    b = r/2
    top = arc_points(length/2, b, r, -150, 120, samples)
    bottom = [(x, -y) for x, y in top]
    return top, bottom


def transformed(points, center, angle=0, scale=1):
    a = angle*pi/180
    return [(center[0]+scale*(x*cos(a)-y*sin(a)),
             center[1]+scale*(x*sin(a)+y*cos(a))) for x, y in points]


def petal(draw, center, angle=0, scale=1, length=145, width=4.5,
          top_color=INK, bottom_color=INK):
    top, bottom = petal_points(length)
    line(draw, transformed(top, center, angle, scale), top_color, width)
    line(draw, transformed(bottom, center, angle, scale), bottom_color, width)


def flower(draw, center, radius=145, rotation=-90, width=4.5, color=INK):
    for i in range(6):
        petal(draw, center, angle=rotation+60*i, length=radius,
              width=width, top_color=color, bottom_color=color)


def arrow(draw, start, end, color=MUTED, width=2.5, head=11):
    line(draw, [start, end], color, width, caps=False)
    a = __import__('math').atan2(end[1]-start[1], end[0]-start[0])
    poly(draw, [end, (end[0]-head*cos(a-.5), end[1]-head*sin(a-.5)),
                (end[0]-head*cos(a+.5), end[1]-head*sin(a+.5))], fill=color, outline=None)


def make_layering_plate():
    im = new_canvas(2100, 790, PAPER)
    d = ImageDraw.Draw(im)
    text(d, (58, 35), "NEW STUDIO CONSTRUCTIONS", 18, TEAL, True)
    text(d, (56, 69), "A source stays reusable as the design grows", 39, INK, True)
    text(d, (58, 130), "One 120° arc  →  a two-arc petal  →  six rotated copies  →  another layer  →  a border", 20, MUTED)
    xs = [58, 536, 1014, 1492]
    widths = [450, 450, 450, 550]
    titles = ["01  Make a petal", "02  Rotate the unit", "03  Nest the arrangement", "04  Repeat the layer"]
    for x, w, title in zip(xs, widths, titles):
        rounded_box(d, (x, 189, x+w, 684), 24, CARD, RULE)
        text(d, (x+24, 217), title, 24, INK, True)
    # Show the original single arc clearly above its paired petal.
    top, bottom = petal_points(240)
    line(d, transformed(top, (xs[0]+103, 370)), TEAL, 6)
    text(d, (xs[0]+225, 267), "C03 / arc", 18, TEAL, True, anchor="mt")
    arrow(d, (xs[0]+225, 392), (xs[0]+225, 440), color=GOLD, width=2.5)
    petal(d, (xs[0]+103, 511), length=240, width=6,
          top_color=TEAL, bottom_color=RUST)
    text(d, (xs[0]+24, 607), "Reflect a second copy", 21, TEAL, True)
    text(d, (xs[0]+24, 642), "Two equal arcs; shared endpoints", 17, MUTED)
    # Exact sixfold rosette from six lens petals. Highlight the source unit.
    flower(d, (xs[1]+225, 445), radius=155, width=5, color=INK)
    petal(d, (xs[1]+225, 445), angle=-90, length=155, width=5.5,
          top_color=TEAL, bottom_color=RUST)
    circle(d, (xs[1]+225, 445), 5.5, fill=GOLD, outline=None)
    text(d, (xs[1]+24, 607), "Turn by 60° each time", 21, TEAL, True)
    text(d, (xs[1]+24, 642), "6 copies × 60° = one full turn", 17, MUTED)
    # Add a scaled copy rotated 30 degrees and boundary circles as distinct layers.
    center = (xs[2]+225, 434)
    flower(d, center, radius=133, width=4.6, color=INK)
    flower(d, center, radius=71, rotation=-60, width=3.6, color=TEAL)
    circle(d, center, 154, outline=GOLD, width=3)
    circle(d, center, 162, outline=GOLD, width=2)
    text(d, (xs[2]+24, 607), "Scale, turn, and encircle", 21, TEAL, True)
    text(d, (xs[2]+24, 642), "Each source layer remains distinct", 17, MUTED)
    # A three-module border: matched terminals and explicit translation distance.
    bx = xs[3]+40
    by = 445
    module_centers = [(bx+78+i*157, by) for i in range(3)]
    line(d, [(xs[3]+27, by-104), (xs[3]+523, by-104)], GOLD, 3)
    line(d, [(xs[3]+27, by+104), (xs[3]+523, by+104)], GOLD, 3)
    for n, c in enumerate(module_centers):
        flower(d, c, radius=65, width=2.7, color=INK)
        flower(d, c, radius=34, rotation=-60, width=2.2, color=TEAL)
        circle(d, c, 74, outline=GOLD, width=2)
        circle(d, c, 79, outline=GOLD, width=1.7)
    arrow(d, (module_centers[0][0], by+118), (module_centers[1][0], by+118), TEAL, 2)
    text(d, ((module_centers[0][0]+module_centers[1][0])/2, by+129), "fixed spacing", 15, TEAL, anchor="mt")
    text(d, (xs[3]+24, 607), "Translate the whole module", 21, TEAL, True)
    text(d, (xs[3]+24, 642), "A new reusable border layer", 17, MUTED)
    # Show progression between the four constructions, separate from drawing areas.
    for i in range(3):
        arrow(d, (xs[i]+widths[i]+5, 440), (xs[i+1]-7, 440), GOLD, 2.5, 8)
    text(d, (58, 728), "REUSABLE SOURCE", 16, TEAL, True)
    text(d, (282, 728), "arc → petal → arrangement → border", 18, INK)
    text(d, (1205, 728), "New designs; not historical reconstructions.", 18, MUTED)
    save(im, OUT / "layering-plate.png")


def main():
    CELLS.mkdir(parents=True, exist_ok=True)
    for tag, slug, *_ in RECORDS:
        im = new_canvas(800, 800, (0, 0, 0, 0))
        draw_cell(im, slug)
        save(im, CELLS / f"{tag.lower()}-{slug}.png")
    make_cells_plate()
    make_layering_plate()
    print(f"Rendered {len(RECORDS)} transparent cells, cells-plate.png, layering-plate.png")


if __name__ == "__main__":
    main()
