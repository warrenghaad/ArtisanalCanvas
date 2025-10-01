import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create deep directory structure for eTextbooks
function createEtextbookStructure() {
  const baseDir = path.join(path.dirname(__dirname), 'etextbooks');
  
  // Main structure
  const structure = {
    'content': {
      'perspective-drawing': {
        'phase-01-foundation-orientation': createPhaseStructure(1, 'Foundation Orientation', [
          { id: 'module-01-horizon-line', title: 'Horizon Line Concepts', lessons: 5 },
          { id: 'module-02-picture-plane', title: 'Picture Plane Understanding', lessons: 4 },
          { id: 'module-03-eye-level', title: 'Eye Level Principles', lessons: 3 }
        ]),
        'phase-02-single-point-perspective': createPhaseStructure(2, 'Single Point Perspective', [
          { id: 'module-01-measuring-lines', title: 'Measuring Lines', lessons: 6 },
          { id: 'module-02-depth-intervals', title: 'Depth Intervals', lessons: 5 },
          { id: 'module-03-tile-grids', title: 'Tile Floor Grids', lessons: 4 }
        ]),
        'phase-03-two-point-perspective': createPhaseStructure(3, 'Two Point Perspective', [
          { id: 'module-01-double-vp', title: 'Double Vanishing Points', lessons: 7 },
          { id: 'module-02-rotating-forms', title: 'Rotating Forms', lessons: 5 },
          { id: 'module-03-interior-spaces', title: 'Interior Spaces', lessons: 6 }
        ]),
        'phase-04-incline-decline': createPhaseStructure(4, 'Incline and Decline', [
          { id: 'module-01-auxiliary-vp', title: 'Auxiliary Vanishing Points', lessons: 5 },
          { id: 'module-02-staircases', title: 'Staircases and Ramps', lessons: 4 },
          { id: 'module-03-tilted-planes', title: 'Tilted Planes', lessons: 3 }
        ]),
        'phase-05-three-point-perspective': createPhaseStructure(5, 'Three Point Perspective', [
          { id: 'module-01-vertical-vp', title: 'Vertical Vanishing Point', lessons: 5 },
          { id: 'module-02-looking-up', title: 'Looking Up Views', lessons: 4 },
          { id: 'module-03-looking-down', title: 'Looking Down Views', lessons: 4 }
        ]),
        'phase-06-circle-cylinder': createPhaseStructure(6, 'Circles and Cylinders', [
          { id: 'module-01-ellipses', title: 'Ellipse Construction', lessons: 6 },
          { id: 'module-02-cylinders', title: 'Cylinder Forms', lessons: 5 },
          { id: 'module-03-complex-curves', title: 'Complex Curves', lessons: 4 }
        ]),
        'phase-07-proportional-transfer': createPhaseStructure(7, 'Proportional Transfer', [
          { id: 'module-01-scale-grids', title: 'Scale Grids', lessons: 5 },
          { id: 'module-02-human-proportions', title: 'Human Proportions', lessons: 6 },
          { id: 'module-03-architectural-scale', title: 'Architectural Scale', lessons: 5 }
        ]),
        'phase-08-scene-synthesis': createPhaseStructure(8, 'Scene Synthesis', [
          { id: 'module-01-composition', title: 'Composition Principles', lessons: 7 },
          { id: 'module-02-lighting', title: 'Lighting and Shadow', lessons: 6 },
          { id: 'module-03-complete-scenes', title: 'Complete Scenes', lessons: 8 }
        ])
      },
      'historical-periods': {
        'prehistory': createHistoricalPeriodStructure('Prehistory', '70,000 - 3,500 BCE'),
        'mesopotamia': createHistoricalPeriodStructure('Mesopotamia', '3,500 - 539 BCE'),
        'egypt': createHistoricalPeriodStructure('Ancient Egypt', '3,100 - 30 BCE'),
        'greece': createHistoricalPeriodStructure('Ancient Greece', '800 - 146 BCE'),
        'rome': createHistoricalPeriodStructure('Roman Empire', '753 BCE - 476 CE'),
        'maya': createHistoricalPeriodStructure('Maya Civilization', '2,000 BCE - 1,500 CE'),
        'china': createHistoricalPeriodStructure('Ancient China', '2,070 BCE - 220 CE'),
        'islamic': createHistoricalPeriodStructure('Islamic Golden Age', '750 - 1,258 CE'),
        'medieval': createHistoricalPeriodStructure('Medieval Europe', '476 - 1,453 CE'),
        'renaissance': createHistoricalPeriodStructure('Renaissance', '1,300 - 1,600 CE'),
        'industrial': createHistoricalPeriodStructure('Industrial Revolution', '1,760 - 1,840 CE'),
        'modern': createHistoricalPeriodStructure('Modern Era', '1,900 - Present')
      },
      'portrait-module': {
        'config.json': '',
        'metadata.json': ''
      },
      'impossible-objects': {
        'config.json': '',
        'metadata.json': ''
      }
    },
    'templates': {
      'interactive': {
        'drawing-tools': {},
        'assessments': {},
        'simulations': {},
        'animations': {}
      },
      'layouts': {
        'standard': {},
        'adaptive': {},
        'mobile': {}
      },
      'visual-curriculum': {
        'period-explorer': {},
        'myth-viewer': {},
        'art-gallery': {},
        'math-visualizer': {}
      }
    },
    'components': {
      'readers': {},
      'widgets': {},
      'visualizers': {},
      'editors': {}
    },
    'analytics': {
      'trackers': {},
      'reports': {},
      'dashboards': {},
      'metrics': {}
    },
    'media': {
      'images': {},
      'videos': {},
      'audio': {},
      '3d-models': {}
    }
  };

  // Create the structure
  createDirectoryStructure(baseDir, structure);
  console.log('✅ eTextbook structure created successfully!');
  console.log(`📁 Created deep directory structure with ${countDirectories(baseDir)} directories`);
}

