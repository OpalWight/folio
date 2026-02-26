export interface Project {
  title: string;
  year: string;
  slug: string;
  description: string;
  tags: string[];
  link: string;
}

export const projects: Project[] = [
  {
    title: "CAREFLOW",
    year: "2024",
    slug: "careflow",
    description:
      "Revolutionizing nursing assistant education through immersive patient simulations and personalized quizzes.",
    tags: ["#REACT", "#NODEJS", "#SQL"],
    link: "/projects/careflow",
  },
  {
    title: "NEUROTECH",
    year: "2023",
    slug: "neurotech",
    description:
      "Brain-computer interface visualization suite for real-time neural data analysis.",
    tags: ["#PYTHON"],
    link: "/projects/neurotech",
  },
  {
    title: "CYCLONE",
    year: "2023",
    slug: "cyclone",
    description:
      "High-performance computer vision system for gate detection using YOLO and distributed computing.",
    tags: ["#GO", "#PYTHON", "#YOLO"],
    link: "/projects/cyclone",
  },
  {
    title: "BASE PAIRING PROBABILITY MODEL",
    year: "2022",
    slug: "base-pairing-probability-model",
    description:
      "Finding alternatives to noisy experimental icSHAPE data by utilizing RNA base pairing probabilities.",
    tags: ["#BIOINFORMATICS", "#TENSORFLOW"],
    link: "/projects/base-pairing-probability-model",
  },
  {
    title: "BARNYARD",
    year: "2021",
    slug: "barnyard",
    description:
      "Custom-built k3s homelab optimized for media streaming, high-availability file storage, and localized machine learning workloads.",
    tags: ["#LINUX", "#KUBERNETES"],
    link: "/projects/barnyard",
  },
];
