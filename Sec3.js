// --- AI Simulation (Conceptual Module 4: AISimulator) ---
const AISimulator = (function() {
  const predefinedSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Angular", "Vue.js", "Node.js", "AWS", "Azure",
    "Google Cloud", "SQL", "NoSQL", "Data Analysis", "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Cybersecurity", "UI/UX Design", "Mobile Development (iOS/Android)", "DevOps", "Project Management",
    "Agile Methodologies", "Scrum", "Testing (QA)", "API Development", "Microservices", "Docker", "Kubernetes",
    "Blockchain", "Full Stack Development", "Frontend Development", "Backend Development", "Cloud Architecture"
  ];

  const companyTiers = {
    "Tier1": ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Nvidia", "OpenAI Labs", "Salesforce", "Adobe"],
    "Tier2": ["IBM", "Intel", "Infosys", "Wipro", "Tech Mahindra", "Tata Consultancy Services", "HCL Technologies", "Capgemini", "Accenture"],
    "Tier3": [
      "Innovatech Solutions", "Web Wizards Inc.", "DataDriven Corp.", "CodeCrafters Ltd.", "PixelPerfect Design",
      "AI Core Systems", "Frontend Masters", "Backend Builders", "CloudNet Services", "SecureSoft Co.",
      "MobileFirst Devs", "Analytica Insights", "DevOps Experts", "Creative Solutions", "TechLeap Inc.",
      "Digital Dynamics", "Synergy Tech", "Apex Innovations", "Quantum Systems", "NextGen Solutions",
      "Global Logic", "Persistent Systems"
    ]
  };

  const salaryRangesUSD = { // Base in thousands USD per year
    "Entry": { min: 50, max: 80, stdDev: 10 },
    "Junior": { min: 70, max: 100, stdDev: 12 },
    "Intermediate": { min: 90, max: 130, stdDev: 15 },
    "Senior": { min: 120, max: 180, stdDev: 20 },
    "Lead/Staff": { min: 160, max: 250, stdDev: 25 }
  };

  const companySalaryAdjustments = { // Multiplier for base range
    "Google": 1.7, "Microsoft": 1.6, "Amazon": 1.65, "Apple": 1.8, "Meta": 1.75, "Netflix": 2.0, "Nvidia": 1.9,
    "OpenAI Labs": 2.1, "Salesforce": 1.5, "Adobe": 1.55,
    "IBM": 1.2, "Intel": 1.3,
    "Infosys": 0.8, "Wipro": 0.75, "Tech Mahindra": 0.85, "Tata Consultancy Services": 0.8, "HCL Technologies": 0.78,
    "Capgemini": 0.9, "Accenture": 1.0,
    // Tier 3 companies will use base or slightly lower if not specified
  };

  function getSimulatedCompanyLink(companyName) {
      const base = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (companyName.toLowerCase().includes("google")) return "https://www.google.com/about/careers/";
      if (companyName.toLowerCase().includes("microsoft")) return "https://careers.microsoft.com/";
      if (companyName.toLowerCase().includes("amazon")) return "https://www.amazon.jobs/";
      if (companyName.toLowerCase().includes("apple")) return "https://www.apple.com/jobs/";
      if (companyName.toLowerCase().includes("meta")) return "https://www.metacareers.com/";
      if (companyName.toLowerCase().includes("infosys")) return "https://www.infosys.com/careers.html";
      if (companyName.toLowerCase().includes("tata consultancy services")) return "https://www.tcs.com/careers";
      return `https://www.${base}.com/careers-simulated`;
  }

  function generateGaussianRandom(mean, stdDev) {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      return z * stdDev + mean;
  }

  function simulateSalaryForCompany(companyName, experienceLevel = "Intermediate") {
      const companyLower = companyName.toLowerCase();
      let baseRange = salaryRangesUSD[experienceLevel] || salaryRangesUSD["Intermediate"];
      let min = baseRange.min;
      let max = baseRange.max;
      let stdDev = baseRange.stdDev;

      let adjustmentFactor = 1.0; // Default for Tier3 or unspecified
      for (const knownCompany in companySalaryAdjustments) {
          if (companyLower.includes(knownCompany.toLowerCase())) {
              adjustmentFactor = companySalaryAdjustments[knownCompany];
              break;
          }
      }
      // For companies explicitly in Tier2 but not in adjustments, give a slight boost over Tier3
      if (adjustmentFactor === 1.0 && companyTiers["Tier2"].some(c => companyLower.includes(c.toLowerCase()))) {
          adjustmentFactor = 1.05; // e.g. Accenture if not in specific adjustments
      }


      min = Math.round(min * adjustmentFactor);
      max = Math.round(max * adjustmentFactor);
      stdDev = Math.round(stdDev * adjustmentFactor * 0.8); // Adjust stdDev proportionally, slightly reduced spread for known

      const mid = (min + max) / 2;
      const salaryK = Math.round(generateGaussianRandom(mid, stdDev));
      let finalSalary = Math.max(min, Math.min(max, salaryK)); // Clamp within adjusted min/max

      // Currency and formatting
      // Simple check for "India" in company name or common Indian company names for INR
      const indianCompanyKeywords = ["india", "infosys", "wipro", "tata consultancy", "hcl tech", "tech mahindra", "bangalore", "mumbai", "pune", "hyderabad"];
      if (indianCompanyKeywords.some(keyword => companyLower.includes(keyword))) {
          // Convert USD (thousands) to INR Lakhs per Annum (LPA)
          // Example: 100k USD * 83 INR/USD = 83,00,000 INR = 83 LPA
          // Adjust base salary slightly downwards for typical Indian market compared to direct US conversion for some roles
          const inrEquivalentMin = Math.round(finalSalary * 83 * 0.9 * 0.8); // 80% of direct conversion for min
          const inrEquivalentMax = Math.round(finalSalary * 83 * 1.1 * 0.8); // 80% of direct conversion for max
          return `Approx. ₹${(inrEquivalentMin / 1000).toFixed(1)}L - ₹${(inrEquivalentMax / 1000).toFixed(1)}L PA (INR, Est.)`;
      }
      return `Approx. $${Math.round(finalSalary * 0.9)}k - $${Math.round(finalSalary * 1.1)}k p.a. (USD, Est.)`;
  }


  function analyzeResume(resumeText) {
    const textLower = resumeText.toLowerCase();
    let detectedSkills = new Set();
    let experienceLevel = "Entry";

    predefinedSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      // More robust skill matching: word boundaries, common variations
      const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es|ing|ment)?\\b`, 'gi');
      if (textLower.match(regex)) {
        detectedSkills.add(skill);
      }
    });
     if (textLower.includes("machine learning") || textLower.includes("ml engineer")) detectedSkills.add("Machine Learning");


    const yearsMatch = resumeText.match(/(\d+)\s*(?:to|-)?\s*(\d+)?\s*years?.*experience/i) || resumeText.match(/(\d+)\+\s*years/i);
    let years = 0;
    if (yearsMatch) {
        if (yearsMatch[2]) { // Range like "3-5 years"
            years = (parseInt(yearsMatch[1], 10) + parseInt(yearsMatch[2], 10)) / 2;
        } else { // Single number like "5 years" or "5+ years"
            years = parseInt(yearsMatch[1], 10);
        }
    }

    if (years >= 10) experienceLevel = "Lead/Staff";
    else if (years >= 6) experienceLevel = "Senior";
    else if (years >= 3) experienceLevel = "Intermediate";
    else if (years >= 1) experienceLevel = "Junior";
    else if (textLower.match(/intern|trainee|fresher|entry-level|graduate/i)) {
        experienceLevel = "Entry";
    }


    const jobRoleThemes = new Set();
    if (detectedSkills.has("Machine Learning") || detectedSkills.has("Deep Learning") || detectedSkills.has("Natural Language Processing") || textLower.includes("artificial intelligence")) {
      jobRoleThemes.add("AI/ML Engineer");
    }
    if (detectedSkills.has("React") || detectedSkills.has("Angular") || detectedSkills.has("Vue.js")) {
      jobRoleThemes.add("Frontend Developer");
    }
    if (detectedSkills.has("Node.js") || textLower.includes("backend") || detectedSkills.has("API Development") || detectedSkills.has("Microservices")) {
      jobRoleThemes.add("Backend Developer");
    }
    if (jobRoleThemes.has("Frontend Developer") && jobRoleThemes.has("Backend Developer") || detectedSkills.has("Full Stack Development")) {
        jobRoleThemes.add("Full Stack Developer");
    }
    if (detectedSkills.has("AWS") || detectedSkills.has("Azure") || detectedSkills.has("Google Cloud")) {
      jobRoleThemes.add("Cloud Engineer");
    }
    if (detectedSkills.has("Data Analysis") || detectedSkills.has("SQL") || textLower.includes("data scientist")) {
      jobRoleThemes.add("Data Analyst / Scientist");
    }
    if (detectedSkills.has("Project Management") || detectedSkills.has("Agile Methodologies") || detectedSkills.has("Scrum")){
        jobRoleThemes.add("Project Manager / Scrum Master");
    }
    if (jobRoleThemes.size === 0 && (detectedSkills.has("Java") || detectedSkills.has("Python") || detectedSkills.has("C++") || detectedSkills.has("JavaScript"))) {
      jobRoleThemes.add("Software Developer / Engineer");
    }
    if (jobRoleThemes.size === 0) jobRoleThemes.add("General Technologist");


    let matchedCompanies = new Set();
    // Tier 1 more likely for Senior/Lead
    if (experienceLevel === "Senior" || experienceLevel === "Lead/Staff") {
        companyTiers["Tier1"].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random()*3)).forEach(c => matchedCompanies.add(c));
    }
    // Tier 2 for Intermediate and above
    if (["Intermediate", "Senior", "Lead/Staff"].includes(experienceLevel)) {
        companyTiers["Tier2"].sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random()*2)).forEach(c => matchedCompanies.add(c));
    }
    // Tier 3 for all levels
    companyTiers["Tier3"].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random()*3)).forEach(c => matchedCompanies.add(c));

    // Add specific companies based on skill keywords (if not already full)
    if (matchedCompanies.size < 10) {
        if (jobRoleThemes.has("AI/ML Engineer")) { matchedCompanies.add("OpenAI Labs"); matchedCompanies.add("Nvidia"); }
        if (jobRoleThemes.has("Cloud Engineer") && detectedSkills.has("AWS")) matchedCompanies.add("Amazon"); // Since AWS is part of Amazon
        if (jobRoleThemes.has("Cloud Engineer") && detectedSkills.has("Azure")) matchedCompanies.add("Microsoft");
    }
     // Ensure some Indian MNCs if resume mentions India or Indian cities
    const indianLocationKeywords = ["india", "bangalore", "hyderabad", "pune", "chennai", "mumbai", "gurgaon", "noida"];
    if (indianLocationKeywords.some(keyword => textLower.includes(keyword))) {
        const indianMncs = ["Infosys", "Tata Consultancy Services", "Wipro", "HCL Technologies", "Tech Mahindra"];
        indianMncs.sort(() => 0.5 - Math.random()).slice(0, 2).forEach(c => matchedCompanies.add(c));
    }


    return {
      length: resumeText.length,
      detectedSkills: Array.from(detectedSkills).slice(0, 10).sort(),
      experienceLevel,
      jobRoleThemes: Array.from(jobRoleThemes).slice(0,5),
      matchedCompanies: Array.from(matchedCompanies).slice(0, 10).sort()
    };
  }

  return {
    analyzeResume,
    simulateSalaryForCompany,
    getSimulatedCompanyLink
  };
})();

// --- Extending UIManager for Analyzer specific UI & "Next Page" ---
(function(UIManager) {
  // Assume UIManager core (showMessage, etc.) and file-related functions (showLoading, hideLoading, displayResults) exist
  const appSection = document.getElementById('app');
  const appTitleH1 = document.getElementById('app-main-title');
  const resumeTextArea = document.getElementById('resume-text');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsPre = document.getElementById('results');
  const loadingDiv = document.getElementById('loading'); // M2 might also use this
  const nextPageBtn = document.getElementById('next-page-btn');
  const blankPagePlaceholder = document.getElementById('blank-page-placeholder');
  const converterSection = document.getElementById('converter-section'); // From M2, to hide/show

  UIManager.showMainAppContent = function() {
    if (converterSection) converterSection.style.display = 'flex';
    if (appSection) appSection.style.display = 'flex';

    if (appTitleH1) appTitleH1.style.display = 'block';
    if (resumeTextArea) {
        resumeTextArea.style.display = 'block';
        // resumeTextArea.value = ''; // M1's showAppScreen might handle this
    }
    if (analyzeBtn) analyzeBtn.style.display = 'block';
    if (nextPageBtn) nextPageBtn.style.display = 'none'; // Initially hidden on main page
    if (resultsPre) resultsPre.style.display = 'none';
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (blankPagePlaceholder) blankPagePlaceholder.style.display = 'none';

    // M1's showAppScreen clears most inputs. If specific clearing needed for main app view:
    // const pdfUploadInput = document.getElementById('pdf-upload-input');
    // if (pdfUploadInput) pdfUploadInput.value = '';
    // ... clear other file inputs from M2 ...
  };

   // M1's showAppScreen calls showMainAppContent, so clearing is handled there or in showMainAppContent
   // Override/extend showAppScreen from M1 to ensure it calls showMainAppContent correctly
    const originalShowAppScreenFromM1 = UIManager.showAppScreen;
    UIManager.showAppScreen = function() {
        if(originalShowAppScreenFromM1) originalShowAppScreenFromM1.apply(this, arguments); // Call M1's version
        UIManager.showMainAppContent(); // Then ensure M3's main content is correctly set up
    };


  UIManager.showBlankPage = function(contentHTML) {
    if (appTitleH1) appTitleH1.style.display = 'none';
    if (resumeTextArea) resumeTextArea.style.display = 'none';
    if (analyzeBtn) analyzeBtn.style.display = 'none';
    if (resultsPre) resultsPre.style.display = 'none';
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (nextPageBtn) nextPageBtn.style.display = 'none'; // Hide main next page button
    // Hide converter section as well if moving to a "full page" view
    if (converterSection) converterSection.style.display = 'none';


    if (blankPagePlaceholder) {
      blankPagePlaceholder.innerHTML = contentHTML;
      blankPagePlaceholder.style.display = 'block';
    }
  };

   // Ensure UIManager.showLoading, hideLoading, displayResults are available (M2 might define them first)
    UIManager.showLoading = UIManager.showLoading || function(text = "Processing...") {
        if (loadingDiv) {
            const spinner = loadingDiv.querySelector('.spinner') || document.createElement('div');
            if(!spinner.classList.contains('spinner')) spinner.className = 'spinner';
            loadingDiv.innerHTML = '';
            loadingDiv.appendChild(spinner);
            loadingDiv.appendChild(document.createTextNode(` ${text}`));
            loadingDiv.style.display = 'flex';
        }
        if (resultsPre) resultsPre.style.display = 'none';
        if (nextPageBtn) nextPageBtn.style.display = 'none';
    };

    UIManager.hideLoading = UIManager.hideLoading || function() {
        if (loadingDiv) loadingDiv.style.display = 'none';
    };

    UIManager.displayResults = UIManager.displayResults || function(text, downloadLink = null) {
        if (resultsPre) {
            resultsPre.innerHTML = '';
            resultsPre.textContent = text;
            if (downloadLink) { /* ... M2's download link logic ... */ }
            resultsPre.style.display = 'block';
        }
    };


})(UIManager || (UIManager = {}));

// --- Main Application Logic (Analyzer and Next Page) ---
let matchedCompaniesList = []; // Global for AI matched companies

const analyzeBtn = document.getElementById('analyze-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const resumeTextArea = document.getElementById('resume-text'); // M2 uses to populate, M3 uses to read

if (analyzeBtn) {
  analyzeBtn.addEventListener('click', () => {
    const currentResumeText = resumeTextArea.value.trim();
    if (!currentResumeText) {
      UIManager.showMessage('Please upload a PDF or paste your resume text.', true); // UIManager from M1
      return;
    }

    UIManager.showLoading("Analyzing your resume and matching jobs...");
    if(nextPageBtn) nextPageBtn.style.display = 'none';
    const resultsDisplay = document.getElementById('results');
    if(resultsDisplay) resultsDisplay.style.display = 'none';


    setTimeout(() => { // Simulate API call
      UIManager.hideLoading();
      const analysisResult = AISimulator.analyzeResume(currentResumeText);
      matchedCompaniesList = analysisResult.matchedCompanies;

      const resultText = `
**Resume Analysis (Simulated):**
- **Detected Keywords/Skills:** ${analysisResult.detectedSkills.length > 0 ? analysisResult.detectedSkills.join(', ') : 'None significant found.'}
- **Estimated Experience Level:** ${analysisResult.experienceLevel}
- **Confidence Score:** ${Math.floor(Math.random() * 15) + 85}% (Simulated)

**Job Role Themes Matched (Simulated):**
${analysisResult.jobRoleThemes.map((theme, idx) => `${idx + 1}. ${theme}`).join('\n')}

**Top AI Matched Companies (Simulated):**
${matchedCompaniesList.slice(0, 5).map((c, idx) => `${idx + 1}. ${c}`).join('\n')}
${matchedCompaniesList.length > 5 ? `... (and ${matchedCompaniesList.length - 5} more matches)` : ''}

*View "Next Page" for a detailed list and salary simulations.*
`;
      UIManager.displayResults(resultText.trim());
      if(nextPageBtn) nextPageBtn.style.display = 'block';
    }, 2500);
  });
}

if (nextPageBtn) {
  nextPageBtn.addEventListener('click', () => {
    renderBlankPageContent();
  });
}

// Ensure homeBtn click resets matchedCompaniesList (extending M1's homeBtn logic)
const homeBtnForM3 = document.getElementById('home-btn');
if (homeBtnForM3) {
    const originalHomeBtnOnClick = homeBtnForM3.onclick; // If M1 set it via .onclick
    homeBtnForM3.addEventListener('click', () => { // Better to use addEventListener
        // if (originalHomeBtnOnClick) originalHomeBtnOnClick(); // Call M1's logic if it was .onclick
        matchedCompaniesList = []; // Clear matched companies for M3
        // UIManager.showMainAppContent() is already called by M1's handler
    });
}


function renderBlankPageContent() {
  let contentHTML = `<h2>AI Matched Companies & Simulated Salaries</h2>`;
  if (matchedCompaniesList && matchedCompaniesList.length > 0) {
    contentHTML += `<p class="info-text" style="text-align:left; max-width: 90%; margin: 10px auto;">Based on your resume, we found these potential matches. Simulated salary ranges (May 2025, primarily USD examples unless stated) are shown for illustrative purposes:</p><ul class="matched-companies-list">`;
    matchedCompaniesList.forEach(companyName => {
      const analysisForExpLevel = AISimulator.analyzeResume(resumeTextArea.value || ""); // Get current exp level
      const salary = AISimulator.simulateSalaryForCompany(companyName, analysisForExpLevel.experienceLevel);
      const companyLink = AISimulator.getSimulatedCompanyLink(companyName);
      contentHTML += `<li><a href="${companyLink}" target="_blank" class="company-link">${companyName}</a> - <strong>Simulated Salary:</strong> ${salary}</li>`;
    });
    contentHTML += `</ul>`;
  } else {
    contentHTML += `<p class="info-text">No AI matches found from your resume analysis yet. Please go back to the Home page and analyze your resume, or enter preferred companies below.</p>`;
  }
  contentHTML += `<hr class="section-divider">`;

  contentHTML += `<h2>Enter Your Preferred Companies for Salary Analysis</h2>`;
  contentHTML += `<p class="info-text">Enter up to 5 company names to get a simulated salary analysis. For best results, use full company names (e.g., "Google", "Infosys").</p>`;
  contentHTML += `<div id="preferred-companies-input-area">`;
  for (let i = 0; i < 5; i++) {
    contentHTML += `<input type="text" class="preferred-company-input" placeholder="Preferred Company ${i + 1}" aria-label="Preferred Company ${i + 1} for salary analysis">`;
  }
  contentHTML += `</div>`;
  contentHTML += `<button id="analyze-salary-btn" class="app-button" aria-label="Analyze salaries for entered companies">Analyze Salaries for Preferred Companies</button>`;
  contentHTML += `<div id="salary-analysis-results" style="margin-top: 20px; display: none;"></div>`; // Results container
  contentHTML += `<hr class="section-divider">`;
  contentHTML += `<p class="info-text" style="margin-top:20px;">Click "Home" in the header to return to the main resume analyzer.</p>`;

  UIManager.showBlankPage(contentHTML);

  const analyzeSalaryBtn = document.getElementById('analyze-salary-btn');
  if (analyzeSalaryBtn) {
    analyzeSalaryBtn.addEventListener('click', handleSalaryAnalysis);
  }
}

function handleSalaryAnalysis() {
  const resultsContainer = document.getElementById('salary-analysis-results');
  if (!resultsContainer) return;
  resultsContainer.innerHTML = ''; // Clear previous results
  resultsContainer.style.display = 'block'; // Make it visible

  const preferredInputs = document.querySelectorAll('.preferred-company-input');
  let hasInput = false;
  let salaryResultsHTML = '<h3>Simulated Salary Analysis:</h3><ul class="salary-results-list">';

  const analysisForExpLevel = AISimulator.analyzeResume(resumeTextArea.value || ""); // Get current exp level for context

  preferredInputs.forEach(input => {
    const companyName = input.value.trim();
    if (companyName) {
      hasInput = true;
      const salary = AISimulator.simulateSalaryForCompany(companyName, analysisForExpLevel.experienceLevel);
      const companyLink = AISimulator.getSimulatedCompanyLink(companyName);
      salaryResultsHTML += `<li><strong><a href="${companyLink}" target="_blank" class="company-link">${companyName}</a>:</strong> ${salary}</li>`;
    }
  });

  if (!hasInput) {
    salaryResultsHTML += "<li>Please enter at least one company name above to analyze.</li>";
  }
  salaryResultsHTML += `</ul><p class='info-text' style='font-size:0.8em; text-align:center; margin-top:10px;'>Note: Salary data is illustrative, simulated for demonstration (May 2025). Experience level for this custom analysis is based on the last analyzed resume: <strong>${analysisForExpLevel.experienceLevel}</strong>. Results may vary. Links are simulated.</p>`;
  resultsContainer.innerHTML = salaryResultsHTML;
}

