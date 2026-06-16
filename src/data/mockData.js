const MOCK_USERS = [
  { id:1, name:'AbdulSattar Majid', email:'abdulsattar@prepmate.com', plan:'Elite', status:'Active', time:'2m ago', avatar:'AM' },
  { id:2, name:'Muhammad Uzair', email:'uzair@prepmate.com', plan:'Pro', status:'Active', time:'14m ago', avatar:'MU' },
  { id:3, name:'Mr. Shakeel Ahmad', email:'supervisor@university.edu', plan:'Pro', status:'Paused', time:'1h ago', avatar:'SA' },
  { id:4, name:'Tipu Sultan', email:'tipu@example.com', plan:'Free', status:'Active', time:'3h ago', avatar:'TS' },
];

const COMMUNITY_POSTS = [
  { id:1, pinned:true,  author:'PrepMate Team', time:'2 days ago',  isAdmin:true,  tag:'ADMIN',              tagColor:'purple', title:'Community Guidelines & How to post anonymously', body:'Welcome to the PrepMate community! To ensure this is a safe and helpful space, please read our updated guidelines regarding salary sharing and…', upvotes:342, comments:12, views:null,   tags:[] },
  { id:2, pinned:false, author:'Alex Chen',    time:'4 hours ago', isAdmin:false, tag:'Interview Experience', tagColor:'blue',   title:'Passed Google L4 Frontend Interview! (Questions Included)', body:'I finally got the offer letter today! I wanted to give back to this community by sharing my experience. The process took about 6 weeks…', upvotes:156, comments:42, views:'2.1k', tags:['#google','#frontend','#offer'] },
  { id:3, pinned:false, author:'Sarah Jenkins',time:'8 hours ago', isAdmin:false, tag:'Question',             tagColor:'orange', title:'How do you handle "Tell me about a time you failed" without sounding incompetent?', body:'I always struggle with this behavioral question. I don\'t want to use a fake failure, but my real failures feel too big…', upvotes:89, comments:23, views:null, tags:[] },
  { id:4, pinned:false, author:'David Kim',    time:'1 day ago',   isAdmin:false, tag:'Salary',              tagColor:'green',  title:'Offer Evaluation: Amazon L5 vs Microsoft L62', body:'Total comp breakdown inside. Looking for advice on WLB and growth opportunities. Amazon offer is slightly higher TC but concerned about…', upvotes:210, comments:67, views:null, tags:['#amazon','#microsoft','#salary'] },
];

const PLANS = [
  { id:'free',  name:'Free',  price:'$0',   period:'forever', color:'ghost',  features:['5 mock interviews/mo','Basic resume scan','Community access','Question bank (limited)'], cta:'Get Started' },
  { id:'pro',   name:'Pro',   price:'$19',  period:'month',   color:'brand',  popular:true, features:['Unlimited mock interviews','Full resume analysis + AI rewrite','Priority community badge','Full question bank (500+)','Detailed performance analytics','Email weekly digest'], cta:'Start Free Trial' },
  { id:'elite', name:'Elite', price:'$39',  period:'month',   color:'purple', features:['Everything in Pro','Live 1:1 coach sessions','Custom job-tracking board','LinkedIn profile review','Referral network access','Dedicated account manager'], cta:'Go Elite' },
];

const INTERVIEW_QUESTIONS = [
  { id:1, category:'Behavioral', q:'Tell me about a time you had to lead a team through a difficult project. What was your approach?' },
  { id:2, category:'Technical',  q:'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?' },
  { id:3, category:'Behavioral', q:'Describe a situation where you disagreed with a manager. How did you handle it?' },
  { id:4, category:'Situational',q:'You just discovered a critical bug 30 minutes before a major product launch. Walk me through how you handle it.' },
  { id:5, category:'Technical',  q:'How would you design a URL shortener like bit.ly? Focus on scalability.' },
];
export { MOCK_USERS, COMMUNITY_POSTS, PLANS, INTERVIEW_QUESTIONS };