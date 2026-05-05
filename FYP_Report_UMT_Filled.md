# Final Year Project Documentation Report

## Project Name
Lahore Elite Weddings: Premium Wedding Planning and Venue Comparison Web Application

## Submitted By

| Sr. No. | Student Name | Student ID |
|---|---|---|
| 1 | Sherana Farooq | S2023332005 |
| 2 | Saifullah | S2023332009 |
| 3 | Hafiz Inam | S2023332026 |

Session: 2023-2027  
Project Supervisor: Sir Daniyal Adeeb  
Department Name: Department of Software Engineering  
School of Systems and Technology  
University of Management and Technology (UMT), Lahore

---

## Dedication
This project is dedicated to our parents, teachers, and mentors whose guidance, prayers, and support enabled us to complete this final year project. We especially acknowledge the mentorship of our supervisor, Sir Daniyal Adeeb.

---

## Final Approval (To Be Signed on Printed Copy)
Project Name: Lahore Elite Weddings: Premium Wedding Planning and Venue Comparison Web Application

Head of Department: ______________________  
Program Director (Final Year Projects): ______________________  
Supervisor (Sir Daniyal Adeeb): ______________________  
Co-Supervisor (If Any): ______________________  
Documentation Evaluator: ______________________

---

## Acknowledgment
We are deeply thankful to Allah Almighty for giving us the strength and consistency to complete this project. We express sincere gratitude to our respected supervisor, Sir Daniyal Adeeb, for his valuable guidance, technical feedback, and continuous encouragement throughout the development and documentation phases.

We also thank the Department of Software Engineering, School of Systems and Technology, University of Management and Technology, Lahore, for providing the academic environment and resources required for successful completion of this project.

Finally, we acknowledge our families and classmates for their moral support and motivation.

---

## Project Profile

| Item | Details |
|---|---|
| Project Title | Lahore Elite Weddings |
| Objective | To provide a centralized digital platform for venue discovery, budget estimation, vendor exploration, and wedding planning support in Lahore |
| Undertaken By | Sherana Farooq (S2023332005), Saifullah (S2023332009), Hafiz Inam (S2023332026) |
| Supervised By | Sir Daniyal Adeeb |
| Starting Date | September 2025 |
| Completion Date | April 2026 |
| Tools Used | Next.js, React, Tailwind CSS, JavaScript, Lucide React, Git/GitHub, VS Code |
| Operating System | Windows |
| Documentation | This report, architecture models, backlog, traceability, and implementation details |

---

## Plagiarism Report
Turnitin plagiarism similarity report must be attached in the final printed report and annexed in this section.

Current status for this draft:
- Turnitin Report: Pending attachment
- Similarity Percentage: To be updated after official scan
- Verified By: Supervisor

Note: Final submission should include a screenshot/PDF of Turnitin report.

---

## Pledge and Academic Integrity Statement
We hereby pledge that this Final Year Project report is our own academic work. All external sources, references, and learning materials have been properly cited where applicable. We understand and accept university policies regarding plagiarism and academic misconduct.

Student Signatures:
- Sherana Farooq: ______________________
- Saifullah: ______________________
- Hafiz Inam: ______________________

Date: ______________________

---

## Declaration Form
I have carefully examined the documentation of the Final Year Project titled "Lahore Elite Weddings: Premium Wedding Planning and Venue Comparison Web Application" and endorse that this documentation complies with undergraduate-level Final Year Project standards.

The document has been checked for plagiarism through Turnitin software available in UMT Library. The similarities are within acceptable range.

FYP Supervisor Name: Sir Daniyal Adeeb  
Signature: ______________________  
Date: ______________________

---

## Abstract
Lahore Elite Weddings is a web-based wedding planning platform developed to simplify wedding venue and service selection in Lahore. The platform enables users to browse premium marquees, compare venues side by side, estimate budgets through a pricing calculator, discover vendors, view testimonials, and track tasks through a wedding checklist.

The system is developed using Next.js and React for component-driven UI architecture and Tailwind CSS for responsive styling. A centralized context layer manages key user states such as favorites, comparisons, notifications, and date-based planning reminders.

The project addresses practical user pain points such as fragmented venue information, lack of transparent price ranges, and difficulty in managing wedding planning milestones. By combining discovery, planning, and decision-support modules in one interface, the system improves user convenience and planning confidence.

---

## Revision Chart

| Version | Primary Author(s) | Description of Version | Date Completed |
|---|---|---|---|
| Draft | Team | Initial report draft and project overview | 10-Apr-2026 |
| Preliminary | Team | Added architecture, backlog, and implementation details | 18-Apr-2026 |
| Final | Team | Finalized technical report with declarations and appendices | 27-Apr-2026 |

