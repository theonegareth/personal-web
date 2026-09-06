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

export const site = {
	name: "Gareth Aurelius Harrison",
	shortName: "Gareth A. Harrison",
	role: "Automotive and Robotics Engineering Student @ BINUS ASO School of Engineering",
	tagline: "Specializing in robotics, automation, and AI. Applying technical expertise to real-world innovations.",
	location: "West Jakarta, Indonesia",
	email: "gareth.harrison@binus.ac.id",
	github: "https://github.com/theonegareth",
	linkedin: "https://www.linkedin.com/in/theonegareth/",
	url: "https://theonegareth.com",
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
};

export const projects: Project[] = [
	{
		title: "TurtleBot Autonomous Navigation",
		org: "Toyohashi University of Technology",
		period: "Mar 2026 - May 2026",
		blurb: "Autonomous navigation and mapping for a TurtleBot in cluttered indoor environments, combining global path planning with visual servoing and an AprilTag landmark infrastructure to defeat odometry drift.",
		tags: ["ROS Noetic", "Python", "Visual Servoing", "LiDAR SLAM", "AprilTag"],
		points: [
			"Architected a reactive state machine for autonomous perimeter exploration, using windowed LiDAR data for dynamic obstacle evasion and trap recovery.",
			"Engineered a custom visual-servoing controller for final docking, reaching 0.4 mm error at a 15 cm staging range and bypassing the limits of the standard ROS navigation stack.",
			"Ran intrinsic camera calibration for a Raspberry Pi Camera V2 and designed a tiered landmark system to mitigate long-term dead-reckoning drift.",
		],
		href: "https://github.com/theonegareth/turtlebot-toyohashi",
		image: turtlebotArena,
		imageAlt: "TurtleBot in the test arena at Toyohashi, surrounded by cones and boxes carrying AprilTag landmarks",
		featured: true,
	},
	{
		title: "Strawberry Picking Robotic Arm",
		org: "BINUS ASO School of Engineering",
		period: "Sep 2025 - Jan 2026",
		blurb: "Autonomous robotic arm for precision strawberry harvesting, taken from cardboard mockup to a fully 3D-printed working prototype with vision-driven actuation.",
		tags: ["YOLOv8", "Computer Vision", "SolidWorks", "TensorFlow Lite", "Raspberry Pi"],
		points: [
			"Engineered the manipulator structure as detailed 3D CAD models and assemblies in SolidWorks.",
			"Trained an object detection model to localize strawberries and generate bounding boxes for the control system.",
			"Quantized the model to INT8 TensorFlow Lite for Raspberry Pi 4B deployment, targeting 20-30 FPS.",
		],
		href: "https://github.com/theonegareth/strawberryPicker",
		image: strawberryPrototype,
		imageAlt: "3D-printed strawberry-picking arm prototype on the bench, reaching for strawberries beside a laptop",
		featured: true,
	},
	{
		title: "IndoHoaxDetector",
		org: "BINUS ASO School of Engineering",
		period: "Sep 2025 - Jan 2026",
		blurb: "End-to-end NLP pipeline classifying Indonesian news as FAKTA or HOAX, benchmarked across five classifiers and deployed as a live Gradio application.",
		tags: ["NLP", "Sastrawi", "IndoBERT", "Scikit-learn", "Gradio"],
		points: [
			"Built an Indonesian text normalization pipeline over 62,972 samples using regex and the Sastrawi stemmer, cutting vocabulary by 63.6% to 45,678 terms and average document length from 312 to 156 words.",
			"Benchmarked Logistic Regression, Naive Bayes, Random Forest, SVM and IndoBERT under stratified 5-fold cross-validation with hyperparameter grid sweeps.",
			"Audited error distributions and feature coefficients, then serialized the pipeline with joblib and deployed it to Hugging Face Spaces.",
		],
		href: "https://huggingface.co/spaces/theonegareth/IndoHoaxDetector",
		hrefLabel: "Live demo",
		image: indohoaxApp,
		imageAlt: "IndoHoaxDetector running on Hugging Face Spaces, classifying a pasted Indonesian article as HOAX",
	},
	{
		title: "HAYABUSA, KRTI 2025",
		org: "BINUS ASO School of Engineering (AeroBASE)",
		period: "Oct 2024 - Oct 2025",
		blurb: "Autonomous drone carrying three LiDAR sensors for obstacle avoidance and mapping, plus a dual-camera setup: front-facing for gate detection and navigation, bottom-facing for object detection and mission tasks.",
		tags: ["ROS", "Gazebo", "Object Detection", "LiDAR"],
		points: [
			"Developed and integrated drone simulation environments in Gazebo using ROS for flight control and mission testing.",
			"Built and tested object detection models for drone perception, improving target recognition accuracy in simulation.",
		],
		image: hayabusa,
		imageAlt: "Two AeroBASE members holding the HAYABUSA drone up outdoors",
		featured: true,
	},
	{
		title: "KARASU (カラス), KRTI 2024",
		org: "BINUS ASO School of Engineering (AeroBASE)",
		period: "Jun 2023 - Oct 2024",
		blurb: "First-generation UAV for aerial surveillance and image capture, and AeroBASE's debut entry in the Kontes Robot Terbang Indonesia. The team's first end-to-end effort across airframe design, software integration, and flight testing.",
		tags: ["ROS", "UAV", "Flight Testing"],
		points: [
			"Debugged and optimized ROS packages controlling UAV navigation, sensor data, and communication modules.",
			"Conducted multiple flight trials validating obstacle avoidance and autonomous decision-making, improving stability and responsiveness.",
		],
		image: karasu,
		imageAlt: "The KARASU quadcopter on an outdoor court during a flight trial",
	},
	{
		title: "KRTI 2025 Gazebo Simulation Assets",
		org: "BINUS ASO School of Engineering (AeroBASE)",
		blurb: "Drone model and simulation world for the AeroBASE KRTI 2025 entry, built for Gazebo Sim and ROS 2 Jazzy.",
		tags: ["Gazebo Sim", "ROS 2", "SDF/URDF", "Simulation"],
		points: [
			"Modelled a hexacopter airframe as SDF/URDF with frame, propeller, and camera-mount meshes.",
			"Built a Gazebo Sim world for visual and physics-based flight testing.",
		],
		href: "https://github.com/theonegareth/GZassets",
		image: krtiGazebo,
		imageAlt: "Gazebo simulation of the KRTI 2025 drone on the ground plane with the entity tree open",
	},
	{
		title: "PLANTESA: IoT & ML Plant Incubation System",
		org: "BINUS ASO School of Engineering",
		period: "Feb 2025 - Jun 2025",
		blurb: "Smart plant incubation system combining environmental sensors, an ESP32 and Raspberry Pi 4B for real-time monitoring and automated irrigation, with a CNN detecting tomato leaf disease at an early stage.",
		tags: ["IoT", "CNN", "Firebase", "ESP32", "Raspberry Pi"],
		points: [
			"Developed the full IoT system integrating temperature, humidity, NPK, water level, and ultrasonic sensors.",
			"Implemented cloud data processing via Firebase to control irrigation and surface readings to a web front end.",
			"Applied a CNN to webcam images for early tomato leaf disease detection.",
		],
		href: "https://github.com/theonegareth/Plantesa",
		image: plantesaLeaf,
		imageAlt: "Tomato leaf with early blight lesions outlined in red by the Plantesa detector, reading Brown 7.06%",
		featured: true,
	},
	{
		title: "Depression Detection via Voice Analysis",
		org: "BINUS ASO School of Engineering",
		period: "Sep 2024 - Jan 2025",
		blurb: "Non-invasive diagnostic system extracting MFCC features from speech and classifying them with an SVM, reaching 99.46% on angry, 96.8% on sad, and 89.47% on happy emotional speech.",
		tags: ["Digital Signal Processing", "SVM", "MFCC", "Audio Processing"],
		points: [
			"Collected and curated 50+ voice samples across multiple emotional categories.",
			"Preprocessed audio with noise reduction, segmentation, and normalization for consistency.",
			"Extracted MFCC features capturing pitch, tone, and rhythm variation linked to depressive speech, then trained the SVM classifier.",
		],
		image: depressionWaveform,
		imageAlt: "Raw waveform of a happy-voice recording plotted in MATLAB",
		contain: true,
	},
	{
		title: "Gold Price Prediction Models",
		blurb: "Comparison of regression and gradient-boosting models on Antam historical gold prices, from raw scrape through to evaluation.",
		tags: ["Python", "XGBoost", "Scikit-learn", "Pandas"],
		points: [
			"Built the acquisition pipeline converting scraped Antam price pages into a clean CSV series.",
			"Trained and compared linear regression against XGBoost on the resulting dataset.",
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
		blurb: "Equipment supporting material efficiency and sustainability in production: a shredder reducing plastic waste to reusable particles, and a vibration mixer improving composite uniformity.",
		tags: ["Mechanical Design", "Fabrication", "Materials Testing"],
		points: [
			"Designed and fabricated shredder blades to process plastic waste for reuse in cement-based composites.",
			"Repaired and optimized the vibration table for stable operation during mixing and testing.",
			"Formulated and tested cement mixtures with varying plastic content for strength, durability, and production feasibility.",
			"Carried out with Johan Kim and Stivan Delon Sahertian.",
		],
		image: shredderSlump,
		imageAlt: "Rebound hammer test on a cured cement block with plastic content",
	},
	{
		title: "SMART Parking System",
		org: "BINUS ASO School of Engineering",
		period: "Feb 2024 - Jul 2024",
		blurb: "Automated parking system using PIR sensors, infrared sensors, servo motors, and LED indicators to monitor availability and regulate access, cutting search time, fuel use, and emissions. Aligned with the UN Sustainable Development Goals on industry, innovation, and sustainable cities.",
		tags: ["Embedded Systems", "IoT", "EasyEDA", "Circuit Design"],
		points: [
			"Designed the electronic circuits in EasyEDA, integrating sensors and actuators.",
			"Tested circuit performance across operating conditions to verify reliability.",
			"Optimized and implemented the final design for stable operation.",
		],
		image: smartParking,
		imageAlt: "SMART Parking System model with toy cars in the bays and the ultrasonic barrier post",
	},
	{
		title: "Automatic Fish Feeding System",
		org: "BINUS ASO School of Engineering",
		period: "Feb 2024 - Jul 2024",
		blurb: "Arduino-based feeder using ultrasonic sensors, servo motors, and a fan mechanism to distribute food evenly, with an RTC module for precise scheduling and an LCD showing remaining capacity.",
		tags: ["Arduino", "Microcontrollers", "EasyEDA", "Automation"],
		points: [
			"Designed the circuits in EasyEDA, integrating ultrasonic sensors, servo motors, and an LCD display.",
			"Programmed the Arduino to automate scheduled feeding via a Real-Time Clock module.",
			"Assembled and tested the system for reliable distribution in aquarium conditions.",
		],
		href: "https://github.com/theonegareth/SMARTFishFeeder",
		image: fishFeeder,
		imageAlt: "Automatic fish feeder unit with its LCD lit, mounted beside the aquarium",
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
		period: "Mar 2026 - May 2026",
		role: "Laboratory Assistant",
		org: "Toyohashi University of Technology (豊橋技術科学大学)",
		location: "Toyohashi, Aichi, Japan",
		summary: "Research and lab assistance on autonomous mobile robot navigation and precision visual alignment. Achieved sub-centimeter docking precision (0.4 mm error at 15 cm staging range) through custom intrinsic camera calibration and a proportional control algorithm, and engineered a reactive state machine for perimeter exploration using windowed LiDAR data.",
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
		summary: "Worked with a 3-member R&D team to design, prototype, and test 2 process improvement initiatives, improving production accuracy and consistency by up to 12%. Analyzed 50+ operational and product data points to validate the solutions.",
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
		period: "Sep 2023 - Oct 2025",
		role: "Software Engineer",
		org: "AeroBase",
		location: "South Tangerang, Indonesia",
		summary: "Developed and integrated drone simulation environments in Gazebo using ROS, built and tested object detection models for UAV perception, and designed and debugged ROS packages for navigation, sensor handling, and communication.",
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
