export const SDG_GOALS = [
  { id: 1, label: "No Poverty", color: "#E5243B" },
  { id: 2, label: "Zero Hunger", color: "#DDA63A" },
  { id: 3, label: "Good Health", color: "#4C9F38" },
  { id: 4, label: "Quality Education", color: "#C5192D" },
  { id: 5, label: "Gender Equality", color: "#FF3A21" },
  { id: 6, label: "Clean Water", color: "#26BDE2" },
  { id: 7, label: "Clean Energy", color: "#FCC30B" },
  { id: 8, label: "Decent Work", color: "#A21942" },
  { id: 9, label: "Industry & Innovation", color: "#FD6925" },
  { id: 11, label: "Sustainable Cities", color: "#FD9D24" },
  { id: 13, label: "Climate Action", color: "#3F7E44" },
  { id: 17, label: "Partnerships", color: "#19486A" },
];

export const MOCK_ACTIVITY = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 5)
}));

export const DOMAINS = [
  "Agriculture", "Healthcare", "Education", "Hardware", "Software",
  "Environment", "Energy", "Finance", "Robotics", "AI/ML", "IoT", "Social Impact"
];

export const TECH_STACKS = [
  "Python", "JavaScript", "React", "Node.js", "Arduino", "Raspberry Pi",
  "PyTorch", "TensorFlow", "KiCad", "Java", "C++", "Flutter", "Firebase",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "OpenCV"
];

export const STAGES = ["Idea", "Prototype", "Production"];

export const mockUsers = [
  {
    id: "u1",
    name: "Aanya Sharma",
    avatar: "https://i.pravatar.cc/150?img=47",
    tagline: "AgriTech Builder • SDG Advocate",
    location: "Bengaluru, India",
    followers: 1240,
    following: 380,
    projects: 8,
    sdgScore: 87,
    isPremium: true,
    techStack: ["Python", "Arduino", "TensorFlow", "Firebase"],
    domains: ["Agriculture", "IoT", "AI/ML"],
    bio: "Building tech for farmers who feed us all. Prototype stage builder obsessed with SDG 2 & 13.",
  },
  {
    id: "u2",
    name: "Deven Kapoor",
    avatar: "https://i.pravatar.cc/150?img=11",
    tagline: "Hardware Hacker • Open Source",
    location: "Pune, India",
    followers: 890,
    following: 210,
    projects: 14,
    sdgScore: 72,
    isPremium: false,
    techStack: ["KiCad", "C++", "Arduino", "Python"],
    domains: ["Hardware", "Robotics", "Education"],
    bio: "I build things you can touch. PCB designer, robotics enthusiast, student.",
  },
  {
    id: "u3",
    name: "Lena Torres",
    avatar: "https://i.pravatar.cc/150?img=32",
    tagline: "ML Researcher • Healthcare AI",
    location: "Barcelona, Spain",
    followers: 2100,
    following: 450,
    projects: 11,
    sdgScore: 91,
    isPremium: true,
    techStack: ["PyTorch", "Python", "Docker", "PostgreSQL"],
    domains: ["Healthcare", "AI/ML", "Software"],
    bio: "PhD researcher using deep learning to make diagnostics accessible in low-resource settings.",
  },
  {
    id: "u4",
    name: "Kwame Asante",
    avatar: "https://i.pravatar.cc/150?img=15",
    tagline: "Social Entrepreneur • EdTech",
    location: "Accra, Ghana",
    followers: 670,
    following: 300,
    projects: 5,
    sdgScore: 80,
    isPremium: false,
    techStack: ["Flutter", "Firebase", "JavaScript", "Node.js"],
    domains: ["Education", "Software", "Social Impact"],
    bio: "Using tech to democratize quality education across sub-Saharan Africa.",
  },
];

