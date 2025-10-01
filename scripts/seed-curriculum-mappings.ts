import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { curriculumMapping, historicalPeriodContent } from "../shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Curriculum weightings by grade level from the attachment
const curriculumWeightings: Record<string, Array<{period: string, weight: number, focus: string[]}>> = {
  'K': [
    { period: 'prehistory', weight: 20, focus: ['play-based', 'patterns', 'symmetry', 'tactile'] },
    { period: 'egypt', weight: 15, focus: ['patterns', 'borders', 'straight lines'] },
    { period: 'indus', weight: 10, focus: ['patterns', 'borders'] },
    { period: 'china', weight: 10, focus: ['patterns', 'nature motifs'] },
    { period: 'mesoamerica', weight: 10, focus: ['patterns', 'geometric forms'] },
    { period: 'greece', weight: 8, focus: ['straight vs curved', 'basic shapes'] },
    { period: 'rome', weight: 7, focus: ['arches', 'right angles'] },
    { period: 'byzantine', weight: 5, focus: ['radial patterns'] },
    { period: 'islamic', weight: 7, focus: ['tessellations', 'symmetry'] },
    { period: 'medieval', weight: 5, focus: ['interlace patterns'] },
    { period: 'renaissance', weight: 2, focus: ['basic perspective'] },
    { period: 'modern', weight: 1, focus: ['abstract shapes'] },
  ],
  '1': [
    { period: 'prehistory', weight: 10, focus: ['patterns', 'symmetry'] },
    { period: 'mesopotamia', weight: 8, focus: ['ziggurats', 'steps'] },
    { period: 'egypt', weight: 12, focus: ['pyramids', 'triangles'] },
    { period: 'indus', weight: 8, focus: ['seals', 'patterns'] },
    { period: 'china', weight: 10, focus: ['dragons', 'curves'] },
    { period: 'mesoamerica', weight: 10, focus: ['aztec patterns', 'maya numbers'] },
    { period: 'greece', weight: 10, focus: ['columns', 'right angles'] },
    { period: 'rome', weight: 8, focus: ['arches', 'engineering'] },
    { period: 'byzantine', weight: 6, focus: ['domes', 'circles'] },
    { period: 'islamic', weight: 8, focus: ['geometric patterns'] },
    { period: 'medieval', weight: 6, focus: ['castles', 'towers'] },
    { period: 'renaissance', weight: 3, focus: ['depth', 'space'] },
    { period: 'modern', weight: 1, focus: ['abstract forms'] },
  ],
  '2': [
    { period: 'mesopotamia', weight: 10, focus: ['vocabulary', 'classification'] },
    { period: 'egypt', weight: 10, focus: ['hieroglyphs', 'symbols'] },
    { period: 'indus', weight: 10, focus: ['city grids', 'planning'] },
    { period: 'china', weight: 10, focus: ['tangrams', 'puzzles'] },
    { period: 'mesoamerica', weight: 10, focus: ['calendar', 'cycles'] },
    { period: 'greece', weight: 12, focus: ['golden ratio introduction'] },
    { period: 'rome', weight: 10, focus: ['mosaics', 'tilings'] },
    { period: 'byzantine', weight: 6, focus: ['radial symmetry'] },
    { period: 'islamic', weight: 10, focus: ['star patterns'] },
    { period: 'medieval', weight: 6, focus: ['rose windows'] },
    { period: 'renaissance', weight: 4, focus: ['proportion basics'] },
    { period: 'modern', weight: 1, focus: ['cubism basics'] },
    { period: 'biomimicry', weight: 1, focus: ['nature patterns'] },
  ],
  '3': [
    { period: 'mesopotamia', weight: 8, focus: ['cuneiform angles'] },
    { period: 'egypt', weight: 8, focus: ['pyramid construction'] },
    { period: 'indus', weight: 8, focus: ['urban planning'] },
    { period: 'china', weight: 8, focus: ['symmetry in art'] },
    { period: 'mesoamerica', weight: 8, focus: ['step pyramids'] },
    { period: 'greece', weight: 14, focus: ['parthenon proportions'] },
    { period: 'rome', weight: 12, focus: ['aqueduct angles'] },
    { period: 'byzantine', weight: 6, focus: ['dome construction'] },
    { period: 'islamic', weight: 12, focus: ['tessellation rules'] },
    { period: 'medieval', weight: 6, focus: ['gothic arches'] },
    { period: 'renaissance', weight: 6, focus: ['horizon lines'] },
    { period: 'modern', weight: 2, focus: ['geometric abstraction'] },
    { period: 'biomimicry', weight: 2, focus: ['fibonacci in nature'] },
  ],
  '4': [
    { period: 'greece', weight: 14, focus: ['formal vocabulary', 'measurement'] },
    { period: 'rome', weight: 12, focus: ['scale', 'proportion'] },
    { period: 'byzantine', weight: 8, focus: ['circular divisions'] },
    { period: 'islamic', weight: 16, focus: ['complex tessellations'] },
    { period: 'medieval', weight: 8, focus: ['manuscript geometry'] },
    { period: 'china', weight: 8, focus: ['compass constructions'] },
    { period: 'mesopotamia', weight: 6, focus: ['architectural scale'] },
    { period: 'egypt', weight: 6, focus: ['pyramid mathematics'] },
    { period: 'indus', weight: 6, focus: ['standardized measures'] },
    { period: 'mesoamerica', weight: 6, focus: ['astronomical alignment'] },
    { period: 'renaissance', weight: 6, focus: ['linear perspective'] },
    { period: 'modern', weight: 2, focus: ['coordinate geometry'] },
    { period: 'biomimicry', weight: 2, focus: ['natural proportions'] },
  ],
  '5': [
    { period: 'greece', weight: 12, focus: ['golden ratio', 'proportions'] },
    { period: 'rome', weight: 12, focus: ['engineering precision'] },
    { period: 'byzantine', weight: 8, focus: ['pendentive geometry'] },
    { period: 'islamic', weight: 18, focus: ['girih patterns', 'complex tilings'] },
    { period: 'medieval', weight: 8, focus: ['cathedral geometry'] },
    { period: 'china', weight: 6, focus: ['garden design'] },
    { period: 'mesopotamia', weight: 5, focus: ['ziggurat proportions'] },
    { period: 'egypt', weight: 5, focus: ['sacred geometry'] },
    { period: 'indus', weight: 5, focus: ['water systems'] },
    { period: 'mesoamerica', weight: 5, focus: ['pyramid alignment'] },
    { period: 'renaissance', weight: 8, focus: ['perspective rules'] },
    { period: 'modern', weight: 3, focus: ['mathematical art'] },
    { period: 'biomimicry', weight: 3, focus: ['spiral geometry'] },
  ],
  '6': [
    { period: 'greece', weight: 12, focus: ['transformations', 'similarity'] },
    { period: 'rome', weight: 10, focus: ['arch construction'] },
    { period: 'byzantine', weight: 6, focus: ['dome transformations'] },
    { period: 'islamic', weight: 18, focus: ['transformation geometry'] },
    { period: 'medieval', weight: 6, focus: ['vault geometry'] },
    { period: 'renaissance', weight: 10, focus: ['1-point perspective'] },
    { period: 'china', weight: 6, focus: ['isometric views'] },
    { period: 'mesopotamia', weight: 4, focus: ['stepped forms'] },
    { period: 'egypt', weight: 4, focus: ['proportional grids'] },
    { period: 'indus', weight: 4, focus: ['modular design'] },
    { period: 'mesoamerica', weight: 6, focus: ['corbel arches'] },
    { period: 'modern', weight: 8, focus: ['design briefs'] },
    { period: 'biomimicry', weight: 6, focus: ['structural forms'] },
  ],
  '7': [
    { period: 'greece', weight: 10, focus: ['circle geometry', 'proofs'] },
    { period: 'rome', weight: 8, focus: ['dome engineering'] },
    { period: 'byzantine', weight: 5, focus: ['squaring the circle'] },
    { period: 'islamic', weight: 16, focus: ['geometric proofs'] },
    { period: 'medieval', weight: 5, focus: ['compass constructions'] },
    { period: 'renaissance', weight: 12, focus: ['2-point perspective'] },
    { period: 'china', weight: 5, focus: ['projection methods'] },
    { period: 'mesopotamia', weight: 3, focus: ['astronomical geometry'] },
    { period: 'egypt', weight: 3, focus: ['pyramid theorems'] },
    { period: 'indus', weight: 3, focus: ['drainage angles'] },
    { period: 'mesoamerica', weight: 6, focus: ['eclipse predictions'] },
    { period: 'modern', weight: 12, focus: ['CAD basics'] },
    { period: 'biomimicry', weight: 12, focus: ['optimization'] },
  ],
  '8': [
    { period: 'greece', weight: 8, focus: ['multi-step proofs'] },
    { period: 'rome', weight: 6, focus: ['structural analysis'] },
    { period: 'byzantine', weight: 4, focus: ['complex domes'] },
    { period: 'islamic', weight: 14, focus: ['aperiodic tilings'] },
    { period: 'medieval', weight: 4, focus: ['flying buttresses'] },
    { period: 'renaissance', weight: 12, focus: ['3-point perspective'] },
    { period: 'china', weight: 4, focus: ['axonometric projection'] },
    { period: 'mesopotamia', weight: 2, focus: ['surveying'] },
    { period: 'egypt', weight: 2, focus: ['construction methods'] },
    { period: 'indus', weight: 2, focus: ['urban grids'] },
    { period: 'mesoamerica', weight: 6, focus: ['complex calendars'] },
    { period: 'modern', weight: 18, focus: ['parametric design'] },
    { period: 'biomimicry', weight: 18, focus: ['bio-inspired design'] },
  ],
};

