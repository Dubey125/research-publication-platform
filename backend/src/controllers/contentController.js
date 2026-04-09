import SiteContent, { CONTENT_TYPES } from '../models/SiteContent.js';

export const defaultContentByType = {
  policies: {
    title: 'Journal Policies',
    body: `## Editorial Policies
- IJTSE upholds the highest editorial standards to ensure academic rigor and transparent communication.
- All submitted manuscripts are subjected to a rigorous preliminary review by the Editorial Board.
- The journal guarantees editorial independence, free from commercial or political influence.
- We maintain strict confidentiality of all submitted materials throughout the review process.
- Editorial decisions are based exclusively on the validity, originality, and significance of the work.
- We provide authors with clear, constructive feedback, transparently justifying all editorial decisions.
- Secondary publications or translations are only considered with explicit disclosure and original publisher consent.
- The Editorial Board reserves the right to withdraw papers post-publication if critical flaws or ethical breaches are discovered.

## Plagiarism Policy
- We exhibit zero tolerance for plagiarism, duplicate publication, or data fabrication in any form.
- All new submissions are rigorously screened using industry-standard similarity check software prior to editorial assignment.
- Manuscripts with a similarity index exceeding 15% (excluding references and quotes) are subject to immediate rejection.
- In cases where minor text overlap is identified, authors will be requested to paraphrase and adequately cite the original sources.
- Post-publication discovery of plagiarism will result in immediate retraction and notification to the authors' institutions.
- Authors must take full responsibility for obtaining permission to reproduce any copyrighted material such as figures or tables.

## Open Access Policy
- IJTSE provides immediate gold open access to its content on the principle that freely available research supports global knowledge exchange.
- All published articles are permanently accessible online immediately upon acceptance and publication.
- Readers are permitted to read, download, copy, distribute, print, search, or link to the full texts of the articles without prior permission.
- The publication is facilitated by equitable article processing charges (APCs) to ensure the journal's sustainability.
- We utilize Creative Commons (CC BY) licensing to ensure appropriate attribution and maximum flexibility of scientific sharing.

## Peer-Review Policy
- Our peer-review process is strictly double-blind, concealing authors' identities from reviewers and vice versa.
- Manuscripts are reviewed by a minimum of two highly qualified, independent experts in the respective disciplines.
- Reviewers are evaluated on their punctuality, objectivity, and the quality of their comprehensive feedback.
- The Editor-in-Chief makes the final decision on acceptance, revision, or rejection based on reviewer recommendations.
- Authors are typically provided with reviewer feedback within 4 to 6 weeks of their initial submission.
- Re-submissions and revisions must include a detailed point-by-point response to reviewer comments.`
  },
  'copyright-form': {
    title: 'Copyright Transfer Form',
    body: `## Copyright Transfer Terms
- Authors confirm the submitted work is entirely original and not under consideration elsewhere.
- Authors warrant that the manuscript contains no libelous, defamatory, or unlawful statements.

## Rights Transfer
- Authors grant publication rights to the journal for worldwide dissemination in print and digital formats.
- Authors retain patent, trademark, and other intellectual property rights (including research data).

## Author Declaration
- Authors certify that all co-authors have approved the final manuscript and this copyright declaration.`
  },
  licensing: {
    title: 'Licensing Terms',
    body: `## Open Access License
- IJTSE follows a strict Creative Commons Attribution 4.0 International (CC BY 4.0) model for all published articles.
- Authors retain the copyright of their published work, granting the journal right of first publication.

## CC BY Style Explanation
- Readers may freely copy, distribute, and adapt the published content for any purpose, including commercial use.
- Any reuse must provide clear and prominent attribution to the original authors and the initial publication source.

## Reuse Conditions
- Proper attribution must include the paper's title, all authors, journal citation, and the DOI or permanent article URL.
- No additional permission is required from the authors or the publisher to reuse published material.`
  },
  'publication-ethics': {
    title: 'Publication Ethics',
    body: `## Research Integrity & Originality
- Authors must affirm that their submitted manuscript is completely original and not actively under review elsewhere.
- Authors must provide accurate raw data representations and must not engage in data manipulation, fabrication, or selective reporting.
- Simultaneous submission to multiple journals is strictly prohibited and constitutes a severe ethical violation.
- Any utilized sources, prior studies, or inspirations must be appropriately cited in the references according to the journal's formatting standards.
- If an author discovers a significant error post-publication, it is their explicit obligation to notify the journal to issue a formal correction or retraction.

## Authorship & Conflict of Interest
- All individuals listed as authors must have made a substantial, direct, and intellectual contribution to the inception, design, or execution of the work.
- Purely administrative support, funding acquisition, or general supervision does not justify authorship, but should be acknowledged.
- The corresponding author must ensure all co-authors have seen, reviewed, and approved the final manuscript prior to submission.
- Authors must transparently disclose any financial, personal, or professional relationships that could be construed as a potential conflict of interest.
- Funding sources supporting the research and preparation of the article must be explicitly acknowledged in the manuscript.

## Misconduct Handling & Editorial Vigilance
- Reviewers and editors must treat all submitted manuscripts as highly confidential documents and not discuss them with unauthorized colleagues.
- Reviews must be conducted objectively, providing constructive criticism without personal or professional bias toward the authors.
- The editorial board will initiate rigorous investigative procedures when ethical complaints or allegations of misconduct are presented.
- Confirmed instances of deliberate misconduct will result in immediate rejection, potential retraction, and notification to the author's affiliated institution.
- IJTSE commits to ensuring that commercial revenue or alternative funding has zero impact or influence on independent editorial decision-making.`
  },
  'author-guidelines': {
    title: 'Author Guidelines',
    body: `## Manuscript Preparation & Formatting
- Manuscripts must be submitted entirely in English using clear, concise, and academically appropriate language.
- The title must be written in 24pt Times New Roman, bold, ALL CAPS, and centered.
- The abstract should be highly structured, strictly falling between 150 and 250 words, summarizing context, methodology, and primary findings.
- Authors must provide 4 to 6 specific keywords immediately following the abstract.
- The main body text must use 10pt Times New Roman font, single-spaced, with full justification.
- Primary section headings (Introduction, Methodology, etc.) must be 12pt, bold, ALL CAPS, and numbered with Roman numerals.
- All figures and tables must be placed adjacent to their initial citation, utilizing high-resolution imagery (≥300 DPI).

## Author Responsibilities
- Authors must assume total responsibility for the originality, scientific validity, and factual accuracy of their published findings.
- Authors are required to secure explicit permission before reproducing any copyrighted illustrations, diagrams, or extensive text quotations.
- Ethical clearance documentation must be provided for all research involving human subjects or animal testing.

## Submission Checklist
- The manuscript must adhere completely to the provided IJTSE A4 Document Template format.
- The submitted file must be in .docx (Microsoft Word) compatible format.
- Authors' full contact information, affiliations, and ORCID IDs (if available) must be accurately listed.
- All references must be strictly formatted utilizing the current IEEE citation style.
- Equations must be consecutively numbered, typeset professionally using an equation editor, and cited appropriately in the text.`
  },
  'peer-review-policy': {
    title: 'Peer Review Policy',
    body: `## Review Workflow
- Every eligible manuscript undergoes preliminary editorial triage to verify scope alignment and formatting compliance.
- Submissions passing triage are evaluated by a minimum of two independent, global field experts.
- The review cycle utilizes a strict double-blind methodology to actively prevent institutional or personal bias.

## Decision Path
- Authors are formally notified of the editorial decision (Accepted, Major Revision, Minor Revision, or Rejected).
- If revisions are required, authors must submit the revised manuscript alongside a comprehensive "Response to Reviewers" document.
- The Editor-in-Chief holds the ultimate authority regarding the final publication decision.

## Reviewer Conduct
- Reviewers are bound by strict expected confidentiality regarding all manuscript content and intellectual property.
- Review reports MUST be objective, constructive, and submitted within the predefined editorial timeline.
- Reviewers encountering a conflict of interest must immediately inform the editorial office and explicitly decline the review invitation.`
  }
};


