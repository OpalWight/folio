export interface Project {
  title: string;
  year: string;
  slug: string;
  description: string;
  tags: string[];
  link: string;
  github: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "CAREFLOW",
    year: "2025",
    slug: "careflow",
    description:
      "Next.js monolith simulator for CNA skills and written exams, utilizing Google Gemini for AI-powered turn-by-turn evaluations and Pinecone for RAG-based question generation.",
    tags: ["#REACT", "#NODEJS", "#SQL"],
    link: "/projects/careflow",
    github: "",
    image: "/previews/careflow.png",
  },
  {
    title: "CYCLONE",
    year: "2026",
    slug: "cyclone",
    description:
      "High-performance computer vision system for gate detection using YOLO and distributed computing. Also reworked frontend carousel components to comply with school accessibility standards.",
    tags: ["#GO", "#PYTHON", "#YOLO"],
    link: "/projects/cyclone",
    github: "",
    image: "/previews/cyclone.png",
  },
  {
    title: "MOOSIC",
    year: "2025",
    slug: "moosic",
    description:
      "Completely local, open-source macOS app for vocal training using Demucs for source separation, Whisper for lyric transcription, and Apple Accelerate for real-time pitch tracking.",
    tags: [],
    link: "/projects/moosic",
    github: "https://github.com/OpalWight/moosic",
    image: "/previews/moosic.png",
  },
  {
    title: "SONG HIT PREDICTOR",
    year: "2025",
    slug: "song-hit-predictor",
    description:
      "Gradient boost model for predicting song popularity based on audio features. Frontend built with Svelte, backend with Flask.",
    tags: [],
    link: "/projects/song-hit-predictor",
    github: "",
    image: "/previews/song-hit-predictor.png",
  },
  {
    title: "NEUROTECH INTERNAL",
    year: "2025",
    slug: "neurotech-internal",
    description:
      "Internal platform built with Svelte and AWS Serverless for automating club administration, event attendance tracking via photo metadata, and member management.",
    tags: [],
    link: "/projects/neurotech-internal",
    github: "",
    image: "/previews/neurotech-internal.png",
  },
  {
    title: "HAYBALE",
    year: "2026",
    slug: "haybale",
    description:
      "Drop box service for the homelab.",
    tags: [],
    link: "/projects/haybale",
    github: "",
    image: "/previews/haybale.png",
  },
  {
    title: "NEURAL VOYAGER",
    year: "2025",
    slug: "neural-voyager",
    description:
      "Brain computer interface that translates EEG (brain waves) into rover motion controls.",
    tags: [],
    link: "/projects/neural-voyager",
    github: "https://github.com/Neurotech-Davis/Neuro-Voyager",
  },
  {
    title: "BASE PAIRING PROBABILITY MODEL",
    year: "2025",
    slug: "base-pairing-probability-model",
    description:
      "Finding alternatives to noisy experimental icSHAPE data by utilizing RNA base pairing probabilities.",
    tags: ["#BIOINFORMATICS", "#TENSORFLOW"],
    link: "/projects/base-pairing-probability-model",
    github: "",
  },
  {
    title: "THE RANCH",
    year: "2025",
    slug: "the-ranch",
    description:
      "Custom-built k3s homelab optimized for media streaming, high-availability file storage, and localized machine learning workloads.",
    tags: ["#LINUX", "#KUBERNETES"],
    link: "/projects/the-ranch",
    github: "https://github.com/OpalWight/The-Ranch",
  },
];
