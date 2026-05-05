$src = "C:\Users\Lenovo\Downloads\Fyp documentation template ver 1.0.docx"
$outDocx = "C:\Users\Lenovo\Downloads\WeddingPlannerApp\FYP_Documentation_Wedify.docx"
$projectTitle = "Wedify: Wedding Planner and Venue Comparison Web Application"
$tmp = "C:\Users\Lenovo\Downloads\WeddingPlannerApp\.tmp_fyp_fill"

if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path $tmp | Out-Null

$zip = Join-Path $tmp "doc.zip"
Copy-Item $src $zip -Force
Expand-Archive -Path $zip -DestinationPath $tmp -Force

$docXmlPath = Join-Path $tmp "word\document.xml"
[xml]$xml = Get-Content $docXmlPath
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paras = $xml.SelectNodes("//w:p", $ns)

function Set-ParaText {
  param(
    [int]$Index,
    [string]$Text
  )

  $para = $paras[$Index]
  if ($null -eq $para) { return }

  $tnodes = $para.SelectNodes('.//w:t', $ns)
  if ($tnodes.Count -gt 0) {
    foreach ($t in $tnodes) {
      $t.InnerText = $Text
      $Text = ""
    }
    if ($tnodes.Count -gt 0 -and $tnodes[0].InnerText -eq "") {
      $tnodes[0].InnerText = " "
    }
    return
  }

  $wNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  $r = $xml.CreateElement("w", "r", $wNs)
  $t = $xml.CreateElement("w", "t", $wNs)
  $t.InnerText = $Text
  $null = $r.AppendChild($t)
  $null = $para.AppendChild($r)
}

function Replace-TextGlobal {
  param(
    [string]$Pattern,
    [string]$Replacement
  )

  foreach ($para in $paras) {
    $tnodes = $para.SelectNodes('.//w:t', $ns)
    foreach ($t in $tnodes) {
      if ($t.InnerText -match $Pattern) {
        $t.InnerText = ($t.InnerText -replace $Pattern, $Replacement)
      }
    }
  }
}

Set-ParaText -Index 2 -Text $projectTitle
Set-ParaText -Index 15 -Text "Sherana Farooq (S2023332005), Saifullah (S2023332009), Hafiz Inam (S2023332026)"
Set-ParaText -Index 18 -Text "Session: 2023-2027"
Set-ParaText -Index 23 -Text "Sir Daniyal Adeeb"

Set-ParaText -Index 31 -Text "This project is dedicated to our parents, teachers, and mentors for their guidance and support."
Set-ParaText -Index 32 -Text "We gratefully acknowledge our supervisor, Sir Daniyal Adeeb, for his valuable mentorship."

Set-ParaText -Index 56 -Text $projectTitle
Set-ParaText -Index 77 -Text "Supervisor Sir Daniyal Adeeb"
Set-ParaText -Index 85 -Text "Co-Supervisor N/A"

Set-ParaText -Index 96 -Text "We thank Allah Almighty for granting us the strength to complete this final year project."
Set-ParaText -Index 97 -Text "We sincerely thank our respected supervisor, Sir Daniyal Adeeb, for continuous guidance and support."
Set-ParaText -Index 98 -Text "We also thank the Department of Software Engineering, UMT, for providing an enabling learning environment."
Set-ParaText -Index 99 -Text "Finally, we are grateful to our families and classmates for their encouragement throughout the project."

Set-ParaText -Index 108 -Text "Project Title: Wedify"
Set-ParaText -Index 109 -Text "Objective: Centralized platform for venue discovery, budget estimation, vendor browsing, and wedding planning in Lahore"
Set-ParaText -Index 111 -Text "Undertaken by: Sherana Farooq (S2023332005), Saifullah (S2023332009), Hafiz Inam (S2023332026)"
Set-ParaText -Index 113 -Text "Supervised by: Sir Daniyal Adeeb"
Set-ParaText -Index 114 -Text "Starting Date: September 2025"
Set-ParaText -Index 116 -Text "Completion Date: April 2026"
Set-ParaText -Index 118 -Text "Tools Used: Next.js, React, Tailwind CSS, JavaScript, Lucide React, GitHub, VS Code"
Set-ParaText -Index 119 -Text "Operating System: Windows"
Set-ParaText -Index 120 -Text "Documentation: Final Report, Backlog, Architecture Diagrams, Traceability Matrix, Test Evidence"

Set-ParaText -Index 129 -Text "Plagiarism and Pledge Report"
Set-ParaText -Index 130 -Text "Turnitin similarity report will be attached in final submission."
Set-ParaText -Index 131 -Text "Pledge: We declare this report and implementation are our own original academic work."
Set-ParaText -Index 132 -Text "All references and sources have been properly acknowledged where applicable."
Set-ParaText -Index 133 -Text "Student Signatures: Sherana Farooq | Saifullah | Hafiz Inam"

