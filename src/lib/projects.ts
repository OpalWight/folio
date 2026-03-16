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
      "Revolutionizing nursing assistant education through immersive patient simulations and personalized quizzes.",
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
      "High-performance computer vision system for gate detection using YOLO and distributed computing.",
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
    title: "BARNYARD",
    year: "2025",
    slug: "barnyard",
    description:
      "Custom-built k3s homelab optimized for media streaming, high-availability file storage, and localized machine learning workloads.",
    tags: ["#LINUX", "#KUBERNETES"],
    link: "/projects/barnyard",
    github: "https://github.com/OpalWight/barnyard",
  },
  {
    title: "SONG HIT PREDICTOR",
    year: "2025",
    slug: "song-hit-predictor",
    description:
      "Placeholder description for Song Hit Predictor.",
    tags: [],
    link: "/projects/song-hit-predictor",
    github: "https://github.com/OpalWight/song-hit-predictor",
  },
  {
    title: "NEURAL VOYAGER",
    year: "2025",
    slug: "neural-voyager",
    description:
      "Placeholder description for Neural Voyager.",
    tags: [],
    link: "/projects/neural-voyager",
    github: "https://github.com/OpalWight/neural-voyager",
  },
  {
    title: "NEUROTECH INTERNAL",
    year: "2025",
    slug: "neurotech-internal",
    description:
      "Placeholder description for Neurotech Internal.",
    tags: [],
    link: "/projects/neurotech-internal",
    github: "https://github.com/OpalWight/neurotech-internal",
  },
  {
    title: "HAYBALE",
    year: "2026",
    slug: "haybale",
    description:
      "Placeholder description for HayBale.",
    tags: [],
    link: "/projects/haybale",
    github: "https://github.com/OpalWight/haybale",
  },
];
