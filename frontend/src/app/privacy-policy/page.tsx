"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

const sections = [
    {
        id: "introduction",
        title: "1. Introduction",
        content: `PromptForge ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform at promptforge.dev and use our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the platform.`,
    },
    {
        id: "information-collection",
        title: "2. Information We Collect",
        content: `We collect information you provide directly to us when you create an account, upload prompts, or contact us. This includes:

• Identity Data: Name, username, email address, and profile photo.
• Account Credentials: Password (stored as a secure hash — never in plaintext).
• Content Data: Prompts, descriptions, tags, and comments you post to the platform.
• Usage Data: Pages visited, features used, prompts viewed, and interaction events.
• Technical Data: IP address, browser type, device identifiers, and operating system.
• Preference Data: Bookmarks, vote history, and notification settings.

We also collect data automatically via cookies and similar tracking technologies when you interact with our platform.`,
    },
    {
        id: "how-used",
        title: "3. How We Use Your Information",
        content: `We use the information we collect to:

• Provide, operate, and maintain the PromptForge platform.
• Create and manage your account and profile.
• Process your uploaded prompts and make them available to the community.
• Send you transactional emails (account confirmation, password resets).
• Analyze usage patterns to improve platform performance and features.
• Detect and prevent fraud, abuse, and security incidents.
• Comply with legal obligations and enforce our Terms of Service.
• Respond to your inquiries and provide customer support.

We do not sell your personal data to third parties. We do not use your data for automated decision-making that produces legal effects.`,
    },
    {
        id: "cookies",
        title: "4. Cookies & Tracking",
        content: `We use cookies and similar technologies for:

• Session Management: Essential cookies to keep you logged in.
• Analytics: Anonymous usage statistics via privacy-respecting analytics tools.
• Preferences: Remembering your settings and display preferences.

You can control cookie behavior via your browser settings. Blocking essential cookies may impact platform functionality. We do not use cookies for cross-site advertising tracking.`,
    },
    {
        id: "security",
        title: "5. Data Security",
        content: `We implement industry-standard security measures including:

• TLS/HTTPS encryption for all data in transit.
• Passwords stored using bcrypt hashing with appropriate work factors.
• Database access controls with least-privilege principles.
• Regular security audits and dependency vulnerability scanning.
• Rate limiting and brute-force protection on authentication endpoints.

Despite our best efforts, no security system is impenetrable. We cannot guarantee absolute security of your data and encourage you to use a strong, unique password.`,
    },
    {
        id: "third-party",
        title: "6. Third-Party Services",
        content: `We use select third-party services to operate PromptForge:

• Supabase: Authentication, database, and file storage (GDPR-compliant).
• Google OAuth: Optional login method. Your Google profile data (name, email, avatar) is used to create your account.
• Sentry: Error tracking and crash reporting (anonymized where possible).
• Vercel: Hosting and edge deployment.

Each third party has their own privacy policy. We encourage you to review those policies for services you interact with.`,
    },
    {
        id: "user-rights",
        title: "7. Your Rights",
        content: `Depending on your jurisdiction, you may have the following rights regarding your personal data:

• Right to Access: Request a copy of the personal data we hold about you.
• Right to Rectification: Request correction of inaccurate or incomplete data.
• Right to Erasure: Request deletion of your account and associated data.
• Right to Data Portability: Receive your data in a structured, machine-readable format.
• Right to Object: Object to processing of your data for certain purposes.
• Right to Withdraw Consent: Where processing is based on consent, withdraw it at any time.

To exercise any of these rights, contact us at privacy@promptforge.dev. We will respond within 30 days.`,
    },
    {
        id: "contact",
        title: "8. Contact Information",
        content: `If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:

Email: privacy@promptforge.dev
Address: PromptForge Inc., Data Privacy Team

For GDPR-related inquiries, you may also contact your local data protection authority.

This Privacy Policy was last updated on March 2026. We will notify registered users of material changes via email.`,
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border/50 bg-card/30 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">Privacy Policy</span>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-accent" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight font-display">Privacy Policy</h1>
                        </div>
                        <p className="text-muted-foreground">Effective Date: March 2026 · Last Updated: March 12, 2026</p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* TOC */}
                    <aside className="hidden md:block w-52 shrink-0">
                        <div className="sticky top-24">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contents</p>
                            <nav className="space-y-1">
                                {sections.map(s => (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-md hover:bg-muted/50"
                                    >
                                        {s.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mb-8">
                            <p className="text-sm text-muted-foreground">
                                This Privacy Policy applies to the PromptForge platform and is compliant with GDPR and standard web privacy regulations.
                                By using PromptForge, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {sections.map((section, i) => (
                                <motion.div
                                    key={section.id}
                                    id={section.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.04 }}
                                >
                                    <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                                    <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                                        {section.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap gap-4">
                            <Link href="/terms-of-service" className="text-accent text-sm hover:underline">Terms of Service →</Link>
                            <Link href="/community" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Community Guidelines →</Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
