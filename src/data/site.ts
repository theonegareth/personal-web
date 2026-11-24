import turtlebotArena from "../assets/projects/turtlebot-arena.png";
import strawberryPrototype from "../assets/projects/strawberry-prototype.png";
import indohoaxApp from "../assets/projects/indohoax-app.png";
import hayabusa from "../assets/projects/hayabusa.jpg";
import karasu from "../assets/projects/karasu.jpg";
import krtiGazebo from "../assets/projects/krti-gazebo.jpg";
import plantesaLeaf from "../assets/projects/plantesa-leaf.jpg";
import depressionWaveform from "../assets/projects/depression-waveform.png";
import goldPrice from "../assets/projects/gold-price.png";
import shredderSlump from "../assets/projects/shredder-slump.jpg";
import smartParking from "../assets/projects/smart-parking.png";
import fishFeeder from "../assets/projects/fish-feeder.png";
import datasetsChart from "../assets/projects/datasets.png";

export const site = {
	name: "Gareth Aurelius Harrison",
	shortName: "Gareth A. Harrison",
	role: "Automotive and Robotics Engineering Student @ BINUS ASO School of Engineering",
	tagline: "Specializing in robotics, automation, and AI. Applying technical expertise to real-world innovations.",
	location: "West Jakarta, Indonesia",
	email: "gareth.harrison@binus.ac.id",
	github: "https://github.com/theonegareth",
	linkedin: "https://www.linkedin.com/in/theonegareth/",
	huggingface: "https://huggingface.co/theonegareth",
	kaggle: "https://www.kaggle.com/garethharrison",
	url: "https://theonegareth.com",
};

export const icdeesPaper = {
	title: "IndoHoaxDetector: A Comparative Evaluation of Classical Machine Learning and IndoBERT for Indonesian Mixed Corpus Hoax Detection",
	venue: "ICDEES 2026",
	coauthors: ["Seline Loewel", "Enrico Ethan"],
};

export type Project = {
	title: string;
	org?: string;
	period?: string;
	blurb: string;
	tags: string[];
	points: string[];
	href?: string;
	hrefLabel?: string;
	image?: ImageMetadata;
	imageAlt?: string;
	contain?: boolean;
	featured?: boolean;
	posts?: string[];
};

