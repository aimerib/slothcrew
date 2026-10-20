// Resume content. The /resume/ page and the PDF (npm run resume:pdf) are both
// rendered from this file, so edit here and regenerate the PDF.
//
// ATS notes: keep section names standard, dates in "Mon YYYY – Present" form,
// and every fact in plain text (no icons, no text added by CSS).

export default {
  name: "Aimeri Baddouh",
  headline: "Senior Software Engineer · Applied AI & LLMs",
  location: "Cuenca, Ecuador · Remote",
  email: "aimeri@baddouh.com",
  phone: "",
  updated: "October 2026",
  pdf: {
    path: "/resume/aimeri-baddouh-resume.pdf",
    downloadName: "Aimeri-Baddouh-Resume.pdf",
  },
  links: [
    { label: "baddouh.com", url: "https://www.baddouh.com" },
    { label: "linkedin.com/in/aimeri-baddouh-a29380360", url: "https://www.linkedin.com/in/aimeri-baddouh-a29380360" },
    { label: "github.com/aimerib", url: "https://github.com/aimerib" },
    { label: "huggingface.co/aimeri", url: "https://huggingface.co/aimeri" },
  ],

  summary:
    "Senior software engineer focused on applied AI: putting LLMs into production, researching what works, and " +
    "teaching teams to use them well. Builds Claude workflows and Amazon Bedrock integrations at ServicePros, and " +
    "independently fine-tunes open-weight models and builds datasets, published on Hugging Face. Background in " +
    "Ruby on Rails, Go, and Rust, after 10+ years in systems administration and DevOps.",

  experience: [
    {
      title: "Senior Software Engineer, AI",
      company: "ServicePros Installation Group",
      start: "May 2025",
      end: "Present",
      bullets: [
        "Develop Claude workflows for the team.",
        "Use Amazon Bedrock to bring LLMs into complex business processes such as contract verification.",
        "Roll out vendor AI tools that integrate deeply with the company's chat, inventory, and scheduling systems.",
        "Research and evaluate models and approaches for new use cases, and teach staff to use AI tools well.",
      ],
    },
    {
      title: "Senior Software Engineer",
      company: "Poll Everywhere",
      start: "2023",
      end: "2025",
      bullets: [
        "Designed and led development of presentation streaming solutions built with Playwright, FFmpeg, and Go.",
        "Modernized code-signing infrastructure and implemented complex geolocation features.",
        "Mentored junior developers on modern Ruby on Rails patterns and API best practices.",
      ],
    },
    {
      title: "Software Engineer",
      company: "ServicePros Installation Group",
      start: "2019",
      end: "2023",
      bullets: [
        "Led modernization of legacy systems, upgrading legacy code to modern standards.",
        "Overhauled CI/CD pipelines and established an efficient build and deployment process.",
        "Integrated third-party services including APM monitoring, Google Maps, and OAuth authentication.",
      ],
    },
  ],

  projects: [
    {
      name: "SpoomplesMaxx open-weight LLMs",
      link: { label: "huggingface.co/aimeri", url: "https://huggingface.co/aimeri" },
      bullets: [
        "Trained creative-writing LLMs with continued pretraining, SFT, and DPO on Qwen, Gemma, Mistral, Granite, " +
          "GLM, and Seed-OSS bases; released GGUF and MLX quantizations (top release: 14,000+ downloads).",
        "Cardmaker: full-parameter fine-tune of Ministral 3 14B on one 96 GB GPU (8-bit AdamW) that turns a one-line " +
          "prompt into a structured character card; v1 used LoRA on Granite 4.1 8B (Unsloth, TRL).",
        "Gated releases on multi-turn behavioral test batteries, not loss alone; published targeted training sets " +
          "repremover-xl (7,281 conversations) and Olivia-Sys (3,886 conversations).",
      ],
    },
    {
      name: "Low-resource language datasets",
      link: { label: "huggingface.co/aimeri", url: "https://huggingface.co/aimeri" },
      bullets: [
        "Built a Ticuna–Spanish–Portuguese corpus (47K parallel pairs, 48K monolingual rows, tone-annotated lexicon) " +
          "with leakage-safe splits; consolidated a documented Napo Kichwa–Spanish dataset (13.9K pairs).",
      ],
    },
    {
      name: "Nightrunner",
      link: { label: "github.com/aimerib/nightrunner-lib", url: "https://github.com/aimerib/nightrunner-lib" },
      bullets: [
        "Text-adventure engine in Rust, compiled to WebAssembly and published on crates.io and npm.",
      ],
    },
  ],

  skills: [
    {
      group: "AI & LLMs",
      items: "Generative AI, LLMs, Claude, Amazon Bedrock, prompt engineering, fine-tuning (full-parameter, LoRA), " +
        "continued pretraining, SFT, DPO, synthetic data, LLM evaluation, quantization (GGUF, MLX)",
    },
    {
      group: "ML tooling",
      items: "Python, PyTorch, Hugging Face Transformers, TRL, PEFT, Unsloth, Axolotl, vLLM, llama.cpp",
    },
    {
      group: "Software",
      items: "Ruby on Rails, Go, Rust, TypeScript, JavaScript, React, Elixir, Hotwire, WebAssembly, REST APIs, OAuth",
    },
    {
      group: "Infrastructure",
      items: "AWS, Docker, CI/CD, DevOps, systems administration, GPU training on RunPod and Vast.ai",
    },
  ],

  additional: [
    { label: "Languages", text: "English, Portuguese (fluent), Spanish" },
    { label: "Military service", text: "U.S. Navy Reserve, 4 years" },
  ],

  education: [],
};
