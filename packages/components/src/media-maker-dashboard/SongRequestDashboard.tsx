import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@good-dog/ui/accordion";

export default function SongRequestDashboard() {
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