// Historical periods data
const historicalPeriods = [
  {
    periodId: 'prehistory',
    periodName: 'Prehistory',
    dateRange: '70,000 - 3,500 BCE',
    description: 'Early human art and pattern-making, cave paintings, stone tools',
    artPatterns: { motifs: ['spirals', 'handprints', 'animal forms'], techniques: ['pigment on stone'] },
    mathematicalConcepts: { concepts: ['counting', 'basic shapes', 'pattern recognition'] },
  },
  {
    periodId: 'mesopotamia',
    periodName: 'Mesopotamia',
    dateRange: '3,500 - 539 BCE',
    description: 'Cradle of civilization, cuneiform writing, ziggurats',
    artPatterns: { motifs: ['ziggurats', 'cuneiform angles', 'cylinder seals'], techniques: ['clay tablets', 'relief carving'] },
    mathematicalConcepts: { concepts: ['base-60 numbers', 'angles', 'architectural planning'] },
  },
  {
    periodId: 'egypt',
    periodName: 'Ancient Egypt',
    dateRange: '3,100 - 30 BCE',
    description: 'Pyramids, hieroglyphs, golden ratio in art',
    artPatterns: { motifs: ['pyramids', 'hieroglyphs', 'lotus', 'scarab'], techniques: ['relief', 'painting', 'sculpture'] },
    mathematicalConcepts: { concepts: ['pyramid geometry', 'golden ratio', 'unit fractions'] },
  },
  {
    periodId: 'indus',
    periodName: 'Indus Valley',
    dateRange: '3,300 - 1,300 BCE',
    description: 'Urban planning, standardized measurements, seals',
    artPatterns: { motifs: ['seals', 'geometric patterns', 'animal forms'], techniques: ['seal carving', 'pottery'] },
    mathematicalConcepts: { concepts: ['urban grids', 'standardized weights', 'drainage angles'] },
  },
  {
    periodId: 'china',
    periodName: 'Ancient China',
    dateRange: '2,070 BCE - 220 CE',
    description: 'Dragons, nature motifs, tangrams, compass use',
    artPatterns: { motifs: ['dragons', 'clouds', 'mountains', 'tangrams'], techniques: ['ink painting', 'bronze casting'] },
    mathematicalConcepts: { concepts: ['tangrams', 'compass constructions', 'magic squares'] },
  },
  {
    periodId: 'mesoamerica',
    periodName: 'Mesoamerica',
    dateRange: '2,000 BCE - 1,500 CE',
    description: 'Maya, Aztec, complex calendars, step pyramids',
    artPatterns: { motifs: ['feathered serpent', 'jaguar', 'geometric patterns'], techniques: ['stone carving', 'murals'] },
    mathematicalConcepts: { concepts: ['vigesimal system', 'calendar mathematics', 'astronomical alignment'] },
  },
  {
    periodId: 'greece',
    periodName: 'Ancient Greece',
    dateRange: '800 - 146 BCE',
    description: 'Golden ratio, Parthenon, geometric proofs',
    artPatterns: { motifs: ['meander', 'palmette', 'acanthus'], techniques: ['marble sculpture', 'red-figure pottery'] },
    mathematicalConcepts: { concepts: ['golden ratio', 'Euclidean geometry', 'platonic solids'] },
  },
  {
    periodId: 'rome',
    periodName: 'Roman Empire',
    dateRange: '753 BCE - 476 CE',
    description: 'Engineering, arches, aqueducts, mosaics',
    artPatterns: { motifs: ['laurel', 'eagle', 'geometric mosaics'], techniques: ['fresco', 'mosaic', 'concrete'] },
    mathematicalConcepts: { concepts: ['arch geometry', 'engineering', 'surveying'] },
  },
  {
    periodId: 'byzantine',
    periodName: 'Byzantine Empire',
    dateRange: '330 - 1453 CE',
    description: 'Domes, pendentives, radial patterns',
    artPatterns: { motifs: ['chi-rho', 'peacock', 'vine scrolls'], techniques: ['mosaic', 'icon painting'] },
    mathematicalConcepts: { concepts: ['dome geometry', 'pendentives', 'squaring the circle'] },
  },
  {
    periodId: 'islamic',
    periodName: 'Islamic Golden Age',
    dateRange: '750 - 1258 CE',
    description: 'Geometric patterns, tessellations, girih tiles',
    artPatterns: { motifs: ['arabesques', 'calligraphy', 'geometric stars'], techniques: ['tile work', 'stucco'] },
    mathematicalConcepts: { concepts: ['tessellations', 'girih patterns', 'transformation geometry'] },
  },
  {
    periodId: 'medieval',
    periodName: 'Medieval Europe',
    dateRange: '476 - 1453 CE',
    description: 'Gothic architecture, rose windows, manuscript illumination',
    artPatterns: { motifs: ['quatrefoil', 'trefoil', 'interlace'], techniques: ['stained glass', 'illumination'] },
    mathematicalConcepts: { concepts: ['gothic arches', 'rose window geometry', 'compass constructions'] },
  },
  {
    periodId: 'renaissance',
    periodName: 'Renaissance',
    dateRange: '1300 - 1600 CE',
    description: 'Linear perspective, proportion, mathematical art',
    artPatterns: { motifs: ['perspective grids', 'classical orders'], techniques: ['oil painting', 'sfumato'] },
    mathematicalConcepts: { concepts: ['linear perspective', 'proportion', 'vanishing points'] },
  },
  {
    periodId: 'modern',
    periodName: 'Modern/Contemporary',
    dateRange: '1900 - Present',
    description: 'Abstract geometry, CAD, parametric design',
    artPatterns: { motifs: ['geometric abstraction', 'fractals'], techniques: ['digital art', 'generative design'] },
    mathematicalConcepts: { concepts: ['coordinate geometry', 'parametric equations', 'computational geometry'] },
  },
  {
    periodId: 'biomimicry',
    periodName: 'Biomimicry',
    dateRange: 'Timeless',
    description: 'Nature-inspired patterns and structures',
    artPatterns: { motifs: ['fibonacci spirals', 'fractals', 'cellular patterns'], techniques: ['bio-inspired design'] },
    mathematicalConcepts: { concepts: ['fibonacci sequence', 'golden spiral', 'optimization'] },
  },
];

async function seedCurriculumData() {
  try {
    console.log('Seeding historical period content...');
    
    // Seed historical periods
    for (const period of historicalPeriods) {
      try {
        await db.insert(historicalPeriodContent).values(period);
      } catch (e) {
        // Skip if already exists
      }
    }
    
    console.log('Seeding curriculum mappings...');
    
    // Seed curriculum mappings for each grade
    for (const [grade, mappings] of Object.entries(curriculumWeightings)) {
      for (const mapping of mappings) {
        try {
          await db.insert(curriculumMapping).values({
            gradeLevel: grade,
            historicalPeriod: mapping.period,
            timeWeighting: mapping.weight.toString(),
            focusAreas: mapping.focus,
            objectives: {
              mainObjectives: mapping.focus,
              gradeSpecific: `Grade ${grade} objectives for ${mapping.period}`,
            }
          });
        } catch (e) {
          // Skip if already exists
        }
      }
    }
    
    console.log('✅ Curriculum data seeded successfully!');
  } catch (error) {
    console.error('Error seeding curriculum data:', error);
  }
}

seedCurriculumData();