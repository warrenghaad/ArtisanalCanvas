"""Render the collection's two exact conceptual diagrams (Pillow; no generated imagery)."""
from pathlib import Path
from math import atan2, cos, sin, pi
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets"
OUT.mkdir(parents=True, exist_ok=True)
S = 2
C = {"bg": "#f6f1e8", "ink": "#233638", "teal": "#3a756f",
     "clay": "#a9573b", "gold": "#b58b40", "line": "#cfc7b8",
     "paper": "#fffdf8", "muted": "#5f6a68", "pale": "#e6eee7"}
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


class Plate:
    def __init__(self, w, h):
        self.size = (w, h)
        self.im = Image.new("RGB", (w * S, h * S), C["bg"])
        self.d = ImageDraw.Draw(self.im)

    def box(self, xy, fill, outline=None, width=2, radius=22):
        self.d.rounded_rectangle(tuple(round(v*S) for v in xy),
                                 radius=radius*S, fill=fill,
                                 outline=outline, width=width*S)

    def line(self, pts, fill, width=3):
        self.d.line([(round(x*S), round(y*S)) for x,y in pts],
                    fill=fill, width=width*S, joint="curve")

    def txt(self, xy, text, size=26, fill=None, bold=False, mono=False, anchor=None):
        f = ImageFont.truetype(MONO if mono else BOLD if bold else FONT, size*S)
        self.d.text((xy[0]*S, xy[1]*S), text, font=f, fill=fill or C["ink"], anchor=anchor)

    def wrap(self, xy, text, width, size=25, fill=None, gap=9):
        f = ImageFont.truetype(FONT, size*S)
        y=xy[1]
        for para in text.split("\n"):
            current=""
            for word in para.split():
                candidate=(current+" "+word).strip()
                if self.d.textlength(candidate, font=f) > width*S and current:
                    self.txt((xy[0],y),current,size,fill)
                    y += size+gap; current=word
                else: current=candidate
            self.txt((xy[0],y),current,size,fill)
            y += size+gap
        return y

    def ellipse(self, xy, fill=None, outline=None, width=3):
        self.d.ellipse(tuple(round(v*S) for v in xy), fill=fill, outline=outline, width=width*S)

    def polygon(self, pts, fill, outline=None, width=2):
        self.d.polygon([(round(x*S),round(y*S)) for x,y in pts], fill=fill,
                       outline=outline, width=width*S)

    def arrowhead(self, tip, back, color, length=16, spread=0.48):
        a=atan2(tip[1]-back[1],tip[0]-back[0])
        pts=[tip,(tip[0]-length*cos(a-spread),tip[1]-length*sin(a-spread)),
             (tip[0]-length*cos(a+spread),tip[1]-length*sin(a+spread))]
        self.polygon(pts,color)

    def arrow(self, points, color=None, width=4, both=False):
        color=color or C["teal"]
        self.line(points,color,width)
        self.arrowhead(points[-1],points[-2],color)
        if both: self.arrowhead(points[0],points[1],color)

    def bezier(self, p0,p1,p2,p3,color=None,width=4,both=False,head=True):
        pts=[]
        for i in range(81):
            t=i/80; q=1-t
            pts.append((q*q*q*p0[0]+3*q*q*t*p1[0]+3*q*t*t*p2[0]+t*t*t*p3[0],
                        q*q*q*p0[1]+3*q*q*t*p1[1]+3*q*t*t*p2[1]+t*t*t*p3[1]))
        if head: self.arrow(pts,color,width,both)
        else: self.line(pts,color or C["teal"],width)

    def route_label(self, x,y,text, size=21,color=None):
        f=ImageFont.truetype(FONT,size*S)
        w=self.d.textlength(text,font=f)/S
        self.box((x-10,y-3,x+w+10,y+size+13),C["bg"],radius=6)
        self.txt((x,y),text,size,color or C["muted"])

    def card(self,xy,tag,title,body,color,kind=None):
        x,y,x2,y2=xy
        self.box((x+3,y+5,x2+3,y2+5),"#e6dfd1",radius=23)
        self.box(xy,C["paper"],C["line"],radius=22)
        self.box((x+24,y+25,x+31,y2-25),color,radius=3)
        self.txt((x+53,y+24),tag.upper(),19,color,bold=True)
        title_size=32
        while self.d.textlength(title,font=ImageFont.truetype(BOLD,title_size*S))>(x2-x-80)*S:
            title_size-=1
        self.txt((x+53,y+60),title,title_size,bold=True)
        self.wrap((x+53,y+111),body,x2-x-88,24,C["muted"],gap=8)
        if kind: self.txt((x+53,y2-44),kind,20,color,bold=True)

    def save(self,name):
        self.im.resize(self.size,Image.Resampling.LANCZOS).save(OUT/name)