export const mockProjects = [
  {
    id: "p1",
    userId: "u1",
    user: mockUsers[0],
    title: "SoilSense — IoT Soil Health Monitor",
    problemTitle: "Unreliable Soil Health Monitoring for Smallholder Farmers",
    shortDescription: "An affordable IoT device that measures soil NPK, moisture, and pH in real-time, sending data to a farmer's phone via LoRa.",
    longDescription: `SoilSense is a low-cost IoT device designed for smallholder farmers in India and sub-Saharan Africa. It measures three critical soil parameters — Nitrogen, Phosphorus, Potassium (NPK), moisture content, and pH — in real time. Data is transmitted via LoRa to a solar-powered gateway and then to a cloud dashboard accessible on any smartphone.

The device costs approximately ₹800 to manufacture and can last 6 months on two AA batteries. The companion mobile app (built with Flutter + Firebase) provides actionable recommendations: when to irrigate, what fertilizer to apply, and early warning alerts for soil degradation.

We tested this across 30 farms in Karnataka with a 94% uptime rate. Farmers reported a 22% reduction in fertilizer costs and 18% improvement in yield quality over one growing season.

The firmware is written in C++ for an ESP32 microcontroller. The NPK sensor module uses near-infrared spectroscopy. PCB layout was done in KiCad. The LoRa module is RYLR998 by REYAX.`,
    techStack: ["Arduino", "C++", "Firebase", "Flutter", "KiCad", "Python"],
    sdgTags: [2, 13, 6],
    domainTags: ["Agriculture", "Tech", "Hardware"],
    stage: "Prototype",
    alternativeUses: [
      "Monitoring greenhouse farms in controlled environments",
      "Water quality sensing for aquaculture",
      "Environmental monitoring in nature reserves"
    ],
    proofOfWork: {
      images: ["/proof/soilsense1.jpg"],
      videoUrl: "https://youtube.com/watch?v=demo",
      patentNumber: null,
    },
    collaborationCTA: "Build With Me",
    likes: 342,
    collaborationRequests: 18,
    views: 4100,
    featured: true,
    createdAt: "2025-11-10",
    contributors: 3
  },
  {
    id: "p2",
    userId: "u3",
    user: mockUsers[2],
    title: "RetinaScan AI — Diabetic Retinopathy Detector",
    problemTitle: "Inaccessible Early Screening for Diabetic Retinopathy in Rural Areas",
    shortDescription: "A deep learning model that detects early-stage diabetic retinopathy from fundus photographs with 96.2% accuracy.",
    longDescription: `RetinaScan AI is a lightweight PyTorch model trained on 88,000 fundus images from 3 public datasets (APTOS 2019, EyePACS, MESSIDOR-2). The model achieves 96.2% AUC-ROC and can run inference on a standard laptop CPU in under 2 seconds, making it viable for rural clinics with limited compute.

The pipeline wraps the model in a FastAPI endpoint, allowing integration with existing hospital information systems via REST. A companion web UI built with React lets doctors upload images and receive graded results (0–4 severity scale) with heatmap overlays showing regions of concern.

We partnered with 2 ophthalmology clinics in Barcelona and Nairobi for clinical validation. The Nairobi clinic, which has only 1 ophthalmologist for 40,000 patients, is now using the tool to triage cases. We aim to publish our clinical results in Q2 2026.

Current work: model compression for mobile deployment (target: Android app, 50MB model size), a multilingual UI, and an offline mode for low-connectivity settings.`,
    techStack: ["PyTorch", "Python", "FastAPI", "React", "Docker", "OpenCV"],
    sdgTags: [3, 9, 17],
    domainTags: ["Health", "AI", "Software"],
    stage: "Production",
    alternativeUses: [
      "Screening for glaucoma and macular degeneration",
      "Quality control in pharmaceutical manufacturing (defect detection)",
      "Satellite imagery analysis for crop disease detection"
    ],
    proofOfWork: {
      images: [],
      videoUrl: null,
      patentNumber: "PCT/EP2025/054321",
    },
    collaborationCTA: "Improve / Contribute",
    likes: 891,
    collaborationRequests: 47,
    views: 12300,
    featured: true,
    createdAt: "2025-09-22",
    contributors: 5
  },
  {
    id: "p3",
    userId: "u2",
    user: mockUsers[1],
    title: "OpenArm — 3D Printable Prosthetic Hand",
    problemTitle: "High Cost of Advanced Prosthetics for Low-income Amputees",
    shortDescription: "An open-source, 3D-printable prosthetic hand with individual finger control via EMG signals, built for under ₹2000.",
    longDescription: `OpenArm is a fully open-source prosthetic hand that anyone with a ₹15,000 3D printer can build for under ₹2000 in materials. It uses surface electromyography (sEMG) electrodes strapped to the forearm to detect muscle activation signals, which are processed by an Arduino Nano to control 5 servo motors — one per finger.

The mechanical design is parametric (OpenSCAD) so it can be resized for different hand sizes including children. Assembly takes approximately 4 hours and requires only a soldering iron and basic tools. We have printed and deployed 8 units so far — 3 in collaboration with a rehabilitation center in Pune and 5 shipped internationally to people who found us through our GitHub.

The EMG signal pipeline uses a bandpass filter (20–450 Hz) followed by an RMS envelope detector. We are currently working on a gesture classification ML model (trained on our own sEMG dataset) that would allow more complex grip patterns.

All design files, firmware, BOM, and assembly guide are on GitHub under the CERN Open Hardware License.`,
    techStack: ["Arduino", "C++", "Python", "KiCad"],
    sdgTags: [3, 9, 1],
    domainTags: ["Robotics", "Health", "Hardware"],
    stage: "Prototype",
    alternativeUses: [
      "Robotic gripper for pick-and-place automation",
      "Haptic feedback research platform",
      "STEM education: teaching servo control and EMG processing"
    ],
    proofOfWork: {
      images: [],
      videoUrl: "https://youtube.com/watch?v=openarm",
      patentNumber: null,
    },
    collaborationCTA: "Build With Me",
    likes: 567,
    collaborationRequests: 31,
    views: 7800,
    featured: false,
    createdAt: "2025-12-03",
  },
  {
    id: "p4",
    userId: "u4",
    user: mockUsers[3],
    title: "LearnBridge — Offline-First EdTech for Rural Schools",
    problemTitle: "Lack of Consistent Digital Education in Areas with Unreliable Internet",
    shortDescription: "A Flutter app delivering curated K-12 curriculum content that works fully offline, syncing when connectivity is available.",
    longDescription: `LearnBridge addresses the digital divide in education by delivering structured K-12 content — lessons, quizzes, videos, and exercises — to students in areas with unreliable or no internet. The app works completely offline after initial content download, using SQLite for local storage and a custom sync protocol to update content when connectivity is detected.

Teachers can create and assign custom lessons, track student progress on a classroom dashboard (also offline-capable), and receive automated reports highlighting struggling students. Content is mapped to the Ghana Education Service curriculum but is adaptable to any national curriculum via a CMS.

Deployed in 12 schools across Ghana's Northern Region. Over 3,200 students and 180 teachers are active users. Average session length: 22 minutes per student per day. Pilot schools showed a 31% improvement in end-of-term scores.

Next milestone: launching in Nigeria and Kenya, adding voice-based Q&A (using on-device TTS/STT), and creating a content authoring tool for teachers with no technical background.`,
    techStack: ["Flutter", "Firebase", "JavaScript", "Node.js", "SQLite"],
    sdgTags: [4, 17, 10],
    domainTags: ["Tech", "Software", "Social Impact"],
    stage: "Production",
    alternativeUses: [
      "Corporate training and upskilling in remote field locations",
      "Medical protocol delivery for community health workers",
      "Agricultural advisory delivery for rural farmers"
    ],
    proofOfWork: {
      images: [],
      videoUrl: "https://youtube.com/watch?v=learnbridge",
      patentNumber: null,
    },
    collaborationCTA: "Improve / Contribute",
    likes: 443,
    collaborationRequests: 22,
    views: 5900,
    featured: true,
    createdAt: "2026-01-15",
  },
  {
    id: "p5",
    userId: "u1",
    user: mockUsers[0],
    title: "RainPredict — Hyperlocal Rainfall Forecasting",
    problemTitle: "Vague District-level Weather Forecasts Affecting Precision Farming",
    shortDescription: "ML model combining satellite imagery, IMD data, and IoT sensor networks to give 72-hour hyperlocal rainfall predictions.",
    longDescription: `RainPredict is an idea-stage project aimed at solving one of the biggest pain points for dryland farmers: unreliable rain forecasts. National weather services provide district-level forecasts with 10–15 km resolution, which is useless when a storm can bypass a village entirely.

The proposed system combines MODIS satellite cloud imagery, India Meteorological Department (IMD) gridded rainfall data, and a network of low-cost weather stations (temperature, humidity, pressure, wind) placed 5km apart. A spatiotemporal ML model (currently exploring transformers + graph neural networks) would fuse these data streams for 72-hour predictions at 1km resolution.

Currently in design phase: building the sensor network, curating historical training data (2000–2025 IMD grids), and prototyping the GNN architecture. Early simulations on historical data show promising results (RMSE 4.2mm vs 11.8mm for IMD baseline).

Looking for: ML researchers with geospatial experience, IoT engineers for sensor node design, and farmers/NGOs willing to host weather stations.`,
    techStack: ["Python", "PyTorch", "TensorFlow", "Node.js", "PostgreSQL"],
    sdgTags: [13, 2, 11],
    domainTags: ["Agriculture", "AI", "Environment"],
    stage: "Idea",
    alternativeUses: [
      "Disaster early warning for flood-prone areas",
      "Precision irrigation scheduling",
      "Insurance risk modeling for crop insurance providers"
    ],
    proofOfWork: {
      images: [],
      videoUrl: null,
      patentNumber: null,
    },
    collaborationCTA: "Build With Me",
    likes: 198,
    collaborationRequests: 44,
    views: 2700,
    featured: false,
    createdAt: "2026-02-20",
  },
  {
    id: "p6",
    userId: "u2",
    user: mockUsers[1],
    title: "PocketScope — DIY Electronic Oscilloscope",
    problemTitle: "High Cost of Professional Signal Analysis Tools for Students",
    shortDescription: "A credit-card sized, 20MHz oscilloscope built from scratch with a custom PCB, STM32, and a 2.4\" TFT display.",
    longDescription: `PocketScope is a fully functional 20MHz, 2-channel digital oscilloscope that fits in your pocket and costs under $18 in components. It's designed as an educational tool for students learning embedded systems and as a field debugging instrument for hardware hackers.

The PCB was designed in KiCad. It uses an STM32F103 microcontroller running bare-metal C++ firmware, an op-amp front-end for signal conditioning, and a 2.4" SPI TFT display. A USB-C port handles power and PC communication (for waveform export). The rotary encoder + 4 tactile switches provide the UI.

All KiCad files, gerbers, BOM, firmware, and PCB assembly guide are on GitHub. The design is optimized for JLCPCB assembly (BOM includes their part numbers). Community members have ordered, assembled, and tested the board — it works!

Specs: 20MHz bandwidth, 200ksps sample rate, ±15V input range, 10× and 1× probe modes, auto-trigger, FFT view, 8MB Flash for waveform logging.`,
    techStack: ["KiCad", "C++", "Python", "STM32"],
    sdgTags: [4, 9],
    domainTags: ["Tech", "Education", "Software"],
    stage: "Production",
    alternativeUses: [
      "Low-cost signal analyzer for academic electronics labs",
      "Data logger for sensor calibration",
      "Teaching platform for embedded systems courses"
    ],
    proofOfWork: {
      images: [],
      videoUrl: "https://youtube.com/watch?v=pocketscope",
      patentNumber: null,
    },
    collaborationCTA: "Improve / Contribute",
    likes: 714,
    collaborationRequests: 29,
    views: 9200,
    featured: false,
    createdAt: "2025-10-08",
  },
];

