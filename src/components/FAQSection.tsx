import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I prepare for my first visit?",
    answer: "Simply arrive 15 minutes early with clean skin (no makeup). Our team will conduct a thorough consultation to understand your skin type and goals before recommending the perfect treatment plan for you.",
  },
  {
    question: "Are your treatments safe for sensitive skin?",
    answer: "Absolutely. All our treatments begin with a comprehensive skin assessment. We use hypoallergenic, dermatologist-approved products and customize every procedure to suit your skin's unique needs and sensitivities.",
  },
  {
    question: "How many sessions will I need to see results?",
    answer: "Most clients notice visible improvements after their first session. However, for optimal and lasting results, we typically recommend a series of 3-6 sessions depending on the treatment type and your individual goals.",
  },
  {
    question: "Do you offer packages or membership discounts?",
    answer: "Yes! We offer several treatment packages that provide significant savings. Our membership programme also includes priority booking, exclusive discounts of up to 30%, and complimentary consultations.",
  },
  {
    question: "What are your cancellation and rescheduling policies?",
    answer: "We request at least 24 hours' notice for cancellations or rescheduling. Late cancellations may incur a fee of 50% of the treatment cost. We understand emergencies happen and handle them on a case-by-case basis.",
  },
  {
    question: "Is parking available at your location?",
    answer: "Yes, we offer complimentary valet parking for all clients. Simply pull up to our entrance and our team will take care of your vehicle while you enjoy your treatment experience.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-body mb-4">FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg border border-border px-6 data-[state=open]:shadow-gold transition-shadow"
              >
                <AccordionTrigger className="font-display text-base md:text-lg font-semibold text-foreground hover:text-primary transition-colors py-5 [&[data-state=open]>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