const ensureType = (type) => {
  if (!CONTENT_TYPES.includes(type)) {
    const error = new Error('Invalid content type');
    error.statusCode = 400;
    throw error;
  }
};

export const getContentByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    ensureType(type);

    const fallback = defaultContentByType[type];

    const content = await SiteContent.findOneAndUpdate(
      { type },
      {
        $setOnInsert: {
          type,
          title: fallback.title,
          body: fallback.body
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, content });
  } catch (error) {
    return next(error);
  }
};

export const upsertContentByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    ensureType(type);

    const payload = {
      title: req.body.title,
      body: req.body.body
    };

    if (!payload.title || !payload.body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }

    const content = await SiteContent.findOneAndUpdate(
      { type },
      { $set: payload, $setOnInsert: { type } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, content, message: 'Content saved successfully' });
  } catch (error) {
    return next(error);
  }
};

export const syncDefaultContent = async (req, res, next) => {
  try {
    const requestedTypes = Array.isArray(req.body?.types) ? req.body.types : [];
    const overwrite = req.body?.overwrite === true;

    const availableTypes = Object.keys(defaultContentByType);
    const targetTypes = requestedTypes.length ? requestedTypes : availableTypes;

    const invalidTypes = targetTypes.filter((type) => !defaultContentByType[type]);
    if (invalidTypes.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid content type(s): ${invalidTypes.join(', ')}`
      });
    }

    const results = [];

    for (const type of targetTypes) {
      const fallback = defaultContentByType[type];
      const existing = await SiteContent.findOne({ type });

      if (!existing) {
        const content = await SiteContent.create({
          type,
          title: fallback.title,
          body: fallback.body
        });
        results.push({ type, action: 'created', id: content._id });
        continue;
      }

      if (!overwrite) {
        results.push({ type, action: 'skipped-existing', id: existing._id });
        continue;
      }

      existing.title = fallback.title;
      existing.body = fallback.body;
      await existing.save();
      results.push({ type, action: 'updated', id: existing._id });
    }

    return res.json({
      success: true,
      message: 'Default content sync completed',
      overwrite,
      results
    });
  } catch (error) {
    return next(error);
  }
};