export const mockCommunities = [
  {
    id: "c1",
    name: "AgriTech Builders",
    description: "Building tech for agriculture, food security, and sustainable farming.",
    domain: "Agriculture",
    members: 4820,
    posts: 312,
    icon: "🌾",
    isPremium: false,
    tags: ["Agriculture", "IoT", "SDG2", "SDG13"],
  },
  {
    id: "c2",
    name: "Hardware Makers",
    description: "PCB design, embedded systems, open hardware, and physical computing.",
    domain: "Hardware",
    members: 7100,
    posts: 891,
    icon: "🔧",
    isPremium: false,
    tags: ["Hardware", "Arduino", "KiCad", "Robotics"],
  },
  {
    id: "c3",
    name: "AI/ML Hub",
    description: "All things machine learning, deep learning, and applied AI.",
    domain: "AI/ML",
    members: 12400,
    posts: 2200,
    icon: "🧠",
    isPremium: false,
    tags: ["AI/ML", "PyTorch", "Python", "Computer Vision"],
  },
  {
    id: "c4",
    name: "SDG Pioneers",
    description: "Projects and builders aligned with the UN Sustainable Development Goals.",
    domain: "Social Impact",
    members: 3100,
    posts: 445,
    icon: "🌍",
    isPremium: false,
    tags: ["SDG", "Social Impact", "Environment"],
  },
  {
    id: "c5",
    name: "Healthcare Innovators",
    description: "Tech solutions for diagnostics, treatment, and healthcare access.",
    domain: "Healthcare",
    members: 5600,
    posts: 678,
    icon: "🏥",
    isPremium: false,
    tags: ["Healthcare", "AI/ML", "IoT", "SDG3"],
  },
  {
    id: "c6",
    name: "Python Guild",
    description: "Python for everything: data science, automation, web, and beyond.",
    domain: "Software",
    members: 18900,
    posts: 3400,
    icon: "🐍",
    isPremium: true,
    tags: ["Software", "AI", "Software", "AI/ML", "Automation"],
  },
  {
    id: "c7",
    name: "EdTech Circle",
    description: "Builders using technology to transform education and learning outcomes.",
    domain: "Education",
    members: 2800,
    posts: 320,
    icon: "📚",
    isPremium: false,
    tags: ["Education", "Flutter", "Offline", "SDG4"],
  },
  {
    id: "c8",
    name: "Elite Founders Network",
    description: "Exclusive community for early-stage founders with production-ready projects.",
    domain: "Startup",
    members: 890,
    posts: 220,
    icon: "🚀",
    isPremium: true,
    tags: ["Founders", "Startup", "Production"],
  },
  {
    id: "c9",
    name: "Deep Research Lab",
    description: "Research-grade projects: papers, patents, academic collaborations.",
    domain: "Research",
    members: 1200,
    posts: 180,
    icon: "🔬",
    isPremium: true,
    tags: ["Research", "Patents", "Academia"],
  },
];

export const currentUser = mockUsers[0];