def cycle():
    p=Plate(1800,1100)
    p.txt((82,45),"Geometry returns through making",49,bold=True)
    p.txt((84,115),"Depicted form, embodied form, and new surface design can feed one another.",26,C["muted"])

    # The five principal relationships form a loop. Two are explicitly reciprocal.
    p.bezier((530,322),(575,300),(620,282),(662,282),both=True)
    p.bezier((1124,282),(1165,285),(1208,306),(1240,330),both=True)
    p.bezier((1480,486),(1480,548),(1440,589),(1380,640))
    p.arrow([(1060,754),(810,754)])
    p.bezier((385,640),(280,577),(275,528),(310,486))
    # A direct host-affordance link; not every new design requires wide circulation.
    p.bezier((1240,431),(1110,474),(941,552),(770,640),C["gold"],3)
    p.route_label(895,502,"Host affords new geometry",21,C["gold"])

    p.card((80,230,530,486),"Geometry depicted","Geometry marked",
           "Sketch · gesture · inscription\nA form appears on a surface.",C["teal"],"Mark ↔ making act")
    p.card((662,192,1124,440),"Geometry enacted","Making",
           "Tool · material · action\nForm, process, and constraint interact.",C["clay"],"Practice can change the form")
    p.card((1240,230,1720,486),"Geometry embodied","Invention",
           "Object · tool · host\nA vessel, seal, textile, or building.",C["teal"],"Form creates new surfaces")
    p.card((1060,640,1580,891),"Geometry encountered","Circulation & encounter",
           "Making, trade, use, copying,\nand repeated public exposure.",C["clay"],"Access and familiarity differ")
    p.card((285,640,810,891),"Geometry applied again","New geometry on / in host",
           "Pattern · border · motif\nThe host becomes a design field.",C["gold"],"A new study re-enters the cycle")

    p.txt((900,921),"RELATIONSHIPS TO INVESTIGATE ACROSS DIFFERENT HISTORIES",18,C["muted"],bold=True,anchor="mm")
    p.line([(82,951),(1718,951)],C["line"],2)
    p.txt((84,976),"Research model: each historical arrow requires evidence",27,bold=True)
    p.txt((84,1023),"Saturation: reach · frequency · affordability · participation",25,C["muted"])
    p.save("cycle-map.png")


def concept():
    p=Plate(1900,1350)
    p.txt((90,43),"One collection, five connected views",49,bold=True)
    p.txt((92,111),"Working definitions for this starter library; every view returns to specific records.",26,C["muted"])

    p.arrow([(440,335),(665,335)])
    p.route_label(460,287,"observed in",22)
    p.arrow([(1450,335),(1235,335)])
    p.route_label(1275,287,"compare",22)
    p.bezier((752,649),(811,586),(850,536),(875,488))
    p.route_label(757,536,"contextualize",22)
    p.arrow([(810,778),(1100,778)],C["gold"],3)
    p.route_label(847,726,"locate in history",21,C["gold"])
    # Return line runs outside the cards to avoid ambiguous crossings.
    p.bezier((1325,882),(1290,957),(55,993),(48,833),C["gold"],3,head=False)
    p.arrow([(48,833),(48,387),(80,387)],C["gold"],3)
    p.route_label(316,930,"New studies can become reusable cells and recipes",22,C["gold"])

    p.card((80,220,440,488),"Reusable units","Cells",
           "Marks, forms, and\ncompound units\nchosen for reuse.",C["teal"])
    p.card((665,195,1235,488),"Evidence-bearing objects","Situated artifacts",
           "Source image + specific region\nMaker, place, date, material,\ntechnique, and local meaning.",C["teal"],"One artifact can instantiate many forms")
    p.card((1450,220,1820,488),"Purposeful pairings","Comparisons",
           "Shared variable;\nvisible difference;\nlimits of comparison.",C["clay"])
    p.card((330,649,810,882),"Branches and encounters","Ornament histories",
           "Continuities, changes, transfers,\nrevivals, and selected evidence.",C["clay"])
    p.card((1100,649,1585,882),"Making and recirculation","Invention cycles",
           "Geometry ↔ tools and hosts\nCirculation → new design fields.",C["gold"])

    # Secondary crosswalk: preserve source entity identities and mark proposed additions.
    p.box((90,1012,1810,1285),"#eeeadf",C["line"],radius=20)
    p.txt((119,1031),"EXISTING ROSETTA IDENTITIES",20,C["teal"],bold=True)
    p.txt((1290,1031),"CANDIDATE ADDITIONS",20,C["clay"],bold=True)
    names=[("source_artifact",119,1078),("primitive_concept",505,1078),
           ("construction_recipe",891,1078),("carrier",119,1138),
           ("field",505,1138),("visual_asset",891,1138)]
    for text,x,y in names:
        p.box((x,y,x+365,y+46),C["paper"],"#bdcfc5",radius=10)
        p.txt((x+14,y+9),text,23,C["teal"],mono=True)
    p.txt((120,1210),"Preserve IDs; connect the same records across collection views.",23,C["muted"])
    p.line([(1270,1069),(1270,1252)],C["line"],2)
    for label,desc,y in [("region_reading","Where a form is observed",1078),
                         ("layer_instance","Where a cell is placed",1159)]:
        p.box((1291,y,1776,y+45),C["paper"],C["clay"],width=2,radius=10)
        p.txt((1305,y+9),label,23,C["clay"],mono=True)
        p.txt((1305,y+51),desc,20,C["muted"])
    p.txt((92,1303),"F(ge): making relations · M(ge): situated cultural readings; meaning requires context.",22,C["muted"])
    p.save("concept-map.png")


if __name__ == "__main__":
    cycle()
    concept()
    print(OUT/"cycle-map.png")
    print(OUT/"concept-map.png")
