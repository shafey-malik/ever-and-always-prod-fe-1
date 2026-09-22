/**
 * Store-wide FAQ answers, shared by the visible accordion and the FAQPage
 * JSON-LD on product pages.
 *
 * These previously lived inline and had drifted: the markup promised free
 * shipping over $50 and delivery to 50 countries while the rest of the site
 * promised free US shipping. Contradictory answers are actively harmful now
 * that AI assistants quote them back to shoppers as fact, so there is one copy
 * and it is derived from {@link POLICY}.
 */

import { POLICY } from './business';

export interface Faq {
  /** Stable key for the accordion item. */
  id: string;
  question: string;
  answer: string;
}

export const PRODUCT_FAQS: Faq[] = [
  {
    id: 'stones',
    question: 'Are the diamonds real?',
    answer:
      'Yes. Every stone we set is a certified lab-grown diamond, which is chemically and optically identical to a mined diamond and graded on the same 4Cs scale by an independent laboratory. Its report is included with your ring at no extra cost.',
  },
  {
    id: 'made-to-order',
    question: 'Is this ring made to order?',
    answer: `Yes. Every ring is made to order rather than pulled from stock, which is why the diamond, metal, setting and size can all be changed on any design. Standard orders ship within ${POLICY.handlingDaysMin} to ${POLICY.handlingDaysMax} business days; fully custom pieces take roughly ${POLICY.customLeadTimeWeeks} weeks.`,
  },
  {
    id: 'shipping',
    question: 'What are your shipping options?',
    answer: `Shipping is free and fully insured everywhere in the United States, with no minimum order value. Standard delivery arrives in ${POLICY.transitDaysMin} to ${POLICY.transitDaysMax} business days after your ring is finished, and every parcel requires a signature on delivery.`,
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer: `Returns are accepted within ${POLICY.returnDays} days of delivery, in original condition, including made-to-order pieces that do not fit. Return shipping is free. Contact our team and we will send a prepaid, insured label.`,
  },
  {
    id: 'sizing',
    question: 'What if the ring does not fit?',
    answer:
      'We resize free of charge within the first year. Tell us the size you need and we will send a prepaid label; most resizes are back on your hand within two weeks.',
  },
  {
    id: 'warranty',
    question: 'Is there a warranty?',
    answer: `Yes. ${POLICY.warranty}, covering the setting, prongs and finish for as long as you own the ring. Cleaning and inspection are complimentary at any time.`,
  },
  {
    id: 'tracking',
    question: 'How can I track my order?',
    answer:
      'You will receive an email with an insured tracking number as soon as your ring ships. Order status is also visible at any time in the order history section of your account.',
  },
];
