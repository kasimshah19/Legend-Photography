/**
 * PLACEHOLDER TESTIMONIALS — replace with verified client quotes.
 * Set `isPlaceholder: false` only for real testimonials.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  eventType: string;
  image: string;
  isPlaceholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: "demo-1",
    quote:
      "Every frame felt like it belonged in a magazine. They understood our vision without us saying much, and the results were absolutely breathtaking.",
    name: "Aisha & Rohan",
    eventType: "Wedding",
    image: "/images/portfolio/wedding-01.jpg",
    isPlaceholder: true,
  },
  {
    id: "demo-2",
    quote:
      "The candid shots from our pre-wedding are still our favourites — natural, warm, and beautifully lit. The team made us feel so comfortable.",
    name: "Priya & Siddharth",
    eventType: "Pre-Wedding",
    image: "/images/portfolio/prewedding-01.jpg",
    isPlaceholder: true,
  },
  {
    id: "demo-3",
    quote:
      "We hired them for our maternity shoot and couldn't be happier. The aesthetic and premium feel of the pictures is exactly what we wanted.",
    name: "Sneha Kapoor",
    eventType: "Maternity",
    image: "/images/portfolio/maternity-01.jpg",
    isPlaceholder: true,
  },
];
