// Rich demo data so recruiters/testers can explore ProConnect instantly
// No backend/server needed — all data lives in Redux

export const DEMO_USER = {
  id: "demo_user_001",
  name: "Sarah Chen",
  email: "sarah.chen@demo.com",
  username: "sarahchen",
  profilePicture: "", // will use default avatar
};

export const DEMO_PROFILE = {
  userId: "demo_user_001",
  bio: "Full-stack developer passionate about building products that make a difference. 6+ years of experience in React, Node.js, and cloud architecture. Open to mentoring junior devs and speaking at tech conferences.",
  currentPost: "Senior Software Engineer at TechVista Inc.",
  education: [
    { school: "Stanford University", degree: "M.S.", fieldOfStudy: "Computer Science" },
    { school: "UC Berkeley", degree: "B.S.", fieldOfStudy: "Electrical Engineering & Computer Science" },
  ],
  work: [
    { company: "TechVista Inc.", position: "Senior Software Engineer", years: 3 },
    { company: "StartupGrid", position: "Full-Stack Developer", years: 2 },
    { company: "Google", position: "Software Engineering Intern", years: 1 },
  ],
};

export const DEMO_ALL_USERS = [
  { userId: { _id: "demo_user_001", name: "Sarah Chen", username: "sarahchen", email: "sarah.chen@demo.com", profilePicture: "" }, bio: DEMO_PROFILE.bio, currentPost: DEMO_PROFILE.currentPost, education: DEMO_PROFILE.education, work: DEMO_PROFILE.work },
  { userId: { _id: "demo_user_002", name: "Marcus Johnson", username: "marcusj", email: "marcus.j@demo.com", profilePicture: "" }, bio: "Product Manager with a knack for turning chaos into clarity. Love building products users rave about.", currentPost: "Product Lead at InnovateLab", education: [{ school: "MIT", degree: "MBA", fieldOfStudy: "Business Administration" }], work: [{ company: "InnovateLab", position: "Product Lead", years: 4 }] },
  { userId: { _id: "demo_user_003", name: "Priya Patel", username: "priyapatel", email: "priya.p@demo.com", profilePicture: "" }, bio: "UX Designer obsessed with micro-interactions and accessibility. Designing for humans, not screens.", currentPost: "Senior UX Designer at DesignCraft Studio", education: [{ school: "RISD", degree: "BFA", fieldOfStudy: "Graphic Design" }], work: [{ company: "DesignCraft Studio", position: "Senior UX Designer", years: 5 }] },
  { userId: { _id: "demo_user_004", name: "Alex Rodriguez", username: "alexrod", email: "alex.r@demo.com", profilePicture: "" }, bio: "Data scientist by day, open-source contributor by night. Python, ML, and the occasional blog post.", currentPost: "Data Scientist at DataDriven Co.", education: [{ school: "Carnegie Mellon", degree: "Ph.D.", fieldOfStudy: "Machine Learning" }], work: [{ company: "DataDriven Co.", position: "Data Scientist", years: 2 }] },
  { userId: { _id: "demo_user_005", name: "Emily Watson", username: "emilyw", email: "emily.w@demo.com", profilePicture: "" }, bio: "Marketing strategist who believes storytelling is the most powerful tool in business.", currentPost: "Head of Marketing at GrowthGenius", education: [{ school: "NYU", degree: "B.A.", fieldOfStudy: "Marketing & Communications" }], work: [{ company: "GrowthGenius", position: "Head of Marketing", years: 4 }] },
];