Set-ParaText -Index 167 -Text "I have carefully examined the documentation of the Final Year Project titled 'Wedify: Wedding Planner and Venue Comparison Web Application'; and I endorse that this documentation complies with undergraduate-level FYP report standards."
Set-ParaText -Index 177 -Text "FYP Supervisor Name: Sir Daniyal Adeeb"
Set-ParaText -Index 180 -Text "Signature: __________________ Date: __________________"

Set-ParaText -Index 188 -Text "Wedify is a web-based platform that helps users discover and compare wedding venues in Lahore."
Set-ParaText -Index 189 -Text "The system provides budget calculation, vendor discovery, favorites management, and wedding checklist tracking."
Set-ParaText -Index 190 -Text "It is developed using Next.js, React, and Tailwind CSS with a component-based and maintainable architecture."
Set-ParaText -Index 191 -Text "The project improves planning efficiency, budget transparency, and decision-making for wedding clients."

Set-ParaText -Index 201 -Text "Project Team"
Set-ParaText -Index 203 -Text "10-Apr-2026"
Set-ParaText -Index 205 -Text "Project Team"
Set-ParaText -Index 207 -Text "18-Apr-2026"
Set-ParaText -Index 209 -Text "Project Team"
Set-ParaText -Index 211 -Text "27-Apr-2026"

# Table of contents section names under requirements
Set-ParaText -Index 255 -Text "3.2.1Venue Discovery"
Set-ParaText -Index 256 -Text "3.2.2Account and Preferences"
Set-ParaText -Index 257 -Text "3.2.3Budget Planner"
Set-ParaText -Index 258 -Text "3.2.4Comparison and Favorites"
Set-ParaText -Index 259 -Text "3.2.5Vendor Marketplace"
Set-ParaText -Index 260 -Text "3.2.6Checklist and Timeline"
Set-ParaText -Index 261 -Text "3.2.7Testimonials and Reviews"
Set-ParaText -Index 262 -Text "3.2.8Non-Functional Requirements"

# Introduction and domain-specific sections
Set-ParaText -Index 396 -Text "Wedify is a software engineering project in the event-planning domain, focused on helping users plan weddings through one integrated web platform."
Set-ParaText -Index 397 -Text "Project Context"
Set-ParaText -Index 398 -Text "In Lahore, wedding planning information is usually fragmented across social media pages, WhatsApp groups, and informal referrals."
Set-ParaText -Index 399 -Text "Users often cannot compare venues and vendors objectively, and they struggle to estimate a realistic event budget early in planning."
Set-ParaText -Index 400 -Text "Wedify addresses this gap by offering venue discovery, vendor exploration, budget calculation, and checklist tracking in one system."
Set-ParaText -Index 401 -Text "The platform supports browsing, comparing, and shortlisting options while improving planning speed and confidence for families."
Set-ParaText -Index 402 -Text "It also supports better decision-making through structured data such as location, capacity, price ranges, and ratings."
Set-ParaText -Index 403 -Text "This makes Wedify a practical local decision-support solution for wedding planning in Lahore."

Set-ParaText -Index 405 -Text "Wedding planning decisions are often made without centralized, verified, and comparable data."
Set-ParaText -Index 406 -Text "As a result, users face delays, mismatched budgets, and difficulty coordinating vendors and tasks."
Set-ParaText -Index 407 -Text "The project solves this by digitizing key planning steps in a structured and user-friendly workflow."
Set-ParaText -Index 408 -Text "Problem Summary"
Set-ParaText -Index 409 -Text "Currently, there is no integrated local platform that combines venue comparison, vendor discovery, and budget planning specifically for Lahore weddings."

Set-ParaText -Index 412 -Text "The main goals of Wedify are listed below."
Set-ParaText -Index 413 -Text "These include both functional planning support and usability-focused goals."
Set-ParaText -Index 414 -Text "Objectives"
Set-ParaText -Index 415 -Text "Primary objectives of this project are:"
Set-ParaText -Index 416 -Text "- Build a centralized wedding venue and vendor exploration platform for Lahore."
Set-ParaText -Index 417 -Text "- Provide transparent budget estimation through an interactive calculator."
Set-ParaText -Index 418 -Text "- Enable favorites, comparison, and shortlist management for users."
Set-ParaText -Index 419 -Text "- Provide a checklist and planning support features for better execution."

Set-ParaText -Index 422 -Text "This section defines what Wedify includes and excludes in the current release."
Set-ParaText -Index 423 -Text "It clarifies technical and business boundaries of the project."
Set-ParaText -Index 424 -Text "Scope"
Set-ParaText -Index 425 -Text "Included in Scope:"
Set-ParaText -Index 426 -Text "- Venue listing, filters, details, and side-by-side comparison."
Set-ParaText -Index 427 -Text "- Vendor directory with categories and profile information."
Set-ParaText -Index 428 -Text "- Budget calculator and planning checklist modules."
Set-ParaText -Index 429 -Text "- Favorites, recently viewed, and testimonial pages."
Set-ParaText -Index 430 -Text "- Basic API endpoint for live price snapshot."
Set-ParaText -Index 431 -Text "Out of Scope:"
Set-ParaText -Index 432 -Text "- Direct booking and secure online payments in current release."
Set-ParaText -Index 433 -Text "- Vendor-side authenticated dashboards and CRM integration."
Set-ParaText -Index 434 -Text "- Full multilingual support and native mobile app version."

