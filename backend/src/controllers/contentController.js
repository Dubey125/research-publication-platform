import SiteContent, { CONTENT_TYPES } from '../models/SiteContent.js';

const defaultContentByType = {
  policies: {
    title: 'Journal Policies',
    body: `## Editorial Policies
Our journal follows strict editorial standards for peer review, originality, and transparent communication.

## Plagiarism Policy
All submissions are screened for originality before review. Submissions with significant overlap are rejected.

## Open Access Policy
All published papers are freely accessible for reading, sharing, and academic citation.

## Peer-Review Policy
We use a double-blind peer-review workflow for objective evaluation and quality assurance.`
  },
  'copyright-form': {
    title: 'Copyright Transfer Form',
    body: `## Copyright Transfer Terms
Authors confirm the submitted work is original and not under consideration elsewhere.

## Rights Transfer
Authors grant publication rights to the journal for dissemination in print and digital formats.

## Author Declaration
Authors certify that all co-authors have approved the final manuscript and declaration.`
  },
  licensing: {
    title: 'Licensing Terms',
    body: `## Open Access License
This journal follows a Creative Commons Attribution style model for published articles.

## CC BY Style Explanation
Readers may copy, distribute, and adapt content with clear attribution to the original authors and source.

## Reuse Conditions
Attribution must include title, authors, journal citation, and DOI or article URL.`
  },
  'publication-ethics': {
    title: 'Publication Ethics',
    body: `## Research Integrity
Authors must provide accurate data, proper citation, and transparent methodology.

## Conflict of Interest
All parties must disclose any financial or academic conflicts related to the manuscript.

## Misconduct Handling
Confirmed misconduct may result in rejection, retraction, and institutional notification.`
  },
  'author-guidelines': {
    title: 'Author Guidelines',
    body: `## Manuscript Preparation
Submit manuscripts with title, abstract, keywords, methods, results, discussion, and references.

## Author Responsibilities
Authors are responsible for originality, ethical approvals, and truthful authorship statements.

## Submission Checklist
Ensure formatting compliance, reference consistency, and declaration confirmation before submission.`
  },
  'peer-review-policy': {
    title: 'Peer Review Policy',
    body: `## Review Workflow
Each eligible manuscript is evaluated by at least two independent reviewers.

## Decision Path
Editorial decisions are communicated as under review, accepted, revision required, or rejected.

## Reviewer Conduct
Reviewers are expected to maintain confidentiality, impartiality, and constructive feedback.`
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