---

## Table of Contents
1. Introduction  
2. Domain Analysis  
3. Requirements Analysis  
4. Project Planning and Execution using Sprints  
5. System Architecture  
6. Implementation Details  
7. Project Monitoring, Control and Traceability  
8. Results/Output/Statistics  
9. Conclusion  
10. Future Work  
11. Bibliography  
12. Appendix

---

## Definitions and Acronyms

| Acronym | Definition |
|---|---|
| UMT | University of Management and Technology |
| FYP | Final Year Project |
| UI/UX | User Interface/User Experience |
| API | Application Programming Interface |
| DFD | Data Flow Diagram |
| ERD | Entity Relationship Diagram |
| NFR | Non-Functional Requirement |
| SEO | Search Engine Optimization |

---

## 1. Introduction

### 1.1 Problem Statement
In Lahore, wedding planning data is distributed across social media pages, individual vendor profiles, and informal referrals. Users often struggle to compare venues, estimate budgets transparently, and maintain planning progress. This results in delayed decisions, budget overruns, and poor coordination.

### 1.2 Objectives
- Build a centralized platform for discovering wedding marquees in Lahore.
- Provide comparison-based decision support for venue selection.
- Offer a dynamic budget calculator for key wedding cost categories.
- Provide categorized vendor exploration.
- Support user productivity through favorites, checklist, and timeline planning.

### 1.3 Scope of the Project
Included:
- Marquee listing and detail pages
- Vendor listing by category
- Budget calculator
- Favorites and comparison module
- Checklist and testimonial pages

Out of Scope:
- Real-time online payments
- Vendor-side dashboard and booking engine
- Live third-party ERP integration

### 1.4 Significance of the Project
The project provides a practical digital solution for local wedding planning and supports informed decision-making through structured venue and cost data. It also demonstrates full-stack web engineering concepts in a real-world domain.

### 1.5 Artificial Intelligence Features (Planned/Extensible)
- Price trend prediction using historical venue data
- Smart venue recommendation based on user budget and capacity
- Personalized vendor recommendations
- Conversational planning assistant for checklist guidance

### 1.6 Project Deliverables
- Functional web application (Next.js)
- Source code repository
- This final documentation report
- User flow, architecture, and backlog artifacts
- Testing and traceability evidence

---

## 2. Domain Analysis

### 2.1 Customer
Primary customers are engaged couples and families planning wedding events in Lahore who require trustworthy venue and vendor information along with budget planning support.

### 2.2 Stakeholders

| Stakeholder | Role in System |
|---|---|
| Bride/Groom and Family | Browse venues, compare options, estimate budget, track planning |
| Project Team | Build, test, and maintain the system |
| Supervisor | Guide project direction and quality |
| Venue Managers (Indirect) | Provide service, pricing, and venue feature information |
| Vendors (Indirect) | Offer photography, decor, catering, makeup, and entertainment services |
| University Evaluators | Assess report and implementation quality |

### 2.3 Affected Groups with Social or Economic Impact
- Wedding clients: Better transparency and better budget decisions
- Local vendors: Improved digital visibility and lead generation
- Families: Reduced planning stress and better decision confidence
- University students: Demonstration of software engineering best practices

### 2.4 Dependencies/External Systems
- Next.js runtime and React ecosystem
- Browser local storage for persisted user preferences
- External image/CDN links for media assets
- Optional deployment platform (e.g., Vercel)

### 2.5 Related Projects with Feature Comparison

#### 2.5.1 Related Projects
- WeddingWire
- The Knot
- Event management listing platforms
- Local social-media-based vendor directories

#### 2.5.2 Feature Comparison

| Feature | Generic Listing Sites | Social Media Pages | Lahore Elite Weddings |
|---|---|---|---|
| Lahore-focused marquee data | Partial | Partial | Yes |
| Side-by-side venue comparison | Limited | No | Yes |
| Wedding budget calculator | Rare | No | Yes |
| Vendor category organization | Partial | No | Yes |
| Checklist and planning flow | Rare | No | Yes |
| Unified platform experience | Partial | No | Yes |

### 2.6 Context Diagram
Main external entities:
- End user
- Venue data source
- Vendor data source
- Local browser storage

(Insert context diagram image in final Word version.)

### 2.7 Data Flow Diagram Level 0
Major processes:
- Venue discovery
- Budget estimation
- Favorites/compare management
- Checklist progress tracking
- Vendor browsing

(Insert DFD Level-0 image in final Word version.)