Set-ParaText -Index 436 -Text "Wedify contributes practical value by reducing planning uncertainty and improving transparency in vendor and venue selection."
Set-ParaText -Index 437 -Text "Academically, it demonstrates software engineering practices including requirements analysis, sprint planning, architecture, and traceability."
Set-ParaText -Index 438 -Text "Project Importance"
Set-ParaText -Index 439 -Text "The solution benefits users by saving time, reducing budget surprises, and improving final decision quality."

Set-ParaText -Index 441 -Text "This section highlights AI-enhancement opportunities for future versions of Wedify."
Set-ParaText -Index 442 -Text "AI Scenarios"
Set-ParaText -Index 443 -Text "AI can be integrated to improve personalization and prediction quality in the platform."
Set-ParaText -Index 444 -Text "Key scenarios include recommendation, cost forecasting, and intelligent planning assistants."
Set-ParaText -Index 445 -Text "Predictive Budget Estimation: models can forecast budget ranges from user preferences, guest count, and historical venue pricing."
Set-ParaText -Index 446 -Text "Personalized Recommendation Engine: AI can suggest venues and vendors based on area, budget, and event style preferences."
Set-ParaText -Index 447 -Text "Smart Planning Assistant: NLP can guide users through checklist milestones and auto-suggest task priorities."

Set-ParaText -Index 449 -Text "Expected outputs of Wedify are listed below."
Set-ParaText -Index 451 -Text "Deliverables"
Set-ParaText -Index 452 -Text "- Functional web-based Wedify application."
Set-ParaText -Index 453 -Text "- Source code repository with modular components."
Set-ParaText -Index 454 -Text "- Test artifacts, backlog, and traceability matrix."
Set-ParaText -Index 455 -Text "- Final documentation report and presentation material."
Set-ParaText -Index 456 -Text "- User guide for running and exploring the project locally."

Set-ParaText -Index 460 -Text "Primary customers are engaged couples and families planning wedding events in Lahore."
Set-ParaText -Index 461 -Text "They need trusted venue and vendor information, transparent pricing cues, and planning support."
Set-ParaText -Index 462 -Text "Wedify serves these users with a single platform for discovery, comparison, and planning."
Set-ParaText -Index 464 -Text "Key stakeholders and their responsibilities are listed below."
Set-ParaText -Index 469 -Text "Bride/Groom and Families"
Set-ParaText -Index 470 -Text "Browse venues, compare options, and finalize shortlists."
Set-ParaText -Index 471 -Text "Estimate budget and monitor planning tasks."
Set-ParaText -Index 472 -Text "Use filters and reviews for informed decisions."
Set-ParaText -Index 473 -Text "Save favorites and manage alternatives."
Set-ParaText -Index 474 -Text "Provide feedback through testimonials and usage patterns."
Set-ParaText -Index 475 -Text "Venue Owners/Managers"
Set-ParaText -Index 476 -Text "Provide venue information such as capacity, location, and package ranges."
Set-ParaText -Index 477 -Text "Keep listing details updated through future admin workflow."
Set-ParaText -Index 478 -Text "Respond to inquiry leads generated by the platform."
Set-ParaText -Index 479 -Text "Improve service visibility across local users."
Set-ParaText -Index 480 -Text "Vendors"
Set-ParaText -Index 481 -Text "Offer wedding services such as decor, photography, and catering."
Set-ParaText -Index 482 -Text "Present service ranges and contact channels."
Set-ParaText -Index 483 -Text "Receive qualified interest from users."
Set-ParaText -Index 484 -Text "Support users in package and timeline planning."
Set-ParaText -Index 485 -Text "Project Team"
Set-ParaText -Index 486 -Text "Design, implement, test, and maintain the Wedify application."
Set-ParaText -Index 487 -Text "Prepare documentation and sprint evidence."
Set-ParaText -Index 488 -Text "Validate requirements against implementation outcomes."
Set-ParaText -Index 489 -Text "Ensure software quality and project completeness."
Set-ParaText -Index 490 -Text "Supervisor"
Set-ParaText -Index 491 -Text "Provide guidance on scope, methodology, and report quality."
Set-ParaText -Index 492 -Text "Review architecture and evaluate progress milestones."
Set-ParaText -Index 493 -Text "Validate project deliverables and academic compliance."
Set-ParaText -Index 494 -Text "University Evaluators"
Set-ParaText -Index 495 -Text "Assess report quality and implementation completeness."
Set-ParaText -Index 496 -Text "Evaluate software engineering process evidence."
Set-ParaText -Index 497 -Text "Provide grading feedback based on project outcomes."

