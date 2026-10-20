"""Build the visual research atlas from the adjacent, portable catalog.

Dependencies: reportlab, Pillow. Run from any working directory.
Museum photographs retain their aspect ratios; sources and rights are in catalog.json.
The illustrated making studies are new constructions, not artifact reconstructions.
"""
from pathlib import Path
import json, math, textwrap, hashlib, zipfile, html
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Geometry-Ornament-Library.pdf'
BG='#f6f1e8'; INK='#233638'; TEAL='#3a756f'; CLAY='#a9573b'; GOLD='#b58b40'; MUTED='#68726c'; LINE='#d5cdbd'
W,H=1000,720
FONTDIR=Path('/usr/share/fonts/truetype/dejavu')
for name,fn in [('Atlas','DejaVuSans.ttf'),('AtlasBold','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONTDIR/fn)))
DATA=json.loads((ROOT/'catalog.json').read_text())
ARTS=DATA['artifacts']

def txt(v):
    if isinstance(v,list): return '; '.join(txt(x) for x in v)
    if isinstance(v,dict): return '; '.join(f'{k}: {txt(x)}' for k,x in v.items())
    return str(v or '').replace('\u2011','-').replace('\u2013','-').replace('\u2014',' - ')

def artifact(accession):
    return next(a for a in ARTS if a['accession']==accession)

def apath(a):
    f=a.get('image_file')
    return (ROOT/f) if f else None

c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
c.setTitle('Geometry, Ornament & Invention - Starter Library 0.1')
c.setAuthor('Geo-Art Research')
c.setSubject('Reusable geometric cells, situated artifacts, comparisons, ornament histories, and invention cycles')
PN=0

def text(s,x,y,size=12,color=INK,bold=False):
    c.setFillColor(HexColor(color));c.setFont('AtlasBold' if bold else 'Atlas',size);c.drawString(x,y,txt(s))

def para(s,x,top,width,size=12,color=INK,bold=False,leading=None):
    style=ParagraphStyle('p',fontName='AtlasBold' if bold else 'Atlas',fontSize=size,leading=leading or size*1.45,textColor=HexColor(color),spaceAfter=0)
    p=Paragraph(html.escape(txt(s)).replace('\n','<br/>'),style)
    _,h=p.wrap(width,1000);p.drawOn(c,x,top-h);return top-h

def link(s,url,x,y,width=880,size=9):
    bottom=para(s,x,y,width,size,TEAL)
    c.linkURL(url,(x,bottom-2,x+width,y+3),relative=0,thickness=0)
    return bottom

def image(path,x,y,w,h,border=False):
    path=Path(path)
    if not path.exists(): raise FileNotFoundError(path)
    iw,ih=Image.open(path).size
    f=min(w/iw,h/ih);dw,dh=iw*f,ih*f
    xx=x+(w-dw)/2;yy=y+(h-dh)/2
    c.drawImage(ImageReader(str(path)),xx,yy,dw,dh,mask='auto')
    if border:
        c.setStrokeColor(HexColor(LINE));c.setLineWidth(.5);c.rect(xx,yy,dw,dh,fill=0,stroke=1)

def panel(x,y,w,h,fill='#eee8dd'):
    c.setFillColor(HexColor(fill));c.roundRect(x,y,w,h,12,stroke=0,fill=1)

def header(title,sub,eyebrow):
    global PN
    if PN:c.showPage()
    PN+=1
    c.setFillColor(HexColor(BG));c.rect(0,0,W,H,stroke=0,fill=1)
    text('GEO-ART RESEARCH   /   SEED COLLECTION 0.1',48,H-34,9,TEAL,True)
    text(eyebrow.upper(),710,H-34,9,MUTED)
    text(title,48,H-82,29,INK,True)
    para(sub,50,H-100,900,11.5,MUTED)
    c.setStrokeColor(HexColor(LINE));c.setLineWidth(.7);c.line(48,46,W-48,46)
    text('GEOMETRY  /  ORNAMENT  /  INVENTION',48,29,8,MUTED)
    text('20 OCT 2026',785,29,8,MUTED)
    text(f'{PN:02d}',927,29,9,TEAL,True)

def label_art(a,x,top,w,short=None,size=12):
    y=para(short or a['title'],x,top,w,size,INK,True)
    y=para(f"{a['culture']}  |  {a['date']}",x,y-6,w,9.5,MUTED)
    y=link(f"{a['institution']}  /  {a['accession']}",a['source_url'],x,y-8,w,8)
    return y

def art_image(acc,x,y,w,h):
    a=artifact(acc);p=apath(a)
    if not p:raise ValueError('No cleared image for '+acc)
    image(p,x,y,w,h)
    return a

def pill(s,x,y,w=162,fill=TEAL):
    panel(x,y,w,32,fill)
    text(s,x+12,y+11,10,'#ffffff',True)

def bullet(s,x,top,w,color=TEAL,size=11):
    c.setFillColor(HexColor(color));c.circle(x+3,top-7,2.2,stroke=0,fill=1)
    return para(s,x+16,top,w-16,size,INK)-10

# 1 -- cells as usable visual objects
header('A library of things to make with','Twelve selectable cells. Each retains a construction, variable features, and possible uses at more than one scale.','01 / CELLS')
image(ROOT/'assets/cells-plate.png',72,132,856,455)
for s,x in zip(['Cells','Cultural artifacts','Comparisons','Ornament histories','Invention cycles'],[48,232,416,600,784]):
    pill(s,x,75,168,TEAL if x in [48,784] else '#6f7668')

# 2 -- a compound can be reused without flattening
header('The same geometry changes its role','One arc can be a stroke, part of a depicted form, and an organizing component of a larger composition.','02 / MAKING')
image(ROOT/'assets/layering-plate.png',40,312,920,285)
roles=[('AS A MARK','Draw a curved stroke; control its sweep and pressure.'),('AS A FORM','Combine arcs to bound a petal or describe a rounded object.'),('AS AN ORGANIZER','Reflect, turn and space instances to create a larger arrangement.'),('AS A REUSABLE WHOLE','Select the compound again; keep its components available for editing.')]
for i,(h,b) in enumerate(roles):
    x=52+(i%2)*470;y=194-(i//2)*107
    text(h,x,y+57,10,TEAL,True);para(b,x,y+40,430,12)
para('Working definition: a cell is atomic for the present construction task. A compound cell can remain internally decomposable.',52,79,896,10,MUTED)

# 3 -- ceramic comparison
header('Rounded vessels, different painted choices','Comparison A holds the painted ceramic carrier roughly constant. These three objects come from different periods.','03 / COMPARISON')
accs=['49.133.2','10.130.1174','1992.165.9']
shorts=['Concentric rings + curved pairs','Angular strokes + repeated bands','Curved shoulder + angular neck']
for i,(acc,short) in enumerate(zip(accs,shorts)):
    x=48+i*307
    a=art_image(acc,x,296,290,285)
    label_art(a,x,273,286,short)
    if i==0:body='Follow the rim. Locate the center-facing curved groups. Their lunar meaning is not established.'
    elif i==1:body='Follow one angled stroke. Notice how small freehand units organize a rounded wall.'
    else:body='Compare the shoulder and neck. Curved and angular fields coexist within one object.'
    para(body,x,173,285,11)
panel(48,65,904,49)
para('Studio question: how much does the carrier guide the design, and where does the maker choose to cooperate with or oppose its geometry?',65,100,865,11,TEAL,True)

# 4 -- contemporary comparison + executable mathematics
header('One reproductive tool, two compositions','Comparison B: approximately contemporary hematite cylinders from Old Babylonian and Old Syrian contexts.','04 / TOOL + IMAGE')
for i,(acc,title) in enumerate([('1991.368.1','Standing sequence'),('1991.368.5','Tiered figures + astral cluster')]):
    x=48+i*462
    a=art_image(acc,x,323,440,250)
    label_art(a,x,306,437,title)
text('MODERN MAKING STUDY',55,191,10,TEAL,True)
para('Wrap a drawn strip around a cylinder, then compare the wrapped design with its flat arrangement.',55,173,425,12)
para('For an ideal cylinder rolling without slipping: one full turn advances 2πr. The unwrapped lateral surface is a rectangle of height h and width 2πr.',55,122,425,11)
panel(532,70,414,135)
c.setStrokeColor(HexColor(TEAL));c.setLineWidth(2)
c.ellipse(550,118,615,171,stroke=1,fill=0);c.ellipse(550,83,615,136,stroke=1,fill=0);c.line(550,109,550,144);c.line(615,109,615,144)
c.rect(690,104,220,72,fill=0,stroke=1);c.line(635,139,676,139);c.line(667,146,676,139);c.line(667,132,676,139)
text('2πr',775,86,11,TEAL);text('h',921,134,11,TEAL);text('Modern impressions are shown in the photographs.',550,190,8,MUTED)

# 5 -- iconography versus resemblance
header('From geometric resemblance to a situated sign','The library keeps the observed form, the museum attribution, and a proposed interpretation separately addressable.','05 / ICONOGRAPHY')
a=art_image('1991.368.5',48,320,444,245);label_art(a,48,299,434,'Disk, crescent and stars in a seal field')
b=art_image('40.181.1',530,269,418,301);label_art(b,530,251,418,'A star-shaped carrier containing figures')
panel(48,68,904,126)
text('LINKED REFERENCE: BABYLONIAN KUDURRU',65,169,10,TEAL,True)
para('The British Museum identifies Shamash’s solar disk, Sin’s crescent and Ishtar’s eight-pointed star on land-grant record 1907,1014.1 (1125-1100 BCE). These are object-specific iconographic attributions.',65,151,864,11)
link('Open the museum-authored object record. Its photograph is linked rather than reproduced in this atlas.',artifact('1907,1014.1')['source_url'],65,101,860,9)
para('The curved marks on the earlier Ubaid bowl have not thereby acquired the same identity or meaning.',65,79,858,9,MUTED)

# 6 -- architecture as a new geometric host
header('An invention offers new surfaces to design','A shaped ceramic tile and a cut-tile architectural niche expose different possible meanings of “cell.”','06 / HOST + ORNAMENT')
a=art_image('39.20',45,128,490,451)
label_art(a,52,109,480,'Mihrab: many pieces form a larger field',10.5)
b=art_image('40.181.1',596,346,294,234)
label_art(b,556,326,390,'Whole tile as a shaped carrier',11)
y=231
for s in ['Physical unit: a piece of glazed ceramic.','Visual unit: a motif assembled from several pieces.','Composition: frames, corners, inscriptions and curved fields.']:
    y=bullet(s,556,y,384,size=11)
para('These Iranian examples differ in date and function. The pair establishes a comparison, not a proven direct lineage.',556,101,388,10,MUTED)

# 7 -- portable host
header('A fold can participate in composition','Apsaalooke (Crow) parfleche, c. 1900: geometric painting organized across a portable, closing carrier.','07 / MATERIAL CULTURE')
a=art_image('1937.848',54,161,583,407)
label_art(a,57,142,582,'Painted leather container',11)
text('LOOK AT THE CLOSURE',680,539,11,TEAL,True)
y=512
for s in ['Two painted flap fields meet near a central seam.','Triangular color fields and diagonal bands relate to those boundaries.','Folding changes which parts can be seen together.']:
    y=bullet(s,677,y,269,size=12)
panel(672,151,272,140)
text('DRAWING STUDY',689,266,10,TEAL,True)
para('Design on a folded sheet. Open it, close it and rotate it. Decide what should align at the seam.',689,248,235,11)
para('The precise history and meanings belong to the named community and object. This is not a claim about an uninterrupted “never settled” society.',679,127,264,9.5,MUTED)

# 8 -- Morris process, limits of diffusion claim
header('Design and production reshape one another','Strawberry Thief: William Morris’s 1883 design, represented here by a later printed example, c. 1936.','08 / TOOLS + CIRCULATION')
a=art_image('1937.696',54,167,505,416);label_art(a,54,147,505,'Repeat organization carries figurative ornament',11)
text('A DOCUMENTED PROCESS LOOP',612,546,11,TEAL,True)
y=520
for s in ['Observe and draw a motif.','Organize a repeat.','Experiment with dye and printing.','Use improved process control for further designs.','Circulate the pattern through furnishings and later uses.']:
    y=bullet(s,609,y,332,size=11.5)
panel(605,145,339,131)
para('A crucial distinction',622,257,305,12,TEAL,True)
para('The design was commercially successful and expensive to produce. Recognition, ownership and the ability to make it are different forms of access.',622,231,300,11)
link('Process evidence: Victoria and Albert Museum', 'https://www.vam.ac.uk/articles/willam-morris-textiles',612,119,325,9)
link('Cost evidence: William Morris Gallery','https://wmgallery.org.uk/object/strawberry-thief/',612,94,325,9)

# 9 -- history as branching access
header('Ornament itself becomes a design technology','Owen Jones’s 1856 sourcebook carried sampled ornament into printed plates, teaching and further making.','09 / ORNAMENT HISTORIES')
a=art_image('1997.109.1',45,156,492,423);label_art(a,52,137,481,'The Grammar of Ornament: a historical comparative sourcebook',11)
text('OPEN HISTORICAL THREADS',572,548,11,TEAL,True)
episodes=[('6th-5th millennium BCE','Painted geometry organized on Ubaid pottery.'),('Early 2nd millennium BCE','Cylindrical carving reproduces imagery in clay.'),('1211-12 / 1354-55 CE','Shaped tiles and architectural cut-tile fields.'),('1856','Chromolithographic ornament sourcebook.'),('1883 / later impressions','Repeat design and textile production.'),('c. 1900','Portable painted container in a Plains tradition.')]
y=519
for date,s in episodes:
    text(date,574,y,10,CLAY,True);y=para(s,574,y-12,365,10.5)-17
para('These are entry points in several histories. They do not rank cultures or establish a single progression from simple to advanced.',574,99,365,10,MUTED)

# 10 -- recursive cycle
header('Geometry returns through what people make','The same case can be studied as marked geometry, embodied geometry, and new ornament applied to an invented host.','10 / RECURSION')
image(ROOT/'assets/cycle-map.png',48,72,904,502)

# 11 -- actual conceptual crosswalk
header('Five collections, one connected investigation','The proposed map connects to the existing Primitive Engine Rosetta Stone while preserving each record’s evidence and identity.','11 / CONCEPTUAL MAP')
image(ROOT/'assets/concept-map.png',48,68,904,513)

# 12 -- purposeful practical start
header('Observe, rebuild, redesign','Record what a learner notices separately from what they can execute with a particular tool. These are proposed studies, not age ceilings.','12 / STUDIO')
studies=[('49.133.2','1 / A CURVED CELL','Find one repeated curved unit. Rebuild it with a cup, compass or freehand arc. Vary count, scale or orientation once.','Math: radius, angle, spacing and relative size.'),('10.130.1174','2 / A LINE BECOMES A FIELD','Find the stroke families. Make a small hatch patch; repeat or rotate it. Then wrap a hatch field around a drawn round form.','Math: orientation, intersections and density.'),('1937.848','3 / THE HOST CHANGES THE DESIGN','Draw a repeat on a sheet. Fold it into a simple container. Redesign the border so the closure participates in the pattern.','Math: reflection, alignment, boundary and nets.')]
for i,(acc,title,body,maths) in enumerate(studies):
    x=48+i*307
    art_image(acc,x,374,288,201)
    text(title,x,353,10,TEAL,True)
    y=para(body,x,331,286,12)
    para(maths,x,y-15,283,11,CLAY)
panel(48,73,904,79)
para('For ages 8-10 through adult: keep the same visual problem; vary the support, precision, number of interacting relations and explanation requested. Observe actual readiness rather than assigning a fixed ceiling.',65,134,867,11)

# 13 -- source register
header('Object register and image credits','All reproduced museum photographs are identified as public domain or open access by their source pages. The kudurru is a linked reference.','13 / SOURCES')
y=579
for i,a in enumerate(ARTS,1):
    title=f"{i:02d}   {a['title']}  |  {a['accession']}"
    if len(title)>119:title=title[:116]+'...'
    text(title,51,y,9.2,INK,True)
    y=para(f"{a['institution']} · {a['date']} · {a.get('credit','')}",70,y-10,871,8.4,MUTED)-1
    y=link(a['source_url'],a['source_url'],70,y,871,7.9)-11
    if y<61:raise RuntimeError('Object register overflow')

# 14 -- research contract
header('How this library grows','An image enters with its source. A useful reading becomes a candidate. New studio constructions stay distinguishable from historical evidence.','14 / RESEARCH NOTES')
text('FOUR CONNECTED READINGS',54,567,11,TEAL,True)
items=[('What is visible','The region, contours, repetitions, materials and photographic limitations.'),('What the source says','Attribution, date, production, use and documented iconographic identity.'),('What we propose','A geometric model, compositional interpretation, studio exercise or historical connection.'),('What a learner experiences','A situated report of attention, feeling, preference, recognition or execution.')]
y=541
for title,b in items:
    text(title,54,y,12,INK,True);y=para(b,54,y-15,435,11)-21
text('CONNECTION TO FGE',549,567,11,TEAL,True)
y=541
for s in ['prim / GEA: abstract form; a stabilized GEM can also become a reusable unit.','prepared_prim: the form has a material carrier.','F(ge): examine primitive, force, motion and duration in actual making.','M(ge): examine aesthetic, metaphorical and cultural readings.','epoch_recursion: investigate how a stabilized invention can become a component for later making.']:
    y=bullet(s,546,y,401,size=10.5)
para('Source: FGE-Syntax.txt, supplied project reference, read 20 October 2026. Its vocabulary informs this crosswalk; its individual historical and physical examples require their own verification.',549,y-1,395,9.5,MUTED)
panel(49,76,899,100)
text('NEXT EVIDENCE TO ADD',66,152,10,TEAL,True)
para('Object-specific wave and spiral identifications; more than one sample per locality and period; maker/community-authored accounts; tool traces and workshop records; distribution and access data; learner observations and controlled variation studies.',66,132,863,11)
link('Art technique: Getty formal analysis','https://www.getty.edu/education/teachers/building_lessons/formal_analysis.html',66,98,420,8.5)
link('Drawing term: National Portrait Gallery, hatching','https://www.npg.org.uk/collections/explore/glossary-of-art-terms/hatching1',499,98,420,8.5)
c.save()

# Standalone comparison plate for the conversation and database.
scale=1
P=Image.new('RGB',(2100,1000),BG);d=ImageDraw.Draw(P)
def pf(n,b=False):return ImageFont.truetype(str(FONTDIR/('DejaVuSans-Bold.ttf' if b else 'DejaVuSans.ttf')),n)
d.text((60,40),'ROUNDED CARRIERS / DIFFERENT PAINTED CHOICES',font=pf(40,True),fill=INK)
d.text((63,105),'A diachronic comparison: host, motif, arrangement and making remain separate questions.',font=pf(24),fill=MUTED)
for i,(acc,short) in enumerate(zip(accs,shorts)):
    a=artifact(acc);im=Image.open(apath(a)).convert('RGB');im.thumbnail((610,540),Image.Resampling.LANCZOS)
    x=60+i*690;P.paste(im,(x+(610-im.width)//2,179+(540-im.height)//2))
    d.text((x,751),short,font=pf(25,True),fill=INK)
    yy=796
    for line in textwrap.wrap(txt(a['culture']),41):d.text((x,yy),line,font=pf(21),fill=MUTED);yy+=29
    d.text((x,yy+5),txt(a['date']),font=pf(21),fill=CLAY)
    d.text((x,yy+39),'The Met | '+a['accession']+' | Public Domain',font=pf(17),fill=MUTED)
d.text((61,963),'New comparative arrangement. Full object records and image credits are retained in the catalog.',font=pf(18),fill=TEAL)
P.save(ROOT/'assets/carrier-comparison.png',optimize=True)

# A user-facing packet of transparent layers and their registry; no runtime wiring implied.
with zipfile.ZipFile(ROOT/'Geometry-Cells-Layers.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted((ROOT/'assets/cells').glob('*.png')):z.write(p,'cells/'+p.name)
    z.writestr('CELL-REGISTRY.json',json.dumps({'version':'0.1.0','status':'candidate','cells':DATA['cells']},ensure_ascii=False,indent=2))
    z.writestr('READ-ME.txt','12 transparent 800 x 800 PNG studio cells. These are new geometric studies, not historical reconstructions.\n\nUse each PNG as an independently positioned, rotated and scaled layer. Preserve a reference to its cell ID when building a compound.\n\nThe full source-backed collection and construction script are in ArtisanalCanvas/docs/sacred-geometry/geometry-ornament-library/.\n')
print(json.dumps({'pdf':str(OUT),'pages':PN,'layer_pngs':len(list((ROOT/'assets/cells').glob('*.png'))),'artifacts':len(ARTS),'comparison_plate':str(ROOT/'assets/carrier-comparison.png')},indent=2))
