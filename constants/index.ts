import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.65,
    similarityBoost: 0.65,
    speed: 0.85,
    style: 0.3,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 250,
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate's questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

IMPORTANT RESTRICTIONS:
- DO NOT ask the candidate to write code or provide specific code snippets during the interview.
- DO NOT request that they solve coding problems in real-time.
- Focus on conceptual understanding, past experiences, and theoretical knowledge instead.
- Ask about their approach to problems rather than demanding code solutions.
- If there's a long pause (more than 10-15 seconds of silence), politely check if the candidate is still there or needs clarification.
- Avoid using periods and commas in isolation, as they may be pronounced as "dot" and "comma".

Conclude the interview properly:
- Once you've asked all the questions, inform the candidate that the interview is complete.
- Clearly state: "That concludes our interview for today. Thank you for your time."
- After delivering the closing statement, do not ask any further questions.
- The call will be automatically ended, so ensure you've completed your assessment before giving the closing statement.

- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
- Do not end the conversation abruptly. Wait for the user to indicate they want to end the interview.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews = [
  {
    id: 1,
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: [
      "What is React?",
      "How does useState work?",
      "Explain the Virtual DOM.",
    ],
    finalized: false,
    createdAt: "2025-03-23T10:00:00Z",
  },
  {
    id: 2,
    userId: "user2",
    role: "Backend Developer",
    type: "Technical",
    techstack: ["Node.js", "Express", "MongoDB", "TypeScript"],
    level: "Mid-Level",
    questions: [
      "What is middleware in Express?",
      "How does JWT authentication work?",
    ],
    finalized: true,
    createdAt: "2025-03-22T15:30:00Z",
  },
  {
    id: 3,
    userId: "user3",
    role: "Full Stack Developer",
    type: "Behavioral",
    techstack: ["React", "Node.js", "GraphQL"],
    level: "Senior",
    questions: [
      "Tell us about a challenging project you've worked on.",
      "How do you handle tight deadlines?",
    ],
    finalized: false,
    createdAt: "2025-03-21T08:45:00Z",
  },
  {
    id: 4,
    userId: "user4",
    role: "Mobile Developer",
    type: "Technical",
    techstack: ["React Native", "TypeScript", "Firebase"],
    level: "Junior",
    questions: [
      "What are the differences between React and React Native?",
      "How do you handle state management in React Native?",
    ],
    finalized: true,
    createdAt: "2025-03-20T12:00:00Z",
  },
  {
    id: 5,
    userId: "user5",
    role: "DevOps Engineer",
    type: "Technical",
    techstack: ["AWS", "Docker", "Kubernetes", "Terraform"],
    level: "Mid-Level",
    questions: [
      "What is Infrastructure as Code (IaC)?",
      "Explain how Kubernetes manages container orchestration.",
    ],
    finalized: false,
    createdAt: "2025-03-19T14:20:00Z",
  },
];