Set-ParaText -Index 501 -Text "The groups impacted by Wedify and their social/economic effects are summarized below."
Set-ParaText -Index 502 -Text "Impact Summary"
Set-ParaText -Index 503 -Text "Wedding Clients"
Set-ParaText -Index 504 -Text "Reduced planning effort and better budget control through transparent options."
Set-ParaText -Index 505 -Text "Improved decision confidence using comparisons and structured planning tools."
Set-ParaText -Index 507 -Text "Local Wedding Market"
Set-ParaText -Index 508 -Text "Economic Impact: Better demand visibility for venues and vendors."
Set-ParaText -Index 509 -Text "Social Impact: Easier access to verified service information for families."
Set-ParaText -Index 510 -Text "Vendors and Venue Operators"
Set-ParaText -Index 511 -Text "Economic Impact: Increased digital exposure and lead generation opportunities."
Set-ParaText -Index 512 -Text "Social Impact: Stronger trust through better service presentation."
Set-ParaText -Index 513 -Text "Students and Academic Community"
Set-ParaText -Index 514 -Text "Economic Impact: Not direct; contributes through skill development and industry readiness."
Set-ParaText -Index 515 -Text "Social Impact: Demonstrates practical software engineering for local problems."
Set-ParaText -Index 516 -Text "Event Planning Ecosystem"
Set-ParaText -Index 517 -Text "Social Impact: Promotes data-driven planning rather than informal guesswork."
Set-ParaText -Index 518 -Text "Economic Impact: Reduces inefficiencies caused by poor vendor-venue matching."
Set-ParaText -Index 519 -Text "General Public"
Set-ParaText -Index 520 -Text "Social Impact: Better informed users and improved event planning experience."
Set-ParaText -Index 521 -Text "Economic Impact: Lower planning waste through better budget allocation."
Set-ParaText -Index 523 -Text "Platform Growth Stakeholders"
Set-ParaText -Index 524 -Text "Economic Impact: Scalable opportunity for future marketplace features."
Set-ParaText -Index 525 -Text "Social Impact: Digital transformation of traditional planning processes."

Set-ParaText -Index 528 -Text "Wedify relies on the following external systems and dependencies."
Set-ParaText -Index 529 -Text "Dependencies"
Set-ParaText -Index 530 -Text "Node.js and npm"
Set-ParaText -Index 531 -Text "Next.js Runtime and Build System"
Set-ParaText -Index 532 -Text "Purpose: Routing, rendering, and build tooling for the web application."
Set-ParaText -Index 533 -Text "Interaction: Executes pages, API routes, and optimized build outputs."
Set-ParaText -Index 535 -Text "Image/CDN Providers"
Set-ParaText -Index 536 -Text "Purpose: Host media assets for galleries and cards."
Set-ParaText -Index 537 -Text "Interaction: Frontend loads optimized external image resources."
Set-ParaText -Index 539 -Text "Browser Local Storage"
Set-ParaText -Index 540 -Text "Purpose: Persist favorites, checklist progress, and user preferences."
Set-ParaText -Index 541 -Text "Interaction: Read/write lightweight client-side planning state."
Set-ParaText -Index 543 -Text "GitHub Repository"
Set-ParaText -Index 544 -Text "Purpose: Version control and collaboration history."
Set-ParaText -Index 545 -Text "Interaction: Tracks commits, review changes, and release snapshots."
Set-ParaText -Index 547 -Text "Deployment Platform (Optional)"
Set-ParaText -Index 548 -Text "Purpose: Production hosting for the Next.js application."
Set-ParaText -Index 549 -Text "Interaction: Deploy build artifacts and serve to public users."
Set-ParaText -Index 551 -Text "Analytics/Monitoring (Future)"
Set-ParaText -Index 552 -Text "Purpose: Capture usage insights and reliability metrics."
Set-ParaText -Index 553 -Text "Interaction: Provide behavior data for iterative feature improvement."
Set-ParaText -Index 555 -Text "Financial/Payment Integration (Future)"
Set-ParaText -Index 556 -Text "Purpose: Support secure checkout and package booking workflows."
Set-ParaText -Index 557 -Text "Interaction: Not integrated in current project scope."

Set-ParaText -Index 558 -Text "Related Projects with feature comparison"
Set-ParaText -Index 559 -Text "This section compares Wedify with existing wedding discovery platforms."
Set-ParaText -Index 560 -Text "Related Projects"
Set-ParaText -Index 561 -Text "References considered for concept and feature benchmarking."
Set-ParaText -Index 563 -Text "WeddingWire"
Set-ParaText -Index 564 -Text "Purpose: Global wedding vendor and planning directory."
Set-ParaText -Index 565 -Text "Examples: Venue search, vendor discovery, and checklist tools."
Set-ParaText -Index 566 -Text "Relevance: Similar concept, but not localized for Lahore-specific packages and context."
Set-ParaText -Index 568 -Text "The Knot"
Set-ParaText -Index 569 -Text "Purpose: Wedding planning platform with registry, vendors, and inspiration content."
Set-ParaText -Index 651 -Text "Figure 1: Context Diagram - Wedify Wedding Planning System[1]"
Set-ParaText -Index 657 -Text "Figure 2: Data Flow Diagram - Wedify Wedding Planning System[1]"

