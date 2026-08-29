const schemes = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    category: "Agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefit: "₹6,000 per year in three equal instalments of ₹2,000",
    description: "Direct income support to small and marginal farmers to supplement their financial needs.",
    eligibility: {
      occupation: ["farmer"],
      landOwnership: true,
      maxLandHolding: 2, // hectares
      excludes: ["income_tax_payers", "government_employees", "retired_pensioners_above_10k"],
    },
    documents: ["Aadhaar card", "Bank account details", "Land ownership records", "Mobile number"],
    applyUrl: "https://pmkisan.gov.in",
    tags: ["farmer", "agriculture", "income support", "rural"],
    state: "all",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    fullName: "Pradhan Mantri Jan Arogya Yojana",
    category: "Health",
    ministry: "Ministry of Health & Family Welfare",
    benefit: "Health cover of ₹5 lakh per family per year",
    description: "World's largest health assurance scheme providing free treatment at empanelled hospitals.",
    eligibility: {
      secc: true, // Socio-Economic Caste Census
      familySize: "any",
      incomeGroup: "below_poverty_line",
    },
    documents: ["Aadhaar card", "Ration card", "SECC data verification"],
    applyUrl: "https://pmjay.gov.in",
    tags: ["health", "insurance", "hospital", "medical", "free treatment"],
    state: "all",
  },
  {
    id: "pm-awas-yojana-gramin",
    name: "PMAY-G",
    fullName: "Pradhan Mantri Awas Yojana - Gramin",
    category: "Housing",
    ministry: "Ministry of Rural Development",
    benefit: "₹1.2 lakh (plains) or ₹1.3 lakh (hilly areas) for house construction",
    description: "Financial assistance to BPL families in rural areas to construct pucca houses.",
    eligibility: {
      residence: "rural",
      incomeGroup: "below_poverty_line",
      excludes: ["already_has_pucca_house"],
    },
    documents: ["Aadhaar card", "BPL certificate", "Bank account", "Land documents", "Job card (MGNREGS)"],
    applyUrl: "https://pmayg.nic.in",
    tags: ["housing", "rural", "BPL", "home", "shelter"],
    state: "all",
  },
  {
    id: "pm-ujjwala",
    name: "PM Ujjwala Yojana",
    fullName: "Pradhan Mantri Ujjwala Yojana",
    category: "Energy",
    ministry: "Ministry of Petroleum & Natural Gas",
    benefit: "Free LPG connection + first refill + hotplate",
    description: "Provides free LPG connections to women from BPL households to eliminate indoor air pollution.",
    eligibility: {
      gender: "female",
      incomeGroup: "below_poverty_line",
      age: { min: 18 },
      excludes: ["already_has_lpg_connection"],
    },
    documents: ["Aadhaar card", "BPL ration card", "Bank account", "Address proof"],
    applyUrl: "https://www.pmujjwalayojana.com",
    tags: ["LPG", "gas", "women", "BPL", "cooking", "energy"],
    state: "all",
  },
  {
    id: "jan-dhan",
    name: "PM Jan Dhan Yojana",
    fullName: "Pradhan Mantri Jan Dhan Yojana",
    category: "Banking",
    ministry: "Ministry of Finance",
    benefit: "Zero-balance bank account + ₹2 lakh accident insurance + ₹30,000 life cover + RuPay debit card",
    description: "Financial inclusion program ensuring access to banking, savings, remittance, credit, insurance.",
    eligibility: {
      age: { min: 10 },
      excludes: ["already_has_bank_account"],
    },
    documents: ["Aadhaar card OR Voter ID OR Passport", "Photograph"],
    applyUrl: "https://pmjdy.gov.in",
    tags: ["bank account", "banking", "financial inclusion", "RuPay", "insurance"],
    state: "all",
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    fullName: "Sukanya Samriddhi Yojana",
    category: "Savings",
    ministry: "Ministry of Finance",
    benefit: "High interest savings account (currently 8.2% p.a.) for girl child's future",
    description: "Small savings scheme for the girl child — for education and marriage expenses.",
    eligibility: {
      gender: "female",
      age: { max: 10 }, // girl child age
    },
    documents: ["Girl child's birth certificate", "Parent's Aadhaar & PAN", "Address proof"],
    applyUrl: "https://www.indiapost.gov.in",
    tags: ["girl child", "savings", "education", "daughter", "investment"],
    state: "all",
  },
  {
    id: "mudra-yojana",
    name: "PM MUDRA Yojana",
    fullName: "Pradhan Mantri Micro Units Development & Refinance Agency",
    category: "Business",
    ministry: "Ministry of Finance",
    benefit: "Loans up to ₹10 lakh (Shishu: ₹50K, Kishore: ₹5L, Tarun: ₹10L)",
    description: "Collateral-free loans for small business owners, traders, artisans, and entrepreneurs.",
    eligibility: {
      occupation: ["self_employed", "small_business", "artisan", "trader"],
      excludes: ["agricultural_activities"],
    },
    documents: ["Aadhaar card", "PAN card", "Business proof", "Bank statement", "Photograph"],
    applyUrl: "https://www.mudra.org.in",
    tags: ["loan", "business", "entrepreneur", "self-employed", "MSME", "startup"],
    state: "all",
  },
  {
    id: "e-shram",
    name: "e-Shram Card",
    fullName: "e-Shram Portal for Unorganised Workers",
    category: "Labour",
    ministry: "Ministry of Labour & Employment",
    benefit: "₹2 lakh accident insurance + access to social security schemes",
    description: "National database of unorganised workers — construction, domestic, street vendors, etc.",
    eligibility: {
      occupation: ["unorganised_worker"],
      age: { min: 16, max: 59 },
      excludes: ["income_tax_payers", "EPFO_ESIC_members"],
    },
    documents: ["Aadhaar card", "Mobile number linked to Aadhaar", "Bank account"],
    applyUrl: "https://eshram.gov.in",
    tags: ["worker", "labour", "unorganised", "construction", "domestic worker", "street vendor"],
    state: "all",
  },
  {
    id: "nrega",
    name: "MGNREGS",
    fullName: "Mahatma Gandhi National Rural Employment Guarantee Scheme",
    category: "Employment",
    ministry: "Ministry of Rural Development",
    benefit: "100 days of guaranteed wage employment per year (₹220-400/day depending on state)",
    description: "Legal guarantee of 100 days of employment in unskilled manual work for rural households.",
    eligibility: {
      residence: "rural",
      age: { min: 18 },
    },
    documents: ["Aadhaar card", "Bank account", "Ration card", "Photograph"],
    applyUrl: "https://nrega.nic.in",
    tags: ["employment", "job", "rural", "wages", "work", "NREGA", "MGNREGA"],
    state: "all",
  },
  {
    id: "scholarship-sc-st",
    name: "Post-Matric Scholarship (SC/ST)",
    fullName: "Post Matric Scholarship for SC/ST Students",
    category: "Education",
    ministry: "Ministry of Social Justice & Empowerment",
    benefit: "Maintenance allowance + tuition fees covered for post-10th studies",
    description: "Financial support for SC/ST students pursuing education after Class 10.",
    eligibility: {
      category: ["SC", "ST"],
      education: "post_matric",
      income: { maxAnnual: 250000 },
    },
    documents: ["Aadhaar card", "Caste certificate", "Income certificate", "Mark sheet", "Bank account"],
    applyUrl: "https://scholarships.gov.in",
    tags: ["scholarship", "SC", "ST", "student", "education", "college"],
    state: "all",
  },
];

const categories = [...new Set(schemes.map((s) => s.category))];

function searchSchemes(query, filters = {}) {
  const q = query.toLowerCase();
  return schemes.filter((scheme) => {
    const matchesQuery =
      !query ||
      scheme.name.toLowerCase().includes(q) ||
      scheme.fullName.toLowerCase().includes(q) ||
      scheme.description.toLowerCase().includes(q) ||
      scheme.tags.some((t) => t.toLowerCase().includes(q)) ||
      scheme.category.toLowerCase().includes(q);

    const matchesCategory = !filters.category || scheme.category === filters.category;
    return matchesQuery && matchesCategory;
  });
}

function getSchemeById(id) {
  return schemes.find((s) => s.id === id);
}

module.exports = { schemes, categories, searchSchemes, getSchemeById };
