import { contactData } from "@/data/contact";
import { whatsappUrl, telUrl } from "@/data/siteConfig";

export function QuickContact() {
  const tel = telUrl();
  const wa = whatsappUrl("Hi, I found Legend Photography through your website and would like to enquire about a photography booking.");

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div>
        <h3 className="font-serif text-2xl mb-2">Connect Directly</h3>
        <p className="text-sm text-muted">
          Prefer a direct conversation? Reach out via WhatsApp or call us.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-6 border border-border/60 hover:border-accent transition-colors duration-300 group"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              WhatsApp
            </span>
            <span className="font-serif text-xl group-hover:text-accent transition-colors duration-300">
              Chat with us directly
            </span>
          </a>
        )}

        {tel && (
          <a
            href={tel}
            className="flex flex-col p-6 border border-border/60 hover:border-accent transition-colors duration-300 group"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              Call Us
            </span>
            <span className="font-serif text-xl group-hover:text-accent transition-colors duration-300">
              Speak with our team
            </span>
            <span className="text-sm text-muted mt-2">{contactData.phone}</span>
          </a>
        )}
        
        {contactData.email && contactData.email !== "[Email Address]" && (
          <a
            href={`mailto:${contactData.email}`}
            className="flex flex-col p-6 border border-border/60 hover:border-accent transition-colors duration-300 group"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              Email
            </span>
            <span className="font-serif text-xl group-hover:text-accent transition-colors duration-300">
              Send us an email
            </span>
          </a>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-border/60">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted mb-6">
          Follow the Stories
        </h4>
        <div className="flex flex-col gap-4">
          {contactData.social.instagram && (
            <a
              href={contactData.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide hover:text-accent transition-colors"
            >
              Instagram
            </a>
          )}
          {contactData.social.facebook && (
            <a
              href={contactData.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide hover:text-accent transition-colors"
            >
              Facebook
            </a>
          )}
          {contactData.social.youtube && (
            <a
              href={contactData.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide hover:text-accent transition-colors"
            >
              YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