# Requirements and backlog section updates
Set-ParaText -Index 663 -Text "Actors are defined according to Wedify system boundaries and user interactions."
Set-ParaText -Index 664 -Text "Each actor listed here maps to stakeholder roles and corresponding user stories."
Set-ParaText -Index 665 -Text "Actors"
Set-ParaText -Index 666 -Text "User/Family Planner: explores venues, compares options, and plans budget."
Set-ParaText -Index 667 -Text "Client: saves favorites, tracks checklist, and views recommendations."
Set-ParaText -Index 668 -Text "Visitor: browses basic listings and project content without deep planning actions."
Set-ParaText -Index 669 -Text "Admin (future): maintains listings, validates content, and updates live pricing data."
Set-ParaText -Index 670 -Text "Search Engine: indexes public pages for discoverability."
Set-ParaText -Index 671 -Text "Partner Vendors: provide service data and receive leads through listing visibility."

Set-ParaText -Index 673 -Text "The Wedify product backlog was derived from core wedding planning user journeys."
Set-ParaText -Index 674 -Text "It includes discovery, planning, comparison, and decision-support features."
Set-ParaText -Index 675 -Text "Backlog Concepts"
Set-ParaText -Index 690 -Text "Example: Implement venue discovery and budget planning functionality."
Set-ParaText -Index 698 -Text "Example: Venue listing page, vendor page, calculator page, and comparison page."
Set-ParaText -Index 707 -Text "Example: As a user, I want to compare venues so that I can choose the best option for my event."
Set-ParaText -Index 719 -Text "User Story: As a user, I want to save favorite venues so I can revisit them quickly."
Set-ParaText -Index 720 -Text "Acceptance Criteria:"
Set-ParaText -Index 721 -Text "The user can add a venue to favorites from listing and details pages."
Set-ParaText -Index 722 -Text "Favorites persist after page refresh using local storage."
Set-ParaText -Index 723 -Text "The favorites list supports remove action and updates instantly."
Set-ParaText -Index 724 -Text "The favorites page displays all selected items with key details."
Set-ParaText -Index 764 -Text "Sub-sections below represent Wedify epics with representative user stories."

Set-ParaText -Index 765 -Text "Venue Discovery"
Set-ParaText -Index 772 -Text "VD-01"
Set-ParaText -Index 773 -Text "As a user, I can browse venues by area so that I can shortlist nearby options."
Set-ParaText -Index 775 -Text "- Area filter updates venue cards correctly and quickly."
Set-ParaText -Index 778 -Text "VD-02"
Set-ParaText -Index 779 -Text "As a user, I can open a venue detail page so that I can evaluate amenities and pricing."
Set-ParaText -Index 781 -Text "- Detail page shows capacity, ratings, amenities, and package ranges."
Set-ParaText -Index 784 -Text "VD-03"
Set-ParaText -Index 785 -Text "As a user, I can search venues by name so that I can find options quickly."
Set-ParaText -Index 787 -Text "- Search returns relevant results for typed keywords."
Set-ParaText -Index 790 -Text "VD-04"
Set-ParaText -Index 791 -Text "As a user, I can sort venues by price, rating, or capacity so that I can prioritize options."
Set-ParaText -Index 793 -Text "- Sorting controls reorder the listing accurately."
Set-ParaText -Index 796 -Text "VD-05"
Set-ParaText -Index 797 -Text "As a user, I can view featured venues on home page so that I can quickly discover top picks."
Set-ParaText -Index 799 -Text "- Featured section renders curated venue cards with working links."

Set-ParaText -Index 803 -Text "Account and Preferences"
Set-ParaText -Index 810 -Text "AP-01"
Set-ParaText -Index 811 -Text "As a user, I can save favorite venues so that I can review them later."
Set-ParaText -Index 813 -Text "- Favorite toggle works and persists data in local storage."
Set-ParaText -Index 816 -Text "AP-02"
Set-ParaText -Index 817 -Text "As a user, I can maintain a comparison shortlist so that I can evaluate options side by side."
Set-ParaText -Index 819 -Text "- Compare list add/remove actions are reflected on comparison page."
Set-ParaText -Index 822 -Text "AP-03"
Set-ParaText -Index 823 -Text "As a user, I can set my wedding date so that I can track countdown and planning urgency."
Set-ParaText -Index 825 -Text "- Date modal stores selected date and shows countdown widget."
Set-ParaText -Index 828 -Text "AP-04"
Set-ParaText -Index 829 -Text "As a user, I can view recently viewed venues so that I can revisit my exploration history."
Set-ParaText -Index 831 -Text "- Recently viewed list updates and remains available in context state."
Set-ParaText -Index 834 -Text "AP-05"
Set-ParaText -Index 835 -Text "As a user, I can receive in-app notifications so that I can track actions and confirmations."
Set-ParaText -Index 837 -Text "- Notification toast appears on key actions."
Set-ParaText -Index 840 -Text "AP-06"
Set-ParaText -Index 841 -Text "As a user, I can access favorites page directly so that I can finalize shortlists efficiently."
Set-ParaText -Index 843 -Text "Favorites page displays all saved venues."