// ponytail: slug comes from the title, so renaming a project changes its URL; add a slug field if that ever matters
export const projectSlug = (project: Project) =>
	project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const projects: Project[] = [
	{
		title: "TurtleBot Autonomous Navigation",
		org: "Toyohashi University of Technology",
		period: "Mar 2026 - May 2026",
		blurb: "Autonomous mapping and docking for a TurtleBot3 in a cluttered lab: the robot drives between AprilTag stations on odometry, then hands over to a visual-servoing controller for the final approach, so wheel drift does not decide where it stops.",
		tags: ["ROS Noetic", "Python", "Visual Servoing", "LiDAR SLAM", "AprilTag"],
		points: [
			"Architected a reactive state machine for autonomous perimeter exploration, using windowed LiDAR data for dynamic obstacle evasion and trap recovery.",
			"Engineered a custom visual-servoing controller for the final docking approach, where the standard ROS navigation stack only gets the robot near a goal; after camera calibration, AprilTag distance estimates were within 0.4 mm at 15 cm (0.26%) and 4 mm at 30 cm.",
			"Re-ran the intrinsic calibration of the Raspberry Pi Camera V2 with Brevan Anthony, and built an airport-style approach: a taxiway point 0.50 m from the tag, a staging point at 0.35 m, and a fixed hub between stations.",
			"Made the tag mapper require five detections before saving a tag, which ended the ghost tags from peeling paint and reflections.",
		],
		href: "https://github.com/theonegareth/turtlebot-toyohashi",
		image: turtlebotArena,
		imageAlt: "TurtleBot in the test arena at Toyohashi, surrounded by cones and boxes carrying AprilTag landmarks",
		featured: true,
		posts: ["turtlebot-apriltag-docking"],
	},
	{
		title: "Strawberry Picking Robotic Arm",
		org: "BINUS ASO School of Engineering",
		period: "Sep 2025 - Jan 2026",
		blurb: "Robotic arm for strawberry harvesting, taken from a cardboard mock-up to a 3D-printed prototype shown at the January 2026 exhibition: a laptop runs YOLOv8 detection and stereo depth, and an Arduino drives the servos through inverse kinematics.",
		tags: ["YOLOv8", "Computer Vision", "Inverse Kinematics", "Arduino", "Python"],
		points: [
			"Group project of five for the Robotics Kinematics and Dynamics course; my part was the machine learning: dataset, labelling and training.",
			"Trained a YOLOv8n strawberry detector on Kaggle and home-made images plus negatives, reaching mAP@0.5 of about 0.976 on validation and 8.7-9.4 FPS live on a laptop.",
			"Its detections feed stereo depth and inverse kinematics (20 cm and 13.2 cm links, plus a 7 cm hand) that drive the servos through a PCA9685 board.",
		],
		href: "https://github.com/theonegareth/strawberryPicker",
		image: strawberryPrototype,
		imageAlt: "Strawberry-picking arm prototype on the bench, reaching for strawberries beside a laptop",
		featured: true,
		posts: ["strawberry-picking-arm"],
	},
	{
		title: "IndoHoaxDetector",
		org: "BINUS ASO School of Engineering",
		period: "Sep 2025 - Oct 2026",
		blurb: "End-to-end NLP pipeline classifying Indonesian news as FAKTA or HOAX, benchmarked across five classifiers and deployed as a live Gradio application.",
		tags: ["NLP", "Sastrawi", "IndoBERT", "Scikit-learn", "Gradio"],
		points: [
			"Built an Indonesian text pipeline over 62,934 documents from four public datasets, after finding and stripping a verdict-tag leak that let a one-rule baseline score 99.64% F1.",
			"Tuned Logistic Regression, Naive Bayes, Random Forest and SVM with stratified 5-fold cross-validation and ran IndoBERT over three seeds, then scored all five on the same held-out 20% test split: 99.71% for IndoBERT, 97.62% for LR and SVM.",
			"Tested on an outside 600-article benchmark, where every model fell to about 45-46% accuracy, below the 62% majority baseline. An earlier SVM version runs as a demo on Hugging Face Spaces.",
			"Presented as \"IndoHoaxDetector: A Comparative Evaluation of Classical Machine Learning and IndoBERT for Indonesian Mixed Corpus Hoax Detection\" at ICDEES 2026 (paper 1571356220), with Seline Loewel and Enrico Ethan, supervised by Benedictus Rahardjo.",
		],
		href: "https://huggingface.co/spaces/theonegareth/IndoHoaxDetector",
		hrefLabel: "Live demo",
		image: indohoaxApp,
		imageAlt: "IndoHoaxDetector running on Hugging Face Spaces, classifying a pasted Indonesian article as HOAX",
		posts: ["indohoaxdetector-distribution-shift"],
	},
	{
		title: "HAYABUSA, KRTI 2025",
		org: "BINUS ASO School of Engineering (AeroBASE)",
		period: "Oct 2024 - Oct 2025",
		blurb: "Autonomous hexacopter carrying three TFmini LiDAR sensors (front, left and right) for obstacle avoidance, plus a dual-camera setup: front-facing for gate detection and navigation, bottom-facing for object detection and mission tasks.",
		tags: ["ROS 2", "Gazebo", "Object Detection", "LiDAR"],
		points: [
			"Built HAYABUSA's Gazebo simulation model with Maul for flight control and mission testing.",
			"Built the benchmark harness that scores the team's detector candidates on a held-out set of 98 images and times them on two recorded videos; Winston's YOLOv10n reached mAP50 0.995.",
			"In August 2025 wrote navigator, mission-manager and DroneKit-bridge ROS 2 nodes for the Jetson flight code; the team removed them on 1 September, before the competition.",
			"Reached the KRTI 2025 national round in Padang: one of 17 teams in the VTOL division, drawn into group D as team D3.",
		],
		image: hayabusa,
		imageAlt: "Two AeroBASE members holding the HAYABUSA drone up outdoors",
		featured: true,
		posts: ["aerobase-krti-drones", "autonomous-drone-technology"],
	},
	{
		title: "KARASU (カラス), KRTI 2024",
		org: "BINUS ASO School of Engineering (AeroBASE)",
		period: "Mar 2024 - Oct 2024",
		blurb: "AeroBASE's second-generation UAV, a quadcopter for aerial surveillance and image capture, and the team's debut entry in the Kontes Robot Terbang Indonesia. The team's first end-to-end effort across airframe design, software integration, and flight testing.",
		tags: ["DroneKit", "ArduPilot", "UAV", "Flight Testing"],
		points: [
			"Conducted multiple flight trials validating obstacle avoidance and autonomous decision-making.",
			"The entry, \"VTOL BINUS\", passed the KRTI 2024 proposal evaluation in May 2024 and the online inspection in July 2024, which put it into the regional round.",
		],
		image: karasu,
		imageAlt: "The KARASU quadcopter on an outdoor court during a flight trial",
		posts: ["aerobase-krti-drones", "autonomous-drone-technology"],
	},
	{
		title: "KRTI 2025 Gazebo Simulation Assets",
		org: "BINUS ASO School of Engineering (AeroBASE)",
		blurb: "Hexacopter model and simulation world for AeroBASE's KRTI 2025 drone, HAYABUSA, built with Maul for Gazebo Sim and ROS 2 Jazzy. Jazzy is the simulation's target only: on the drone, the flight code ran as ROS 2 nodes on a Jetson, talking to the ArduPilot flight controller through DroneKit.",
		tags: ["Gazebo Sim", "ROS 2", "SDF", "ArduPilot SITL", "Simulation"],
		points: [
			"Modelled the hexacopter in SDF from the frame and rotor meshes, with an IMU.",
			"Wired it to ArduPilot software-in-the-loop through the ArduPilot plugin, with a Lua motor script so ArduPilot flies the six-motor frame.",
			"Built a Gazebo Sim runway world for testing arming, take-off and mission sequencing. Camera and LiDAR were never modelled, so the simulation could not test perception.",
			"In November 2025, removed the absolute paths and the ground-plane download so the simulation runs off the laptop it was built on, and added ROS 2 launch files.",
		],
		href: "https://github.com/theonegareth/GZassets",
		image: krtiGazebo,
		imageAlt: "Gazebo simulation of the KRTI 2025 drone on the ground plane with the entity tree open",
		posts: ["aerobase-krti-drones", "autonomous-drone-technology"],
	},
	{
		title: "PLANTESA: IoT & ML Plant Incubation System",
		org: "BINUS ASO School of Engineering",
		period: "Feb 2025 - Jun 2025",
		blurb: "Plant incubator in which an ESP32 runs the sensors, pumps, grow light and fan, and a Raspberry Pi 4 photographs the tomato leaves every 30 minutes for a VGG19 disease classifier. Sensor readings and photos go to Firebase and a web dashboard for remote monitoring.",
		tags: ["IoT", "CNN", "Firebase", "ESP32", "Raspberry Pi"],
		points: [
			"A 14-week team project with Brevan Anthony, Hans Gabriel Tjandra and Jonathan Matthew Halim: an incubator with soil-moisture, temperature, humidity, NPK, ultrasonic and water-level sensors. My part was the machine learning, the final ESP32 firmware and the website.",
			"The firmware drives three 12 V pumps, the grow light and a fan through relays, waters on a fixed schedule, and writes the readings and relay states to Firebase every three minutes.",
			"Trained a VGG19 classifier, fine-tuned from ImageNet weights, on 22,952 tomato-leaf images across 10 classes, reaching 89.53% test accuracy.",
		],
		href: "https://github.com/theonegareth/Plantesa",
		image: plantesaLeaf,
		imageAlt: "Tomato leaf with early blight lesions outlined in red by the Plantesa detector, reading Brown 7.06%",
		featured: true,
		posts: ["plantesa-plant-incubation", "ml-for-agricultural-automation"],
	},
	{
		title: "Depression Detection via Voice Analysis",
		org: "BINUS ASO School of Engineering",
		period: "Sep 2024 - Jan 2025",
		blurb: "Digital Signal Processing course project on detecting depression from voice: MFCC features from emotional speech classified with an SVM, reaching 99.46% test accuracy on angry, 96.8% on sad, and 89.47% on happy speech.",
		tags: ["Digital Signal Processing", "SVM", "MFCC", "Audio Processing"],
		points: [
			"Group project with Enrico Ethan and Hans Gabriel Tjandra, supervised by Winda Astuti; the speech was recorded by the team in three emotions: angry, happy and sad.",
			"Preprocessed each recording with pre-emphasis, 25 ms frames and a Hamming window, then normalized the MFCC features.",
			"Trained an SVM with an RBF kernel, tuning C and gamma by cross-validation: 99.49% training accuracy, and 99.46%, 96.8% and 89.47% on unseen angry, sad and happy speech.",
		],
		image: depressionWaveform,
		imageAlt: "Raw waveform of a happy-voice recording plotted in MATLAB",
		contain: true,
	},
	{
		title: "Indonesian Financial Market Datasets",
		period: "Nov 2025 - present",
		blurb: "Three open time-series datasets on Indonesian markets - the IHSG composite index, USD/IDR exchange rates, and Antam gold prices - published in parallel on Hugging Face and Kaggle, with IHSG and USD/IDR refreshed daily by an automated pipeline. Around 19,000 rows in total, all MIT-licensed.",
		tags: ["Data Engineering", "Python", "ETL", "Hugging Face", "Kaggle"],
		points: [
			"Built a stateless daily ETL job that pulls the current CSVs from Hugging Face, appends new market rows from Yahoo Finance, and pushes identical files to both platforms, no-opping on market-closed days.",
			"Routed the fetch through a SOCKS5 tunnel to a residential egress host after the data provider blocked the hosting VPS, with three retries before giving up.",
			"Made the job fail loudly rather than degrade, after a silently partial run lost a full trading day, and added a stats collector tracking per-dataset downloads and views over time.",
		],
		href: "https://huggingface.co/theonegareth/datasets",
		hrefLabel: "Datasets",
		image: datasetsChart,
		imageAlt: "Three line charts side by side: the IHSG composite index from 1995, the USD/IDR exchange rate from 2001, and the Antam gold price per gram from 2010",
		contain: true,
	},
	{
		title: "Gold Price Prediction Models",
		blurb: "Classifiers that predict whether the Antam gold price goes up or down the next day, compared from raw scrape through to evaluation.",
		tags: ["Python", "XGBoost", "LightGBM", "Scikit-learn", "Pandas"],
		points: [
			"Built the acquisition pipeline converting scraped Antam price pages into a clean CSV series.",
			"Trained and compared scikit-learn gradient boosting, XGBoost and LightGBM classifiers on lagged-return features to predict next-day direction.",
			"Evaluated with ROC and precision-recall curves, a confusion matrix, and feature importance.",
		],
		href: "https://github.com/theonegareth/GoldPricePredictor",
		image: goldPrice,
		imageAlt: "Line chart of Antam gold price in IDR from 2010 to 2026",
		contain: true,
	},
	{
		title: "Plastic Shredder & Vibration Mixer",
		org: "Total Panel Beton",
		period: "Jun 2025 - Sep 2025",
		blurb: "Two machines for a paving-block trial at a concrete products company: a hand-cranked plastic shredder that cuts PET bottles into 2-4 cm pieces, and a vibration table that settles the concrete in the molds. The shredded plastic went into K250 paving-block specimens.",
		tags: ["Mechanical Design", "Fabrication", "Materials Testing"],
		points: [
			"Chose the shredder design with a Pugh matrix and budgeted both machines, about Rp 3 million for the shredder and Rp 4 million for the vibration table.",
			"Built the shredder: two 50 cm shafts with 15 hook-shaped blades each, cut from M20 washer plates, geared to turn in opposite directions; a tighter bushing stopped the shafts drifting apart and leaving plastic unshredded.",
			"Made K250 paving-block specimens with one and two shredded bottles; the control block set on the vibration table came out smoother and without the air hole of the unvibrated one.",
			"Tested the blocks with a rebound hammer; the plain control read 13 against a target of 25 before its 29-day cure, so the strength results were still to come.",
			"Carried out with Johan Kim and Stivan Delon Sahertian.",
		],
		image: shredderSlump,
		imageAlt: "Rebound hammer test on a paving-block specimen marked P, one of the blocks with shredded plastic in the mix",
	},
	{
		title: "SMART Parking System",
		org: "BINUS ASO School of Engineering",
		period: "Feb 2024 - Jul 2024",
		blurb: "1/64-scale parking lot built without a microcontroller: PIR sensors open servo barrier gates at the entrance and exit, and infrared sensors switch an LED for each bay, so drivers can see free spaces. Aimed at cutting search time, fuel use and emissions, in line with UN Sustainable Development Goals 9, 11 and 13.",
		tags: ["Circuit Design", "EasyEDA", "Sensors", "Relays"],
		points: [
			"Group project with Wycliff Wibisono, Jonathan Bryant Reginald and Alvin Oentoro Abadi, supervised by Winda Astuti.",
			"Drew the schematic in EasyEDA: the gate servos run through a two-relay H-bridge switched by 2N3904 transistors, with a push button to open each gate by hand.",
			"Measured the voltage at both servos and all three LEDs across ten operating cases; readings stayed within an average 0.95% of the expected values.",
		],
		image: smartParking,
		imageAlt: "SMART Parking System model with toy cars in the bays, servo barrier gates and an IN/OUT LED board",
	},
	{
		title: "Automatic Fish Feeding System",
		org: "BINUS ASO School of Engineering",
		period: "Dec 2023 - Jan 2024",
		blurb: "Arduino-based feeder: a DS3231 real-time clock opens a servo gate at 06:00 and 18:00, three ultrasonic sensors measure how full the food hopper is, and an I2C LCD shows the time and the remaining capacity.",
		tags: ["Arduino", "Microcontrollers", "EasyEDA", "Automation"],
		points: [
			"Designed the circuits in EasyEDA, integrating the ultrasonic sensors, the servo, and an LCD display.",
			"Programmed the Arduino to automate scheduled feeding via a Real-Time Clock module, with no delay() in the feeding path, so the display and sensors keep running while the gate is open.",
			"Tested each part in its own sketch (LCD, servo, clock, ultrasonic) before combining them in the final firmware.",
		],
		href: "https://github.com/theonegareth/SMARTFishFeeder",
		image: fishFeeder,
		imageAlt: "Automatic fish feeder unit with its LCD lit, mounted beside the aquarium",
		posts: ["embedded-systems-with-arduino"],
	},
];