export const DEMO_POSTS = [
  {
    _id: "demo_post_001",
    body: "Just wrapped up an incredible project migrating our entire frontend to React 18 with server components. The performance gains are unreal — 40% faster LCP and 25% reduction in bundle size. If you're on the fence about upgrading, do it. Happy to share our migration playbook if anyone's interested! \n\n#React #WebDev #PerformanceOptimization",
    likes: 142,
    media: "",
    fileType: "",
    createdAt: "2026-07-25T10:30:00Z",
    userId: { _id: "demo_user_001", name: "Sarah Chen", username: "sarahchen", profilePicture: "" },
  },
  {
    _id: "demo_post_002",
    body: "Thrilled to announce that I'll be speaking at DevConf 2026 this September! I'll be talking about 'Scaling Microservices Without Losing Your Mind' — a topic very close to my heart after the last 18 months at TechVista. Who else is going? Would love to connect in person!",
    likes: 87,
    media: "",
    fileType: "",
    createdAt: "2026-07-24T14:15:00Z",
    userId: { _id: "demo_user_001", name: "Sarah Chen", username: "sarahchen", profilePicture: "" },
  },
  {
    _id: "demo_post_003",
    body: "Hot take: The best product managers aren't the ones with the fanciest MBAs. They're the ones who spend the most time talking to actual users. I do 5 customer interviews every single week. No exceptions. It's uncomfortable, it's time-consuming, but it's the single biggest reason our products actually solve real problems.",
    likes: 256,
    media: "",
    fileType: "",
    createdAt: "2026-07-23T09:00:00Z",
    userId: { _id: "demo_user_002", name: "Marcus Johnson", username: "marcusj", profilePicture: "" },
  },
  {
    _id: "demo_post_004",
    body: "Just published a new case study on how we redesigned a healthcare app's onboarding flow and increased completion rates from 34% to 78%. The key insight: progressive disclosure isn't just a buzzword — it's the difference between a frustrated user and a delighted one. Link in comments!",
    likes: 198,
    media: "",
    fileType: "",
    createdAt: "2026-07-22T16:45:00Z",
    userId: { _id: "demo_user_003", name: "Priya Patel", username: "priyapatel", profilePicture: "" },
  },
  {
    _id: "demo_post_005",
    body: "I just open-sourced my side project — a lightweight Python library for automated EDA (Exploratory Data Analysis) that generates beautiful reports with one line of code. Built it because I was tired of writing the same 50 lines of matplotlib every time. Check it out: github.com/… Star it if you find it useful! \n\n#OpenSource #Python #DataScience",
    likes: 315,
    media: "",
    fileType: "",
    createdAt: "2026-07-21T11:00:00Z",
    userId: { _id: "demo_user_004", name: "Alex Rodriguez", username: "alexrod", profilePicture: "" },
  },
  {
    _id: "demo_post_006",
    body: "Storytelling isn't just for writers and filmmakers. In B2B marketing, the companies that tell the best stories win. Not the ones with the biggest budgets. We grew our pipeline 3x last quarter by completely rethinking our narrative strategy — focusing on customer transformation stories instead of feature lists. Marketing friends — what's the best story your brand has told?",
    likes: 173,
    media: "",
    fileType: "",
    createdAt: "2026-07-20T08:30:00Z",
    userId: { _id: "demo_user_005", name: "Emily Watson", username: "emilyw", profilePicture: "" },
  },
];

export const DEMO_COMMENTS = {
  "demo_post_001": [
    { _id: "c1", body: "This is super helpful, Sarah! We're planning our migration next quarter. Would love to see that playbook.", userId: { _id: "demo_user_002", name: "Marcus Johnson", username: "marcusj", profilePicture: "" } },
    { _id: "c2", body: "40% LCP improvement is massive! Did you guys also implement code splitting or was it mainly the server components?", userId: { _id: "demo_user_004", name: "Alex Rodriguez", username: "alexrod", profilePicture: "" } },
  ],
  "demo_post_003": [
    { _id: "c3", body: "Couldn't agree more. The best PM I ever worked with had zero formal training but was relentless about user research.", userId: { _id: "demo_user_005", name: "Emily Watson", username: "emilyw", profilePicture: "" } },
    { _id: "c4", body: "5 per week is ambitious! How do you structure those interviews? Curious about your methodology.", userId: { _id: "demo_user_001", name: "Sarah Chen", username: "sarahchen", profilePicture: "" } },
  ],
  "demo_post_005": [
    { _id: "c5", body: "Just starred it! This is exactly what I needed for my current project. Thank you for open-sourcing!", userId: { _id: "demo_user_003", name: "Priya Patel", username: "priyapatel", profilePicture: "" } },
    { _id: "c6", body: "Amazing work Alex! Have you considered adding support for Polars DataFrames?", userId: { _id: "demo_user_002", name: "Marcus Johnson", username: "marcusj", profilePicture: "" } },
  ],
};

export const DEMO_CONNECTIONS = [
  { _id: "conn_1", userId: "demo_user_001", connectedUserId: { _id: "demo_user_002", name: "Marcus Johnson", username: "marcusj", email: "marcus.j@demo.com", profilePicture: "" }, status_accepted: true },
  { _id: "conn_2", userId: "demo_user_001", connectedUserId: { _id: "demo_user_003", name: "Priya Patel", username: "priyapatel", email: "priya.p@demo.com", profilePicture: "" }, status_accepted: true },
  { _id: "conn_3", userId: "demo_user_001", connectedUserId: { _id: "demo_user_004", name: "Alex Rodriguez", username: "alexrod", email: "alex.r@demo.com", profilePicture: "" }, status_accepted: false },
];

export const DEMO_CONNECTION_REQUESTS = [
  DEMO_CONNECTIONS[2], // Alex's pending request
];
