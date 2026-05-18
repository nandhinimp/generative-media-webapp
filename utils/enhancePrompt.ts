import { GenerationOptions } from "@/types/generation";

export const defaultNegativePrompt = 
  "blurry, distorted, low quality, bad anatomy, cropped, duplicate, deformed, ugly, poorly drawn face, mutation, mutated, extra limb, missing limb, disconnected limbs, malformed hands, out of focus";

const semanticGroups = {
  subjects: {
    "fashion model": "fashion model",
    model: "fashion model",
    kid: "young child",
    child: "young child",
    boy: "young boy",
    girl: "young girl",
    woman: "woman",
    man: "man",
    person: "person",
    dog: "dog",
    cat: "cat",
    car: "vehicle",
  },
  actions: {
    sliding: "sliding down a playground slide",
    playing: "playing",
    running: "running",
    jumping: "jumping",
    racing: "racing in a competition",
    walking: "walking",
    driving: "driving",
    eating: "eating",
    reading: "reading",
    sitting: "sitting",
    standing: "standing"
  },
  environments: {
    park: "public park",
    cafe: "cafe",
    beach: "beach",
    forest: "forest",
    school: "school",
    street: "street",
    city: "cityscape",
    room: "room",
    mountain: "mountain",
    ocean: "ocean",
  },
  styles: [
    "anime", "manga", "illustration", "painting", "sketch", "watercolor", "3d", "cinematic", "photorealistic", "pixel art", "comic"
  ],
  moods: [
    "dark", "bright", "gloomy", "cheerful", "mysterious", "romantic", "peaceful", "epic", "dramatic"
  ]
};