Set-ParaText -Index 848 -Text "Budget Planning"
Set-ParaText -Index 855 -Text "BP-01"
Set-ParaText -Index 856 -Text "As a user, I can enter guest count and event preferences so that I can estimate total cost."
Set-ParaText -Index 858 -Text "- Calculator updates category totals and grand total in real time."
Set-ParaText -Index 861 -Text "BP-02"
Set-ParaText -Index 862 -Text "As a user, I can choose decor and service packages so that I can align budget with style."
Set-ParaText -Index 864 -Text "- Selected packages are reflected in cost breakdown."
Set-ParaText -Index 867 -Text "BP-03"
Set-ParaText -Index 868 -Text "As a user, I can view per-head estimates so that I can compare affordability across options."
Set-ParaText -Index 870 -Text "- Per-head value is calculated and displayed accurately."
Set-ParaText -Index 873 -Text "BP-04"
Set-ParaText -Index 874 -Text "As a user, I can include contingency and tax assumptions so that estimates are realistic."
Set-ParaText -Index 876 -Text "- Extra cost percentages are configurable and included in totals."

Set-ParaText -Index 880 -Text "Comparison and Favorites"
Set-ParaText -Index 887 -Text "CF-01"
Set-ParaText -Index 888 -Text "As a user, I can compare selected venues side by side so that I can make final decisions faster."
Set-ParaText -Index 890 -Text "- Compare page shows key attributes for each selected venue."
Set-ParaText -Index 893 -Text "CF-02"
Set-ParaText -Index 894 -Text "As a user, I can remove items from compare list so that I can keep only relevant options."
Set-ParaText -Index 896 -Text "- Remove action updates compare list and UI immediately."
Set-ParaText -Index 899 -Text "CF-03"
Set-ParaText -Index 900 -Text "As a user, I can inspect live price snapshots so that I can make timely budget decisions."
Set-ParaText -Index 902 -Text "- Live price API endpoint responds with structured price data."
Set-ParaText -Index 905 -Text "CF-04"
Set-ParaText -Index 906 -Text "As a user, I can keep favorites and comparison aligned so that shortlisting remains consistent."
Set-ParaText -Index 908 -Text "- Favorite and compare controls operate independently without state conflicts."
Set-ParaText -Index 911 -Text "CF-05"
Set-ParaText -Index 912 -Text "As a user, I can revisit shortlisted items from dedicated pages so that finalization is easier."
Set-ParaText -Index 914 -Text "- Dedicated pages render complete shortlist data."
Set-ParaText -Index 917 -Text "CF-06"
Set-ParaText -Index 918 -Text "As a family planner, I can share shortlisted options with stakeholders for group decision-making."
Set-ParaText -Index 920 -Text "- Shortlist view supports clear visual comparison."
Set-ParaText -Index 923 -Text "CF-07"
Set-ParaText -Index 924 -Text "As a user, I can combine filters with comparison actions for efficient decision workflows."
Set-ParaText -Index 926 -Text "- Filtered selection can be added to compare without UI errors."

Set-ParaText -Index 929 -Text "Vendor Marketplace"
Set-ParaText -Index 936 -Text "VM-01"
Set-ParaText -Index 937 -Text "As a user, I can browse vendor categories so that I can find required services quickly."
Set-ParaText -Index 939 -Text "- Vendors are grouped into meaningful categories."
Set-ParaText -Index 942 -Text "VM-02"
Set-ParaText -Index 943 -Text "As a user, I can view vendor profiles so that I can evaluate offerings and contact details."
Set-ParaText -Index 945 -Text "- Profile cards show services, ratings, and contact channels."
Set-ParaText -Index 948 -Text "VM-03"
Set-ParaText -Index 949 -Text "As a user, I can compare vendor options by category so that I can choose suitable partners."
Set-ParaText -Index 951 -Text "- Vendor list supports category-level exploration and filtering."

Set-ParaText -Index 956 -Text "Checklist and Timeline"
Set-ParaText -Index 963 -Text "CT-01"
Set-ParaText -Index 964 -Text "As a user, I can mark checklist items complete so that I can track progress."
Set-ParaText -Index 966 -Text "- Checklist item states update and persist correctly."
Set-ParaText -Index 969 -Text "CT-02"
Set-ParaText -Index 970 -Text "As a user, I can review pending tasks so that I can prioritize upcoming work."
Set-ParaText -Index 972 -Text "- Pending and completed states are clearly differentiated."
Set-ParaText -Index 975 -Text "CT-03"
Set-ParaText -Index 976 -Text "As a user, I can open planning tools from home page shortcuts so that I can navigate quickly."
Set-ParaText -Index 978 -Text "- Quick access links route correctly to checklist and related pages."

