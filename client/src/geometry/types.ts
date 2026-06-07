export type GEA = {
  id: string;
  label: string;
  category: string;
  dimensional_seed?: string;
  formal_properties?: string[];
  visual_features?: string[];
  recognition_keywords?: string[];
  aliases?: string[];
  possible_geks?: string[];
  possible_gephrs?: string[];
  svg_hint?: string;
  notes?: string;
  source_family?: string;
  certainty_note?: string;
};

export type GEM = {
  id: string;
  label: string;
  composition_type: string;
  components: string[];
  composition_rule: string;
  formal_properties: string[];
  visual_features: string[];
  possible_carriers: string[];
  possible_geks: string[];
  possible_gephrs: string[];
  historical_examples: string[];
  notes: string;
};

export type GECD = {
  id: string;
  label: string;
  civilization: string;
  period?: string;
  date_range?: {
    start_bce: number | null;
    end_bce: number | null;
    confidence: "low" | "medium" | "high";
  };
  elements: string[];
  molecules: string[];
  carrier: {
    type: string;
    label: string;
    material: string;
    location?: string;
    source_url?: string;
    source_citation?: string;
  };
  dimension: {
    spatial_mode: string;
    from_dimension: string;
    to_dimension: string;
  };
  registers: {
    metaphor: {
      gephr_ids: string[];
      claim?: string;
      confidence?: "low" | "medium" | "high";
    };
    function: {
      gek_ids: string[];
      claim?: string;
      confidence?: "low" | "medium" | "high";
    };
  };
  magic_signature?: any;
  nesting?: any;
  historical_role?: string;
  notes?: string;
};

export type GEK = {
  id: string;
  label: string;
};

export type GEpHR = {
  id: string;
  label: string;
};

export type NestingRule = {
  id: string;
  input: string[];
  output_candidates: string[];
  condition: string;
  adds_geks: string[];
  possible_gephrs: string[];
};
