import { contactData } from "@/data/contact";
import { Reveal } from "@/components/Reveal";

export function StudioLocation() {
  const { studio } = contactData;

  return (
    <section className="py-20 md:py-32 bg-[#fdfbf9]">
      <div className="section-padding mx-auto max-w-[1400px]">
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Our Space
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              VISIT THE STUDIO
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-5 items-stretch bg-white border border-border/50 shadow-sm">
          <Reveal variant="left" className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-center">
            <h3 className="font-serif text-2xl mb-6">{studio.name}</h3>
            
            <address className="not-italic text-muted leading-loose mb-10 text-sm md:text-base">
              {studio.address}<br />
              {studio.city}, {studio.state}<br />
              {studio.country}
            </address>

            {studio.googleMapsUrl && (
              <a 
                href={studio.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block border border-border hover:border-accent hover:text-accent transition-colors duration-300 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-center w-full md:w-auto"
              >
                Get Directions
              </a>
            )}
          </Reveal>
          
          <Reveal variant="right" className="lg:col-span-3 min-h-[400px] relative bg-neutral-100">
            {studio.googleMapsUrl ? (
              <iframe
                src="https://maps.google.com/maps?q=Dondaicha,%20Maharashtra%20425408&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                title="Studio Location"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted/50 text-sm uppercase tracking-widest">
                [ Map Location to be Confirmed ]
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