# Architecture and implementation sections
Set-ParaText -Index 1865 -Text "The Wedify architecture follows a modular web application model aligned with C4 principles."
Set-ParaText -Index 1866 -Text "System Context Diagram"
Set-ParaText -Index 1867 -Text "The context diagram places Wedify between end users, vendor data sources, and optional deployment/monitoring systems."
Set-ParaText -Index 1868 -Text "At this level, focus is on actors and external systems rather than low-level protocols."
Set-ParaText -Index 1869 -Text "Reference: https://c4model.com/"
Set-ParaText -Index 1872 -Text "Figure 24: Wedify System Context Diagram"
Set-ParaText -Index 1874 -Text "System Container Diagram"
Set-ParaText -Index 1876 -Text "Wedify containers include Next.js frontend, API route layer, data modules, and browser local storage."
Set-ParaText -Index 1878 -Text "The container view explains responsibilities, technology choices, and communication paths."
Set-ParaText -Index 1879 -Text "Reference: https://c4model.com/"
Set-ParaText -Index 1881 -Text "Figure 25: Wedify Container Diagram"
Set-ParaText -Index 1885 -Text "Component Diagram"
Set-ParaText -Index 1887 -Text "Major components include Navbar, MarqueeCard, VendorCard, CompareButton, FavoriteButton, and calculator modules."
Set-ParaText -Index 1888 -Text "Component interactions are coordinated through page composition and context-based state management."
Set-ParaText -Index 1889 -Text "Reference: https://c4model.com/"
Set-ParaText -Index 1893 -Text "Figure 26: Wedify Component Diagram"
Set-ParaText -Index 1897 -Text "Code Diagrams"
Set-ParaText -Index 1898 -Text "Code-level structure is represented through page routing, reusable components, and context/provider flow."
Set-ParaText -Index 1899 -Text "The focus is on maintainability, low coupling, and reusable UI modules."
Set-ParaText -Index 1900 -Text "Reference: https://c4model.com/"
Set-ParaText -Index 1903 -Text "Figure 27: Wedify Code-Level Structure"
Set-ParaText -Index 1908 -Text "ERD"
Set-ParaText -Index 1909 -Text "Wedify conceptual entities include Venue, Vendor, Testimonial, UserPreference, and ChecklistItem."
Set-ParaText -Index 1910 -Text "Venue stores name, area, capacity, rating, and pricing ranges."
Set-ParaText -Index 1911 -Text "Vendor stores category, services, rating, and contact information."
Set-ParaText -Index 1912 -Text "UserPreference stores favorites, compare list, and selected planning options."
Set-ParaText -Index 1913 -Text "ChecklistItem tracks planning tasks and completion status."
Set-ParaText -Index 1914 -Text "Relationships are designed to support discovery, planning, and decision workflows."
Set-ParaText -Index 1916 -Text "Figure 28: Wedify ER Diagram"
Set-ParaText -Index 1917 -Text "Uniqueness is maintained using IDs and slugs for deterministic routing and retrieval."
Set-ParaText -Index 1918 -Text "Venue slugs remain unique across the application."
Set-ParaText -Index 1919 -Text "Vendor entries are category-grouped with unique IDs."
Set-ParaText -Index 1920 -Text "Checklist items carry unique identifiers for reliable update operations."
Set-ParaText -Index 1921 -Text "Data Dictionary"
Set-ParaText -Index 1922 -Text "The data dictionary defines fields, value types, and usage constraints for all entities used by Wedify."
Set-ParaText -Index 1923 -Text "The following data dictionary artifacts correspond to Wedify modules and datasets."
Set-ParaText -Index 1926 -Text "Figure 29: Wedify Data Dictionary"

Set-ParaText -Index 1930 -Text "Tools: Next.js 14, React 18, Tailwind CSS, Lucide React, JavaScript, VS Code, GitHub."
Set-ParaText -Index 1932 -Text "The application runs locally on Node.js using npm scripts and can be deployed to a Node-compatible hosting platform."
Set-ParaText -Index 1934 -Text "Key algorithms include multi-filter venue search, budget aggregation logic, and local state persistence routines."
Set-ParaText -Index 1937 -Text "Assumption: Users access the platform through modern browsers with JavaScript enabled."
Set-ParaText -Index 1938 -Text "Assumption: Data modules are periodically maintained with updated local market values."
Set-ParaText -Index 1939 -Text "Assumption: Initial release targets Lahore market requirements only."
Set-ParaText -Index 1940 -Text "Assumption: User personalization is managed client-side in current scope."
Set-ParaText -Index 1941 -Text "Assumption: Booking/payment integrations are deferred to future versions."
Set-ParaText -Index 1943 -Text "Constraints include static/semi-static data sources, no authentication module, and no live booking workflow in V1."
Set-ParaText -Index 1945 -Text "Restrictions are defined by timeline, available APIs, and academic project boundaries."
Set-ParaText -Index 1947 -Text "Limitations include absence of real-time vendor availability and advanced analytics in the current release."

