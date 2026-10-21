# OpteraAI

## An Intelligent Multi-Agent AI Productivity Platform

> One Dashboard. Multiple Intelligent Agents. Automated Workflows.

---

## 1. Team Details

**Team Name:** DarkElixir

**Team Leader:** Dharani Vasan V

**Team Members:**
1. Dharani Vasan V - Team Leader
2. Maheswara Pandiyan A
3. Sivaganesh B
4. Santhosh A P

---

## 2. Problem Statement

Students and professionals receive a large amount of information through emails, meetings, internships, hackathons, certifications, scholarships, jobs, and academic opportunities.

Managing this information manually requires users to read and categorize emails, identify important opportunities, prioritize deadlines, extract useful information, download and organize documents, attend and manage meetings, maintain resumes, search for additional information, apply to opportunities, manage calendars and reminders, and track learning and career progress.

Because these activities are distributed across different platforms, users spend significant time on repetitive tasks and may miss important opportunities or deadlines.

Existing productivity applications generally address individual tasks rather than providing an integrated system that can understand information and execute the required workflow automatically.

---

## 3. Solution Overview

OpteraAI is a unified multi-agent AI productivity platform that transforms unstructured information into intelligent, actionable workflows.

After authenticating through Google OAuth, OpteraAI can synchronize the user's Gmail, classify incoming information, determine priority, extract important details, process documents, manage meetings, build a personal knowledge base, provide career and learning guidance, automate applications, manage calendars, deliver notifications, and generate productivity analytics.

The platform uses specialized AI agents, with each agent responsible for a specific function while collaborating through APIs and a shared PostgreSQL database.

All functionality is accessible through a single unified dashboard. Users do not need to switch between separate agent dashboards.

---

## 4. System Workflow

```text
                         Google OAuth
                              |
                              v
                     Unified Dashboard
                              |
                              v
                       Watcher Agent
                              |
                              v
                   Classification Agent
                              |
                              v
                       Priority Agent
                              |
                              v
                       Research Agent
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
        Search Agent    Document Agent   Meeting Agent
              |               |               |
              +---------------+---------------+
                              |
                              v
                       Knowledge Agent
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
         Career Agent   Learning Agent    Resume Agent
              |               |               |
              +---------------+---------------+
                              |
                              v
                    Application Agent
                              |
                              v
                      Calendar Agent
                              |
                              v
                   Notification Agent
                              |
                              v
                     Analytics Agent
                              |
                              v
                    Supervisor Agent
```

---

## 5. AI Agents

OpteraAI consists of 16 specialized AI agents.

| No. | Agent | Primary Responsibility |
|---|---|---|
| 1 | Watcher Agent | Monitors and synchronizes Gmail |
| 2 | Classification Agent | Categorizes incoming emails and information |
| 3 | Priority Agent | Determines importance and urgency |
| 4 | Research Agent | Extracts structured information from unstructured content |
| 5 | Search Agent | Searches and verifies information from online sources |
| 6 | Document Agent | Downloads, processes, categorizes, and manages documents |
| 7 | Knowledge Agent | Provides RAG-based personal knowledge retrieval |
| 8 | Meeting Agent | Automates online meetings and generates transcripts |
| 9 | Career Agent | Provides personalized career guidance |
| 10 | Learning Agent | Creates personalized learning roadmaps |
| 11 | Resume Agent | Manages and optimizes resumes |
| 12 | Application Agent | Automates supported application forms |
| 13 | Calendar Agent | Manages events, deadlines, and schedules |
| 14 | Notification Agent | Delivers intelligent notifications and reminders |
| 15 | Analytics Agent | Provides productivity and activity analytics |
| 16 | Supervisor Agent | Monitors agent health and coordinates workflows |

---

## 6. Agent Responsibilities

### 6.1 Watcher Agent

The Watcher Agent continuously monitors the user's Gmail account.

Responsibilities:
- Gmail synchronization
- Detect new emails
- Retrieve email content
- Retrieve email metadata
- Detect attachments
- Forward new information to downstream agents

### 6.2 Classification Agent

The Classification Agent identifies the type of incoming information.

Example categories:
- Internship
- Hackathon
- Job
- Meeting
- Certificate
- Scholarship
- Event
- Bill
- Academic information

Responsibilities:
- Email classification
- Category detection
- Classification confidence
- Assign appropriate processing workflow

### 6.3 Priority Agent

The Priority Agent determines the urgency and importance of information.

Priority levels:
- Emergency
- High
- Medium
- Low

Responsibilities:
- Deadline analysis
- Urgency detection
- Priority assignment
- Priority scoring

### 6.4 Research Agent

The Research Agent converts unstructured information into structured information.

It extracts:
- Deadlines
- Tasks
- Meeting details
- Application links
- Contacts
- Internship information
- Hackathon information
- Certificate information
- Important instructions
- Summaries