function hasAny(prompt: string, keywords: string[]) {
  return keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`, 'i').test(prompt));
}

export function enhancePrompt(originalPrompt: string, options?: GenerationOptions): string {
  if (!originalPrompt || originalPrompt.trim() === "") return originalPrompt;

  let enhanced = originalPrompt.trim();
  const lowerPrompt = enhanced.toLowerCase();
  const wordCount = originalPrompt.split(/\s+/).length;

  const strictness = options?.strictness || "balanced";
  const creativity = options?.creativity || "balanced";
  const stylePreset = options?.stylePreset || "none";
  const aspectRatio = options?.aspectRatio || "square";

  // 1. Strict Option: Limit enhancement
  if (strictness === "strict" || creativity === "accurate") {
    // If strict or accurate, still apply aspect ratio and style presets subtly, but do not reconstruct.
    return applyStyleAndRatio(originalPrompt, stylePreset, aspectRatio);
  }

  // 2. Semantic Prompt Decomposition & Intelligent Scene Reconstruction (for shorter prompts)
  let reconstructed = false;
  if (wordCount <= 15) {
    let foundSubject = "";
    let foundAction = "";
    let foundEnv = "";
    let foundStyle = "";
    let foundMood = "";

    // Parse keywords
    for (const [key, val] of Object.entries(semanticGroups.subjects)) {
      if (new RegExp(`\\b${key}\\b`, 'i').test(lowerPrompt)) {
        foundSubject = val;
        break;
      }
    }
    for (const [key, val] of Object.entries(semanticGroups.actions)) {
      if (new RegExp(`\\b${key}\\b`, 'i').test(lowerPrompt)) {
        foundAction = val;
        break;
      }
    }
    for (const [key, val] of Object.entries(semanticGroups.environments)) {
      if (new RegExp(`\\b${key}\\b`, 'i').test(lowerPrompt)) {
        foundEnv = val;
        break;
      }
    }
    for (const style of semanticGroups.styles) {
      if (new RegExp(`\\b${style}\\b`, 'i').test(lowerPrompt)) {
        foundStyle = style;
        break;
      }
    }
    for (const mood of semanticGroups.moods) {
      if (new RegExp(`\\b${mood}\\b`, 'i').test(lowerPrompt)) {
        foundMood = mood;
        break;
      }
    }

    const isRacingScene = hasAny(lowerPrompt, ["race", "racing", "competition", "motorsport", "track", "grand prix", "formula", "car"]);
    const hasCrowd = hasAny(lowerPrompt, ["crowd", "cheering", "people", "spectators", "audience"]);
    const hasDriverSubject = hasAny(lowerPrompt, ["woman", "women", "girl", "driver", "racer", "racing driver", "pilot"]);

    // Rebuild if we found an environment and either a subject or action
    if ((foundSubject || foundAction) && foundEnv) {
      const parts = [];
      const subjectText = foundSubject || "subject";
      const actionText = foundAction ? ` ${foundAction}` : "";
      
      parts.push(`${subjectText}${actionText} in a ${foundEnv}`);

      // Action priority
      if (foundAction) {
        parts.push("playful action captured naturally");
        parts.push("action remains the visual center");
      }

      // Composition balancing
      parts.push(`${foundEnv} scenery visible in background`);
      parts.push("full scene composition");
      parts.push("avoid generic portrait crop");

      if (foundMood) {
        parts.push(`${foundMood} atmosphere`);
      }

      // Creative Level adjustment
      if (creativity === "creative") {
        parts.push("rich storytelling elements");
        parts.push("highly detailed surroundings");
        parts.push("beautiful dramatic lighting");
      }

      // Keep enhancement adaptive - only add realism if no style requested
      if (stylePreset === "none" && !foundStyle && !lowerPrompt.includes("realistic") && !lowerPrompt.includes("art")) {
        parts.push("realistic daytime environment");
      }

      enhanced = `${originalPrompt}, detailed scene: ${parts.join(", ")}`;
      reconstructed = true;
    } else if (isRacingScene) {
      const parts = [];
      const driverText = hasDriverSubject ? "female racing driver" : "race driver";

      parts.push(`${driverText} inside a race car on a racing track`);
      parts.push("helmet on, focused hands on the steering wheel");
      parts.push("car clearly visible in the scene, not outside the vehicle");
      parts.push("crowd cheering in the background");
      parts.push("high-energy competition atmosphere");
      parts.push("dynamic motion and natural action composition");

      if (hasCrowd) {
        parts.push("spectators cheering around the track");
      }

      if (creativity === "creative") {
        parts.push("dramatic race-day storytelling");
        parts.push("detailed track environment");
      }

      enhanced = `${originalPrompt}, detailed scene: ${parts.join(", ")}`;
      reconstructed = true;
    }
  }

  // 3. Fallback Contextual Enhancements (if not reconstructed)
  if (!reconstructed) {
    const fallbacks = [];

    if (lowerPrompt.includes("in cafe") || lowerPrompt.includes("at cafe") || lowerPrompt.includes("coffee shop")) {
      fallbacks.push("cafe environment clearly visible in background, detailed cafe setting, tables and ambient lighting");
    } else if (lowerPrompt.includes("in park") || lowerPrompt.includes("at park") || lowerPrompt.includes("in a park")) {
      fallbacks.push("wide outdoor park scenery, detailed trees and nature, full park environment clearly visible");
    } else if (lowerPrompt.includes("street") || lowerPrompt.includes("cityscape") || lowerPrompt.includes("alley")) {
      fallbacks.push("detailed environmental composition, urban surroundings clearly visible");
    } else if (lowerPrompt.includes("beach")) {
      fallbacks.push("wide beach environment clearly visible, ocean and sand in background");
    }

    if (lowerPrompt.includes("fashion model") || lowerPrompt.includes("editorial")) {
      fallbacks.push("high fashion editorial framing, full body or wide shot, professional photography composition");
    }

    if (hasAny(lowerPrompt, ["race", "racing", "competition", "motorsport", "track", "formula", "grand prix"])) {
      fallbacks.push("driver inside the car, race track clearly visible, crowd cheering in the background, dynamic motorsport scene");
    }

    if (lowerPrompt.includes("anime") || lowerPrompt.includes("manga") || lowerPrompt.includes("illustration")) {
      fallbacks.push("high quality anime illustration style, detailed background artwork, vibrant colors");
    } else if (
      !lowerPrompt.includes("portrait") &&
      !lowerPrompt.includes("close up") &&
      !lowerPrompt.includes("face") &&
      !lowerPrompt.includes("logo") &&
      !lowerPrompt.includes("icon")
    ) {
      fallbacks.push("full scene composition, environment visible supporting the scene, avoid generic portrait crop");
    }

    if (wordCount <= 3 && !lowerPrompt.includes("logo") && !lowerPrompt.includes("icon")) {
      fallbacks.push("wide shot, highly detailed, well composed, clear environment");
    }

    // Creative expansions
    if (creativity === "creative") {
      fallbacks.push("dynamic lighting, intricate details, highly artistic composition");
    }

    if (fallbacks.length > 0) {
      enhanced = `${enhanced}, ${fallbacks.join(", ")}`;
    }
  }

  // 4. Flexible enhancements (gives AI more interpretive freedom)
  if (strictness === "flexible") {
    enhanced += ", highly evocative, beautiful ambient light, rich volumetric detail";
  }

  // 5. Apply style presets and aspect ratio adjustments
  return applyStyleAndRatio(enhanced, stylePreset, aspectRatio);
}

function applyStyleAndRatio(prompt: string, stylePreset: string, aspectRatio: string): string {
  let output = prompt;

  // Aspect ratio composition hints
  if (aspectRatio === "portrait") {
    output += ", vertical framing, optimized for portrait composition";
  } else if (aspectRatio === "landscape") {
    output += ", wide angle, expansive landscape scene, landscape orientation";
  } else if (aspectRatio === "square") {
    output += ", balanced square composition";
  }

  // Style Presets
  switch (stylePreset) {
    case "realistic":
      output += ", photorealistic photograph, highly detailed, 8k resolution, realistic textures, natural lighting";
      break;
    case "anime":
      output += ", professional digital anime illustration style, expressive key visual, vibrant color palette, beautiful background art";
      break;
    case "cinematic":
      output += ", cinematic still, highly atmospheric lighting, dynamic shadows, volumetric light, professional film shot composition";
      break;
    case "fantasy":
      output += ", ethereal fantasy artwork, magical glowing particles, detailed mythical setting, mysterious mood, rich details";
      break;
    case "fashion_editorial":
      output += ", fashion editorial photography, polished magazine composition, tasteful styling, refined lighting, premium visual storytelling";
      break;
    case "minimal":
      output += ", minimalist aesthetic, clean simple lines, elegant flat design, uncluttered composition, modern negative space";
      break;
    case "3d_illustration":
      output += ", 3d model render illustration style, modern clay rendering, smooth textures, vibrant toy-like details";
      break;
    case "none":
    default:
      break;
  }

  return output;
}
