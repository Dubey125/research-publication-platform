import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ijtse';

const siteSettingsSchema = new mongoose.Schema({
  _singleton: { type: String, default: 'global' },
  aboutTitle: String,
  aboutText: String,
  missionText: String,
  visionText: String,
  publisherName: String,
}, { strict: false });

const contentSchema = new mongoose.Schema({
  type: { type: String, unique: true },
  title: String,
  body: String
}, { strict: false });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
const Content = mongoose.model('Content', contentSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // 1. Update Site Settings (About, Mission, Vision)
    const mission = `- To cultivate a robust ecosystem for interdisciplinary research that addresses complex global challenges.
- To provide a premier, peer-reviewed platform for scholars and practitioners globally.
- To foster innovation by bridging distinct academic fields and promoting cross-pollination of ideas.
- To uphold the highest standards of academic integrity, transparency, and ethical publishing.
- To ensure open and equitable access to scientific knowledge for researchers worldwide.
- To support early-career researchers and emerging scholars through constructive peer review.
- To accelerate the dissemination of critical findings to policy-makers and industry leaders.
- To encourage collaborative research methodologies that break traditional academic silos.
- To leverage advanced digital tools and open-access models to maximize research visibility.
- To contribute meaningfully to sustainable development through transdisciplinary problem-solving.`;

    const vision = `- To be the globally recognized, leading voices in transdisciplinary science and engineering.
- To redefine the boundaries of academic research by continuously adapting to emerging scientific paradigms.
- To become a primary catalyst for breakthroughs that require expertise across multiple disciplines.
- To establish a global community of innovators, engineers, and scientists dedicated to impactful research.
- To pioneer progressive open-access publication models that benefit both authors and readers.
- To set the industry benchmark for rapid, yet rigorous and fair, peer-review processes.
- To create an inclusive platform that amplifies research from underrepresented global regions.
- To foster long-term partnerships with leading academic institutions and research organizations.
- To constantly evolve our platforms to provide the best reading, reviewing, and publishing experience.
- To shape the future of scientific inquiry by prioritizing research that impacts humanity positively.`;

    const aboutText = `International Journal of Transdisciplinary Science and Engineering (IJTSE) is a distinguished peer-reviewed, open-access international journal dedicated to publishing high-quality research across diverse academic disciplines. The journal provides a global platform for researchers, academicians, professionals, and students to disseminate innovative research findings and emerging advancements.`;

    await SiteSettings.findOneAndUpdate(
      { _singleton: 'global' },
      { 
        $set: { 
          aboutTitle: 'About IJTSE',
          aboutText: aboutText,
          missionText: mission,
          visionText: vision,
          publisherName: 'IJTSE Publishing Group'
        } 
      },
      { upsert: true, new: true }
    );
    console.log('✅ Site Settings updated (IJAIF removed, mission/vision expanded to 10 bullets).');

    // 2. Update Policy Content Documents
    const policiesBody = `## 1. Open Access Policy
- IJTSE provides immediate gold open access to its content on the principle that making research freely available to the public supports a greater global exchange of knowledge.
- All published articles undergo rigorous peer review and upon acceptance, are freely and permanently accessible online immediately upon publication.
- Readers are permitted to read, download, copy, distribute, print, search, or link to the full texts of the articles without prior permission from the publisher or the author.
- Open access publishing is facilitated by article processing charges (APCs) paid by authors or their funding bodies.
- We utilize Creative Commons licensing to ensure appropriate attribution and flexibility of sharing.

## 2. Peer Review Policy
- Our peer-review process is strictly double-blind, meaning the identities of the authors are concealed from the reviewers, and vice versa.
- Every submitted manuscript is initially evaluated by the Editorial Board for scope and quality before being sent out for review.
- Manuscripts are reviewed by a minimum of two independent, external experts in the respective fields.
- Reviewers are evaluated on their punctuality and the quality of their comprehensive feedback.
- The Editor-in-Chief makes the final decision on acceptance, revision, or rejection based on reviewer recommendations.

## 3. Plagiarism Policy
- We exhibit zero tolerance for plagiarism, duplicate publication, or data fabrication in any form.
- All new submissions are screened utilizing industry-standard similarity check software (e.g., Turnitin/iThenticate) prior to editorial assignment.
- Manuscripts with a similarity index exceeding 15% (excluding references and quotes) are subject to immediate rejection.
- In cases where minor text overlap is identified, authors will be requested to paraphrase and adequately cite the original sources.
- Post-publication discovery of plagiarism will result in an immediate retraction and notification to the authors' institutions.`;

    const ethicsBody = `## Ethical Responsibilities of Authors
- **Originality**: Authors must affirm that their submitted manuscript is completely original, has not been published previously, and is not actively under review elsewhere.
- **Authorship**: All individuals listed as authors must have made a substantial, direct, and intellectual contribution to the work and approve its final form.
- **Data Integrity**: Authors must provide accurate raw data representations and must not engage in any form of data manipulation, fabrication, or selective reporting.
- **Conflict of Interest**: Authors must transparently disclose any financial, personal, or professional relationships that could be construed as a potential conflict of interest.
- **Errors**: If an author discovers a significant error in their published work, it is their obligation to promptly notify the journal to issue a correction or retraction.

## Ethical Responsibilities of Reviewers
- **Confidentiality**: Reviewers must treat all submitted manuscripts as highly confidential documents and not discuss them with unauthorized colleagues.
- **Objectivity**: Reviews must be conducted objectively, with clear, fair, and articulated observations devoid of any personal criticism of the authors.
- **Promptness**: If a reviewer feels unqualified to assess the research or cannot meet the deadline, they must immediately decline the review invitation.
- **Disclosure**: Reviewers must decline assignments if they possess competitive, collaborative, or other disruptive relationships with any connected authors or institutions.
- **Vigilance**: Reviewers should identify relevant uncited published work and immediately flag any substantial similarity or overlap with other published papers.

## Publisher & Editorial Responsibilities
- **Fair Play**: Editorial decisions are based entirely on the manuscript's intellectual merit and relevance, irrespective of the authors' race, gender, institutional affiliation, or geographic origin.
- **Safeguarding**: The editorial board will take reasonably responsive measures when ethical complaints are presented concerning a submitted manuscript or published paper.
- **Transparency**: IJTSE commits to ensuring that commercial revenue or alternative funding has no impact or influence on independent editorial decision-making.`;

    await Content.findOneAndUpdate(
      { type: 'policies' },
      { $set: { title: 'Journal Policies', body: policiesBody } },
      { upsert: true }
    );
    await Content.findOneAndUpdate(
      { type: 'publication-ethics' },
      { $set: { title: 'Publication Ethics', body: ethicsBody } },
      { upsert: true }
    );
    console.log('✅ Policy & Ethics pages updated with 12+ bullet points each.');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