### 6.5 Search Agent

The Search Agent retrieves additional information when available information is incomplete.

Responsibilities:
- Search official websites
- Verify information
- Find missing details
- Retrieve relevant URLs
- Find downloadable resources
- Provide additional context to the Research Agent

### 6.6 Document Agent

The Document Agent manages documents used throughout the platform.

Responsibilities:
- Download PDFs
- Download certificates
- Process email attachments
- Extract text from documents
- Process PDF and DOCX files
- Categorize documents
- Store document metadata
- Detect duplicate documents
- Maintain document history
- Provide documents to other agents

Primary consumers:
- Knowledge Agent
- Research Agent
- Career Agent
- Application Agent
- Resume Agent

### 6.7 Knowledge Agent

The Knowledge Agent provides a personal RAG-based knowledge system.

RAG pipeline:

```text
Documents / Information
          |
          v
     Text Extraction
          |
          v
    Vector Embeddings
          |
          v
       ChromaDB
          |
          v
       User Query
          |
          v
    Query Embedding
          |
          v
   Cosine Similarity
          |
          v
       Top-K Results
          |
          v
       Groq API
          |
          v
      AI Response
```

Responsibilities:
- Generate embeddings
- Store vectors
- Perform semantic search
- Retrieve relevant information
- Generate contextual answers
- Provide source references

### 6.8 Meeting Agent

The Meeting Agent automates online meeting workflows.

Responsibilities:
- Process meeting links
- Join supported online meetings
- Record meeting audio
- Generate transcripts
- Extract action items
- Store meeting information
- Provide meeting summaries

### 6.9 Career Agent

The Career Agent provides personalized career assistance.

Responsibilities:
- Resume analysis
- Career-path recommendations
- Skill-gap identification
- Job recommendations
- Internship recommendations
- Certification recommendations
- Career roadmap generation

### 6.10 Learning Agent

The Learning Agent creates personalized learning plans.

Responsibilities:
- Learning roadmaps
- Course recommendations
- Project recommendations
- Certification recommendations
- Skill development plans
- Learning progress tracking

### 6.11 Resume Agent

The Resume Agent manages and optimizes user resumes.

Responsibilities:
- Master resume management
- Resume updates
- Resume versioning
- Customized resumes
- ATS-oriented optimization
- Resume generation
- Resume downloads

### 6.12 Application Agent

The Application Agent automates supported online application workflows.

Supported platforms:
- Google Forms
- Microsoft Forms

Workflow:

```text
Opportunity
     |
     v
Application Link
     |
     v
Application Agent
     |
     v
User Profile + Resume
     |
     v
Detect Form Fields
     |
     v
Fill Required Fields
     |
     v
Upload Documents
     |
     v
Submit Application
     |
     v
Store Application Status
```

The agent uses information already available in the user's profile and resume instead of requiring users to repeatedly enter the same information.

### 6.13 Calendar Agent

The Calendar Agent manages scheduling and deadlines.

Responsibilities:
- Create calendar events
- Schedule meetings
- Track deadlines
- Detect scheduling conflicts
- Create reminder schedules
- Generate notification jobs
- Update events

### 6.14 Notification Agent

The Notification Agent handles scheduled notifications.

Features:
- Browser notifications
- Dashboard notifications
- Custom notification sounds
- Snooze
- Quiet hours
- Notification history
- Delivery tracking
- User notification preferences

### 6.15 Analytics Agent

The Analytics Agent provides productivity insights.

Tracks:
- Emails processed
- Opportunities discovered
- Applications submitted
- Meetings
- Learning progress
- Notifications
- Agent activity

Provides:
- Productivity dashboards
- Reports
- Statistics
- Progress insights

### 6.16 Supervisor Agent

The Supervisor Agent monitors the overall multi-agent ecosystem.

Responsibilities:
- Monitor agent health
- Track agent status
- Detect failures
- Monitor workflows
- Track errors
- Monitor service performance
- Coordinate agent execution

---

## 7. Unified Dashboard

OpteraAI provides a single unified dashboard for all agent functionality.

Users never need to open separate agent dashboards.

Dashboard modules:

1. Home
2. Inbox
3. Opportunities
4. Documents
5. Calendar
6. Meetings
7. Knowledge
8. Career
9. Learning
10. Resume
11. Applications
12. Notifications
13. Analytics
14. AI Agents
15. Settings

The unified dashboard provides:

- Gmail activity
- Email classifications
- Priority information
- Extracted opportunities
- Document management
- Meeting information
- Personal knowledge search
- Career recommendations
- Learning roadmaps
- Resume management
- Application automation
- Calendar events
- Notifications
- Productivity analytics
- Agent health monitoring

---

## 8. Example End-to-End Workflow

When an internship email arrives:

```text
Gmail
  |
  v
Watcher Agent
  |
  v
Classification Agent
  |
  |--> Internship
  |
  v
Priority Agent
  |
  |--> High Priority
  |
  v
Research Agent
  |
  +--> Company
  +--> Role
  +--> Deadline
  +--> Skills
  +--> Application URL
  |
  +----------------------+
  |                      |
  v                      v
Search Agent         Document Agent
  |                      |
  v                      v
Verify Details       Process Files
  |                      |
  +----------+-----------+
             |
             v
      Unified Dashboard
             |
             v
      Application Agent
             |
             v
         Auto Fill
             |
             v
          Submit
             |
             v
       Calendar Agent
             |
             v
     Notification Agent
             |
             v
       Analytics Agent
```

---

## 9. Technology Stack

### 9.1 Frontend

- React.js
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Recharts
- Zustand

### 9.2 Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Uvicorn
- APScheduler

### 9.3 Database

- PostgreSQL
- Render PostgreSQL

### 9.4 AI and RAG

- Groq API
- Sentence Transformers
- Vector Embeddings
- Retrieval-Augmented Generation
- Cosine Similarity
- ChromaDB

### 9.5 Automation

- Playwright

### 9.6 Meeting Processing

- Whisper
- FFmpeg
- Playwright

### 9.7 Document Processing

- PyMuPDF
- pdfplumber
- python-docx
- OCR where required

### 9.8 Authentication and Integration

- Google OAuth
- JWT
- Gmail API

### 9.9 Deployment

- Render

---

## 10. Authentication

OpteraAI uses Google OAuth authentication.

Login workflow:

```text
Google OAuth
     |
     v
User Authentication
     |
     v
Create / Retrieve User
     |
     v
Session / JWT
     |
     v
Unified Dashboard
```

After successful authentication, the user is taken directly to the unified dashboard.

---

## 11. Database

PostgreSQL is used as the central relational database for application data.

The database manages information such as:

- Users
- Gmail accounts
- Emails
- Classifications
- Priorities
- Research results
- Documents
- Meetings
- Resumes
- Applications
- Calendar events
- Notification jobs
- Notification history
- Career data
- Learning progress
- Analytics

The vector knowledge layer is handled separately using ChromaDB.

---

## 12. Live Demonstration

**Live Demo:** YOUR_LIVE_DEMO_LINK

---

## 13. Setup Instructions

Setup instructions will be added by the team.

This section will include:

- Repository cloning
- Environment variable configuration
- Google OAuth configuration
- PostgreSQL configuration
- Backend installation
- Frontend installation
- AI API configuration
- ChromaDB configuration
- Playwright installation
- Local development
- Production deployment

---

## 14. Team Members

| Role | Name |
|---|---|
| Team Leader | YOUR_NAME |
| Team Member | MEMBER_2 |
| Team Member | MEMBER_3 |
| Team Member | MEMBER_4 |

---

## 15. Project Impact

OpteraAI aims to reduce the repetitive work required to manage academic and professional opportunities.

Traditional workflow:

```text
Read -> Understand -> Prioritize -> Organize -> Apply -> Schedule -> Remember
```

OpteraAI workflow:

```text
Receive
   |
   v
Understand
   |
   v
Prioritize
   |
   v
Extract
   |
   v
Organize
   |
   v
Act
   |
   v
Notify
   |
   v
Track
```

This helps users spend less time on administrative work and more time on learning, career development, and meaningful work.

---

## 16. Future Scope

Potential future improvements include:

1. Mobile application
2. Additional email providers
3. Additional meeting platforms
4. More application platforms
5. Advanced agent orchestration
6. Mobile push notifications
7. Multi-language support
8. Enterprise deployment
9. Advanced career matching
10. Personalized workflow automation

---

## 17. License

Add the project's license here.

Example:

```text
MIT License
```

---

## 18. Acknowledgements

OpteraAI is built using open-source technologies and services including:

- Python
- FastAPI
- React
- PostgreSQL
- Playwright
- ChromaDB
- Sentence Transformers
- Whisper
- Groq API
- Google APIs

---

## 19. Project Objective

The primary objective of OpteraAI is to transform scattered academic and professional information into automated, actionable workflows.

The platform combines specialized AI agents, automation, information extraction, document processing, RAG-based knowledge retrieval, scheduling, application automation, and analytics into one unified productivity platform.

---

## 20. Conclusion

OpteraAI provides a unified approach to managing academic and professional activities through specialized AI agents. By connecting email intelligence, opportunity discovery, document processing, meetings, knowledge management, career development, learning, applications, scheduling, notifications, and analytics, the platform reduces repetitive work and enables users to manage their workflows from a single interface.

---

# OpteraAI

**One Dashboard. Multiple Intelligent Agents. Automated Workflows.**
