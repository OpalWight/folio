export interface Project {
  title: string;
  year: string;
  slug: string;
  description: string;
  tags: string[];
  link: string;
  github: string;
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
    github: "https://github.com/OpalWight/careflow",
  },
  {
    title: "NEUROTECH",
    year: "2025",
    slug: "neurotech",
    description:
      "Brain-computer interface visualization suite for real-time neural data analysis.",
    tags: ["#PYTHON"],
    link: "/projects/neurotech",
    github: "https://github.com/OpalWight/neurotech",
  },
  {
    title: "CYCLONE",
    year: "2026",
    slug: "cyclone",
    description:
      "High-performance computer vision system for gate detection using YOLO and distributed computing. Also reworked frontend carousel components to comply with school accessibility standards.",
    tags: ["#GO", "#PYTHON", "#YOLO"],
    link: "/projects/cyclone",
    github: "https://github.com/OpalWight/cyclone",
  },
  {
    title: "BASE PAIRING PROBABILITY MODEL",
    year: "2025",
    slug: "base-pairing-probability-model",
    description:
      "Finding alternatives to noisy experimental icSHAPE data by utilizing RNA base pairing probabilities.",
    tags: ["#BIOINFORMATICS", "#TENSORFLOW"],
    link: "/projects/base-pairing-probability-model",
    github: "https://github.com/OpalWight/base-pairing-probability-model",
  },
  {
    title: "THE RANCH",
    year: "2025",
    slug: "the-ranch",
    description:
      "Custom-built k3s homelab optimized for media streaming, high-availability file storage, and localized machine learning workloads.",
    tags: ["#LINUX", "#KUBERNETES"],
    link: "/projects/the-ranch",
    github: "https://github.com/OpalWight/the-ranch",
  },
  {
    title: "SONG HIT PREDICTOR",
    year: "2025",
    slug: "song-hit-predictor",
    description:
      "macOS application leveraging advanced ML (Demucs, Whisper) for real-time vocal training, source separation, and high-precision pitch tracking.",
    tags: [],
    link: "/projects/song-hit-predictor",
    github: "https://github.com/OpalWight/song-hit-predictor",
  },
  {
    title: "NEURAL VOYAGER",
    year: "2025",
    slug: "neural-voyager",
    description:
      "Brain computer interface that translates EEG (brain waves) into rover motion controls.",
    tags: [],
    link: "/projects/neural-voyager",
    github: "https://github.com/OpalWight/neural-voyager",
  },
  {
    title: "NEUROTECH INTERNAL",
    year: "2025",
    slug: "neurotech-internal",
    description:
      "Internal platform built with Svelte and AWS Serverless for automating club administration, event attendance tracking via photo metadata, and member management.",
    tags: [],
    link: "/projects/neurotech-internal",
    github: "https://github.com/OpalWight/neurotech-internal",
  },
  {
    title: "HAYBALE",
    year: "2026",
    slug: "haybale",
    description:
      "Drop box service for the homelab.",
    tags: [],
    link: "/projects/haybale",
    github: "https://github.com/OpalWight/haybale",
  },
];