---

## 3. Requirements Analysis

### 3.1 List of Actors
- Visitor/User
- Planner (same user in advanced flow)
- System Administrator (future extension)
- External data provider (future extension)

### 3.2 Product Backlog

| PB-ID | User Story | Priority | Acceptance Criteria | Story Points | Status |
|---|---|---|---|---|---|
| PB-01 | As a user, I want to browse marquee listings so that I can explore wedding venues. | High | Venue cards load with key details and links to detail pages. | 5 | Done |
| PB-02 | As a user, I want to filter marquees by area/capacity/price so that I can shortlist quickly. | High | Filters update listing results correctly. | 8 | Done |
| PB-03 | As a user, I want to compare selected venues so that I can make better decisions. | High | Comparison page shows selected entries side by side. | 8 | Done |
| PB-04 | As a user, I want to save favorite venues so that I can revisit them later. | High | Favorites persist between sessions. | 5 | Done |
| PB-05 | As a user, I want a wedding budget calculator so that I can estimate event cost. | High | Calculator outputs total and category-wise values. | 13 | Done |
| PB-06 | As a user, I want to browse vendors by category so that I can find service providers. | Medium | Category-wise vendor data is available and searchable. | 8 | Done |
| PB-07 | As a user, I want a checklist so that I can track planning tasks. | Medium | Checklist state persists and can be updated. | 5 | Done |
| PB-08 | As a user, I want testimonial views so that I can evaluate social proof. | Low | Testimonials are shown with basic details. | 3 | Done |
| PB-09 | As a user, I want live price snapshots so that I can get current estimates. | Medium | API endpoint returns up-to-date price snapshot format. | 8 | Done |
| PB-10 | As a user, I want inquiry forms so that I can contact service providers. | Medium | Form accepts and validates key fields. | 5 | Done |

### 3.2.12 Non-Functional Requirements
- Usability: Clear, responsive UI on desktop and mobile
- Performance: Fast page rendering with Next.js
- Reliability: Stable routing and data flow
- Maintainability: Component-based project structure
- Security: Input handling and controlled client state

### 3.3 Figma UI/UX Designs
Design system and screen prototypes were created during planning and reflected in implemented pages (home, listing, details, calculator, vendors, compare, favorites, checklist).

(Insert Figma links/screens in final Word submission.)

---

## 4. Project Planning and Execution using Sprints

### 4.1 Jira
Sprint planning concepts were followed (backlog prioritization and milestone tracking).

### 4.2 Slack
Team communication was managed through direct discussion channels.

### 4.3 GitHub Repository
Source code versioning and history management performed through Git/GitHub workflow.

### 4.4 Sprint 1
- Duration: 2 weeks
- Focus: Base project setup, routing, data modules, primary UI components

#### 4.4.1 Sprint 1 Planning Meeting Minutes
- Finalized scope for homepage, marquee listing, and reusable components
- Assigned tasks for data modeling and page routing

#### 4.4.2 Sprint 1 Backlog
- Core scaffold and route setup
- Navbar/Footer and card components
- Initial marquee dataset integration

#### 4.4.3 Sprint 1 Design Class Diagram
(Insert class/component relationship diagram.)

#### 4.4.4 Sprint 1 Sequence Diagram
(Insert sequence flow for marquee listing and detail view.)

#### 4.4.5 Sprint 1 Decision Table
(Insert decision table for filter combinations.)

#### 4.4.6 Sprint 1 Extended Test Cases
(Insert test case matrix for core routes and filters.)

#### 4.4.7 Sprint 1 Review Meeting
- Completed foundational pages and navigation
- Identified improvements for styling consistency and component props

#### 4.4.8 Sprint 1 Retrospective Meeting
- What went well: clear module boundaries, reusable components
- What to improve: earlier test case authoring, stronger acceptance criteria mapping

---

## 5. System Architecture

### 5.1 System Context Diagram
System interacts with end-users, local storage, and static/data modules.

### 5.2 System Container Diagram
- Frontend Web App (Next.js)
- Data Modules (JavaScript files)
- API Route for price snapshot
- Browser local storage

### 5.3 Component Diagram
Key components include Navbar, Footer, MarqueeCard, VendorCard, SearchModal, FavoriteButton, CompareButton, CountdownTimer, and NotificationToast.

### 5.4 Code Diagrams
Architecture follows page-based routing and reusable component composition with centralized context provider.

### 5.5 ERD
Conceptual entities:
- Venue
- Vendor
- Testimonial
- UserPreference (favorites, compare list, checklist state)