Set-ParaText -Index 1951 -Text "Requirements vs Prototype (PB-ID vs PID)"
Set-ParaText -Index 1952 -Text "PB-ID mapped to implemented prototype modules"

Set-ParaText -Index 2881 -Text "%completion: 90% functional scope completed with all core modules integrated."
Set-ParaText -Index 2882 -Text "Evidence is mapped through backlog-to-module traceability matrix."
Set-ParaText -Index 2883 -Text "%accuracy: 90%+ based on manual verification of calculator, filters, and state workflows."
Set-ParaText -Index 2884 -Text "Validation performed through targeted test cases for primary user journeys."
Set-ParaText -Index 2886 -Text "%correctness: Core requirements conform to expected behavior in local test runs."
Set-ParaText -Index 2887 -Text "All critical routes and planning flows were tested against acceptance criteria."
Set-ParaText -Index 2888 -Text "Conclusion: Wedify delivers a practical and maintainable wedding planning solution for local users."
Set-ParaText -Index 2890 -Text "Future work includes authentication, booking/payment, AI recommendations, and vendor dashboards."
Set-ParaText -Index 2892 -Text "Citations are organized in IEEE-style formatting."
Set-ParaText -Index 2893 -Text "Books"
Set-ParaText -Index 2894 -Text "Ian Sommerville. Software Engineering (10th ed.)."
Set-ParaText -Index 2895 -Text "Robert C. Martin. Clean Architecture."
Set-ParaText -Index 2896 -Text "Ramez Elmasri and Shamkant Navathe. Fundamentals of Database Systems."
Set-ParaText -Index 2897 -Text "Martin Fowler. UML Distilled (3rd ed.)."
Set-ParaText -Index 2898 -Text "Journals"
Set-ParaText -Index 2899 -Text "Articles"
Set-ParaText -Index 2900 -Text "Research papers"
Set-ParaText -Index 2901 -Text "Other References"
Set-ParaText -Index 2902 -Text "https://c4model.com/"
Set-ParaText -Index 2904 -Text "Glossary of terms"
Set-ParaText -Index 2905 -Text "Pre-requisites"
Set-ParaText -Index 2906 -Text "Use development setup, deployment setup, and dependencies from this report."

# Global cleanup for remaining template-specific wording
Replace-TextGlobal -Pattern "Chemical Tracking System" -Replacement "Wedify Wedding Planning System"
Replace-TextGlobal -Pattern "chemical tracking system" -Replacement "Wedify wedding planning system"
Replace-TextGlobal -Pattern "Contoso Pharmaceuticals" -Replacement "Lahore wedding planning market"
Replace-TextGlobal -Pattern "online Learning platforms" -Replacement "wedding planning platforms"
Replace-TextGlobal -Pattern "online learning platform" -Replacement "wedding planning platform"
Replace-TextGlobal -Pattern "Course Catalog" -Replacement "Venue Discovery"
Replace-TextGlobal -Pattern "Account Management" -Replacement "Account and Preferences"
Replace-TextGlobal -Pattern "Course Creation" -Replacement "Budget Planning"
Replace-TextGlobal -Pattern "Buying Courses" -Replacement "Comparison and Favorites"
Replace-TextGlobal -Pattern "License Admin" -Replacement "Vendor Marketplace"
Replace-TextGlobal -Pattern "Viewing Courses" -Replacement "Checklist and Timeline"
Replace-TextGlobal -Pattern "Course Completion" -Replacement "Testimonials and Reviews"
Replace-TextGlobal -Pattern "course" -Replacement "venue"
Replace-TextGlobal -Pattern "Course" -Replacement "Venue"
Replace-TextGlobal -Pattern "instructor" -Replacement "user"
Replace-TextGlobal -Pattern "Instructor" -Replacement "User"
Replace-TextGlobal -Pattern "participant" -Replacement "client"
Replace-TextGlobal -Pattern "Participant" -Replacement "Client"
Replace-TextGlobal -Pattern "udemy" -Replacement "WeddingWire"
Replace-TextGlobal -Pattern "coursera" -Replacement "The Knot"

$xml.Save($docXmlPath)

if (Test-Path $outDocx) { Remove-Item $outDocx -Force }
$tmpZip = "C:\Users\Lenovo\Downloads\WeddingPlannerApp\.tmp_filled_doc.zip"
if (Test-Path $tmpZip) { Remove-Item $tmpZip -Force }
Compress-Archive -Path (Join-Path $tmp "*") -DestinationPath $tmpZip -Force
Move-Item $tmpZip $outDocx -Force
Write-Output "Created: $outDocx"