export type Job = {
	period: string;
	role: string;
	org: string;
	location?: string;
	summary: string;
};

export const experience: Job[] = [
	{
		period: "Aug 2026 - present",
		role: "Software Engineering Intern (Pelajarin AI Division)",
		org: "PT Dewaweb",
		summary: "Builds and runs production software for Pelajarin AI and Dewaweb: the Pelajarin help centre and support desk, the landing site, and marketplace data acquisition (Dewastore, now part of Atlas). Formal BINUS internship placement.",
	},
	{
		period: "Jul 2026 - present",
		role: "Member of Technical Staff",
		org: "Nutrisi AI",
		summary: "Trains and benchmarks the food detection and nutrition estimation models behind Nutrisi AI, including evaluation against weighed reference meals and prompt A/B testing.",
	},
	{
		period: "Mar 2026 - May 2026",
		role: "Laboratory Assistant",
		org: "Toyohashi University of Technology (豊橋技術科学大学), Uchiyama Laboratory",
		location: "Toyohashi, Aichi, Japan",
		summary: "Short-Term Visiting International Students program. Research and lab assistance on autonomous mobile robot navigation and precision visual alignment. Team project with Brevan Anthony. Calibrated the camera so AprilTag distance estimates fell within 0.4 mm at 15 cm and 4 mm at 30 cm, built a proportional visual-servoing controller for docking, and engineered a reactive state machine for perimeter exploration using windowed LiDAR data.",
	},
	{
		period: "Sep 2025 - Jan 2026",
		role: "Laboratory Assistant (Teaching Assistant)",
		org: "BINUS ASO School of Engineering",
		location: "South Tangerang, Indonesia",
		summary: "Supported the Decision Making Under Uncertainty course, guiding 20+ students through Analytical Hierarchy Process models in SuperDecisions. Prepared 10+ lab materials and case studies and delivered 14+ weekly tutorials on hierarchical modelling and pairwise comparison.",
	},
	{
		period: "Sep 2025 - Jan 2026",
		role: "Advisor (AI Division)",
		org: "BASE C.O.R.E",
		location: "South Tangerang, Indonesia",
		summary: "Mentored underclassmen through BASE C.O.R.E projects and research, sharing documentation and lessons from previous cohorts to smooth transitions for new members.",
	},
	{
		period: "Jun 2025 - Sep 2025",
		role: "Research and Development Intern",
		org: "Total Panel Beton",
		location: "Jakarta, Indonesia",
		summary: "Worked in a 3-member R&D team with Johan Kim and Stivan Delon Sahertian on a paving-block trial using shredded plastic: built a hand-cranked plastic shredder, used a vibration table to set the specimens, and made and rebound-hammer tested K250 blocks with plastic in the mix.",
	},
	{
		period: "Jul 2024 - Sep 2025",
		role: "Secretary (AI Division)",
		org: "BASE C.O.R.E",
		location: "South Tangerang, Indonesia",
		summary: "Managed documentation for 20+ lessons and meetings, and organized the division's curriculum and academic calendar for 30+ members.",
	},
	{
		period: "Feb 2024 - Jul 2024",
		role: "Interim Leader",
		org: "BASE A.I",
		location: "South Tangerang, Indonesia",
		summary: "Oversaw the AI Division's transition into BASE Core, preparing handover documents, lesson materials, and project records to keep operations continuous through the leadership change.",
	},
	{
		period: "Mar 2024 - Oct 2025",
		role: "Software Engineer",
		org: "AeroBase",
		location: "South Tangerang, Indonesia",
		summary: "Ran KARASU's flight trials for KRTI 2024. For HAYABUSA (KRTI 2025, national round) built the Gazebo simulation model with Maul and wrote the benchmark harness for the team's object detection models; in August 2025 wrote navigator, mission-manager and DroneKit-bridge ROS 2 nodes for its flight code, which the team removed before the competition.",
	},
	{
		period: "Sep 2023 - Oct 2025",
		role: "Event Manager",
		org: "ESPORTS Club (EO)",
		location: "South Tangerang, Indonesia",
		summary: "Organized esports tournaments with 80+ competing teams across Mobile Legends and Valorant, coordinating scheduling, logistics, and live streaming for multi-day events reaching hundreds of participants.",
	},
	{
		period: "Sep 2023 - Jan 2024",
		role: "Member",
		org: "BASE A.I",
		location: "South Tangerang, Indonesia",
		summary: "Built and tested 3+ machine learning models in Python, processed and analyzed 5+ datasets for training and evaluation, and collaborated with 15+ peers on documentation and project development.",
	},
];