### 5.6 Data Dictionary
- Venue: id, name, slug, location, area, capacity, rating, pricing, amenities
- Vendor: id, name, type, services, priceRange, rating, contact
- Testimonial: id, author, venue, review, rating
- ChecklistItem: id, title, category, completed

---

## 6. Implementation Details

### 6.1 Development Setup
- Node.js and npm installation
- Dependency installation through package manager
- Development server execution on configured port (4000)

### 6.2 Deployment Setup
- Production build supported through Next.js build/start scripts
- Ready for deployment on cloud platforms supporting Node.js

### 6.3 Algorithms
- Dynamic filtering by multiple criteria
- Cost aggregation logic in budget calculator
- Persisted state retrieval and updates for user actions

### 6.4 Constraints

#### 6.4.1 Assumptions
- Users have internet access and modern browsers
- Base pricing data is periodically maintained by admins/team

#### 6.4.2 System Constraints
- Current dataset is static/semi-static
- No integrated payment or booking workflow

#### 6.4.3 Restrictions
- Limited to Lahore market use-case in current release

#### 6.4.4 Limitations
- No user authentication module in current version
- No live booking confirmation from venues/vendors

---

## 7. Project Monitoring, Control and Traceability

### 7.1 Traceability Matrix

#### 7.1.1 Requirements vs Prototype (PB-ID vs PID)

| PB-ID | Prototype/Module |
|---|---|
| PB-01 | Venue listing page |
| PB-02 | Filter controls and query flow |
| PB-03 | Compare page |
| PB-04 | Favorites page and buttons |
| PB-05 | Calculator page |
| PB-06 | Vendors page |
| PB-07 | Checklist page |
| PB-08 | Testimonials page |
| PB-09 | API live prices module |
| PB-10 | Inquiry form component |

#### 7.1.2 Requirements vs Test Cases (PB-ID vs TID)

| PB-ID | Test Case ID | Status |
|---|---|---|
| PB-01 | TID-01 Venue cards render | Pass |
| PB-02 | TID-02 Filter combinations | Pass |
| PB-03 | TID-03 Compare add/remove | Pass |
| PB-04 | TID-04 Favorites persist | Pass |
| PB-05 | TID-05 Budget total accuracy | Pass |
| PB-06 | TID-06 Vendor category listing | Pass |
| PB-07 | TID-07 Checklist state update | Pass |
| PB-08 | TID-08 Testimonial rendering | Pass |
| PB-09 | TID-09 API snapshot response | Pass |
| PB-10 | TID-10 Inquiry form validation | Pass |

---

## 8. Results/Output/Statistics

### 8.1 % Completion
Estimated functional completion: 90% (core modules implemented and integrated).

### 8.2 % Accuracy
Budget and display logic accuracy (based on manual verification test cases): 90%+.

### 8.3 % Correctness
Core user flows (browse, filter, compare, favorites, calculator, checklist): Working as expected in local testing.

---

## 9. Conclusion
Lahore Elite Weddings successfully demonstrates a practical, user-centric wedding planning platform tailored to the Lahore market. The solution combines modern web technologies with structured software engineering practices to deliver an application that supports venue discovery, budget planning, and planning assistance in a single workflow.

The project also reflects the application of domain analysis, requirements engineering, sprint execution, architecture planning, and traceability discipline expected from an undergraduate final year project.

---

## 10. Future Work
- Integrate secure user authentication and role-based dashboards
- Add online booking and payment gateway support
- Integrate live vendor/venue APIs and availability calendars
- Add analytics dashboard for planning insights
- Integrate AI-powered recommendation and chatbot planning assistant

---

## 11. Bibliography

### 11.1 Books
- Ian Sommerville, Software Engineering, 10th Edition
- Robert C. Martin, Clean Architecture

### 11.2 Journals
- Research articles on event management systems and recommendation systems

### 11.3 Articles
- Official React and Next.js documentation
- Tailwind CSS documentation

### 11.4 Research Papers
- Literature on decision support systems and marketplace UX

### 11.5 Other References
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com/docs

---

## 12. Appendix

### 12.1 Glossary of Terms
- Marquee: Wedding venue/hall used for events
- Story Point: Relative estimate for agile backlog effort
- Traceability Matrix: Mapping between requirements and validation artifacts

### 12.2 Pre-requisites
- Node.js 18+
- npm package manager
- Modern browser
- Local machine with internet access

---

## Notes for Final Word Submission
- Insert signed approval page and declaration page in printed copy.
- Attach official Turnitin report in Plagiarism Report section.
- Insert actual figures/tables where placeholders are marked.
- Update page numbers and Table of Contents in Word using update fields.