function createHistoricalPeriodStructure(periodName, dates) {
  return {
    'config.json': '',
    'metadata.json': '',
    'overview': {
      'introduction.md': '',
      'timeline.json': '',
      'key-figures.json': '',
      'quick-facts.json': ''
    },
    'art-and-patterns': {
      'visual-arts': {
        'paintings': {},
        'sculptures': {},
        'architecture': {},
        'decorative-arts': {}
      },
      'patterns-and-motifs': {},
      'techniques': {},
      'materials': {}
    },
    'mathematics': {
      'concepts': {},
      'discoveries': {},
      'applications': {},
      'notable-mathematicians': {}
    },
    'myths-and-stories': {
      'creation-myths': {},
      'hero-stories': {},
      'religious-texts': {},
      'folk-tales': {}
    },
    'power-structures': {
      'government': {},
      'social-hierarchy': {},
      'military': {},
      'economics': {}
    },
    'interactive': {
      'galleries': {},
      'simulations': {},
      'exercises': {},
      'assessments': {}
    }
  };
}

function createPhaseStructure(phaseNum, phaseName, modules) {
  const phase = {
    'config.json': '',
    'metadata.json': ''
  };

  modules.forEach(module => {
    phase[module.id] = createModuleStructure(module.title, module.lessons);
  });

  return phase;
}

function createModuleStructure(moduleTitle, numLessons) {
  const module = {
    'config.json': '',
    'metadata.json': '',
    'content': {
      'base': {},
      'advanced': {},
      'remedial': {},
      'enrichment': {}
    },
    'interactive': {
      'simulations': {},
      'assessments': {},
      'exercises': {},
      'activities': {}
    },
    'analytics': {
      'trackers': {},
      'reports': {}
    }
  };

  // Create lessons
  for (let i = 1; i <= numLessons; i++) {
    const lessonId = `lesson-${String(i).padStart(3, '0')}-${generateLessonName(i)}`;
    module[lessonId] = createLessonStructure(i);
  }

  return module;
}

function createLessonStructure(lessonNum) {
  const lesson = {
    'config.json': '',
    'metadata.json': '',
    'objectives.json': '',
    'prerequisites.json': ''
  };

  // Create pages (10-15 pages per lesson for deep structure)
  const numPages = Math.floor(Math.random() * 6) + 10; // 10-15 pages
  for (let i = 1; i <= numPages; i++) {
    const pageId = `page-${String(i).padStart(3, '0')}`;
    lesson[pageId] = createPageStructure(i);
  }

  return lesson;
}

function createPageStructure(pageNum) {
  return {
    'content.md': '',
    'metadata.json': '',
    'sections': {
      'introduction': {
        'text.md': '',
        'media': {},
        'interactions.json': ''
      },
      'main-content': {
        'text.md': '',
        'media': {},
        'interactions.json': '',
        'subsections': {
          'part-a': {
            'content.md': '',
            'exercises': {},
            'examples': {}
          },
          'part-b': {
            'content.md': '',
            'exercises': {},
            'examples': {}
          },
          'part-c': {
            'content.md': '',
            'exercises': {},
            'examples': {}
          }
        }
      },
      'practice': {
        'exercises.json': '',
        'solutions': {},
        'hints': {}
      },
      'assessment': {
        'questions.json': '',
        'rubrics.json': '',
        'feedback': {}
      },
      'summary': {
        'text.md': '',
        'key-points.json': '',
        'next-steps.json': ''
      }
    },
    'differentiation': {
      'advanced': {
        'content.md': '',
        'challenges': {}
      },
      'remedial': {
        'content.md': '',
        'support': {}
      },
      'enrichment': {
        'content.md': '',
        'extensions': {}
      }
    },
    'analytics': {
      'trackers.json': '',
      'metrics.json': ''
    }
  };
}

function generateLessonName(lessonNum) {
  const names = [
    'introduction', 'fundamentals', 'concepts', 'principles', 'techniques',
    'applications', 'practice', 'exercises', 'review', 'assessment',
    'advanced-topics', 'case-studies', 'projects', 'synthesis', 'mastery'
  ];
  return names[lessonNum % names.length];
}

function createDirectoryStructure(basePath, structure) {
  // Create base directory if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Recursively create structure
  for (const [key, value] of Object.entries(structure)) {
    const fullPath = path.join(basePath, key);
    
    if (typeof value === 'string') {
      // It's a file, create it
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, value);
      }
    } else {
      // It's a directory, create it and recurse
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      createDirectoryStructure(fullPath, value);
    }
  }
}

function countDirectories(dir) {
  let count = 0;
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        count++;
        walk(fullPath);
      }
    }
  }
  
  walk(dir);
  return count;
}

// Run the script
createEtextbookStructure();