export const education = [
	{
		degree: "Bachelor of Engineering, Automotive and Robotics Engineering",
		school: "BINUS ASO School of Engineering, BINUS University",
		detail: "2023 - 2027 (expected) - GPA 3.86/4.00",
		fields: "Digital Logic Design, Microcontrollers, Robotics Systems, Control Engineering",
	},
	{
		degree: "High School Diploma, Natural Sciences Track",
		school: "SMAK 1 PENABUR Jakarta",
		detail: "2020 - 2023",
		fields: "Founder of the Business Plan Club, class tutoring organizer, Gavel Club member",
	},
];

export const skills = [
	{ group: "Programming & Software", items: ["Python", "C++", "Arduino", "MATLAB", "TensorFlow", "OpenCV", "ROS", "Gazebo"] },
	{ group: "Robotics & Embedded Systems", items: ["LiDAR", "SLAM", "Computer Vision", "Sensor Fusion", "Raspberry Pi", "ESP32"] },
	{ group: "AI & Data Science", items: ["Machine Learning", "Neural Networks", "SVM", "CNN", "Data Preprocessing"] },
	{ group: "Tools & Platforms", items: ["GitHub", "Firebase", "Jupyter Notebook", "Linux", "SolidWorks", "EasyEDA", "SuperDecisions"] },
];

export const languages = [
	{ name: "Indonesian", level: "Native" },
	{ name: "English", level: "Fluent - IELTS 7.0" },
	{ name: "Japanese", level: "Basic - JLPT N5 (expected)" },
	{ name: "Mandarin", level: "Basic - HSK 2" },
];

export const certifications = [
	{ name: "Google Cloud Computing Foundations", issuer: "Google Cloud Skill Boost", date: "Nov 2024" },
	{ name: "Azure AI Basic Fundamental", issuer: "GreatNusa, Microsoft, BINUS University", date: "Apr 2025" },
	{ name: "Getting Started with Cisco Packet Tracer", issuer: "Cisco Networking Academy", date: "Nov 2024" },
	{ name: "Python", issuer: "Kaggle", date: "Oct 2023" },
];

export const interests = [
	"Public speaking and debate - Wardaya Gavel Club",
	"Entrepreneurship and innovation - founder, Business Plan Club",
	"Drone technology and autonomous systems - AeroBase R&D",
	"Esports event organizing - 80+ team tournaments",
];
