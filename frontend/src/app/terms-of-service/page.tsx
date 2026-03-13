"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

const sections = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By accessing or using the PromptForge platform ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.

We reserve the right to modify these Terms at any time. Continued use of the Service after changes are posted constitutes your acceptance of the modified Terms. Material changes will be communicated via email or a prominent notice on the platform.`,
    },
    {
        id: "account",
        title: "2. Account Responsibilities",
        content: `To access certain features, you must create an account. By creating an account, you agree to:

• Provide accurate, current, and complete information during registration.
• Maintain the security of your password and accept responsibility for all activity under your account.
• Notify us immediately at support@promptforge.dev of any unauthorized account access.
• Not share your account credentials or allow others to access the platform through your account.

Accounts found to be creating multiple registrations to circumvent bans or restrictions will be permanently suspended.`,
    },
    {
        id: "acceptable-use",
        title: "3. Acceptable Use Policy",
        content: `You may not use the Service to:

• Upload, share, or promote content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable.
• Post prompts designed to generate harmful, discriminatory, or malicious outputs.
• Infringe upon the intellectual property rights of any third party.
• Attempt to gain unauthorized access to any part of the Service or its systems.
• Engage in data scraping, crawling, or harvesting without explicit written permission.
• Spam the platform with duplicate, low-quality, or auto-generated content.
• Impersonate any person, organization, or AI system.
• Use the Service to develop competing products without prior written consent.

Violation of this policy may result in immediate suspension or permanent termination of your account.`,
    },
    {
        id: "intellectual-property",
        title: "4. Intellectual Property",
        content: `User-Generated Content: You retain ownership of prompts and content you upload to PromptForge. By uploading content, you grant PromptForge a worldwide, royalty-free, non-exclusive license to display, host, and distribute your content in connection with the Service.

Platform IP: The PromptForge platform, its design, branding, and underlying technology are owned by PromptForge Inc. and protected by intellectual property laws. You may not copy, modify, or distribute our platform code without permission.

Forked Prompts: When you fork a prompt, you create a derivative work. You must credit the original author and comply with any license specified on the original prompt. By default, all prompts on PromptForge are shared under a Creative Commons Attribution 4.0 license unless otherwise specified.`,
    },
    {
        id: "limitations",
        title: "5. Limitations of Liability",
        content: `To the maximum extent permitted by applicable law, PromptForge and its affiliates, officers, directors, and employees shall not be liable for:

• Any indirect, incidental, special, consequential, or punitive damages.
• Loss of profits, data, use, goodwill, or other intangible losses.
• Damages resulting from unauthorized access to or alteration of your transmissions or data.
• Any conduct or content of third parties on the Service.
• Errors or inaccuracies in any content available on the Service.

Our total liability for any claim arising out of or relating to these Terms shall not exceed the greater of $100 USD or the amount you paid us in the 12 months preceding the claim.`,
    },
    {
        id: "termination",
        title: "6. Termination Policy",
        content: `You may delete your account at any time via the account settings page. Upon deletion, your profile and uploaded content will be removed within 30 days, subject to backup retention policies.

PromptForge may suspend or terminate your account at any time if:

• You violate these Terms or our Acceptable Use Policy.
• We are required to do so by law or regulatory order.
• Your account poses a security risk to the platform or other users.

Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (intellectual property, limitations of liability, dispute resolution) will survive.`,
    },
    {
        id: "disputes",
        title: "7. Dispute Resolution",
        content: `Informal Resolution: Before filing a formal legal claim, you agree to attempt to resolve the dispute informally by contacting us at legal@promptforge.dev. We will try to resolve the dispute within 30 days.

Binding Arbitration: If informal resolution fails, disputes shall be resolved through binding arbitration under the rules of the American Arbitration Association (AAA), except where prohibited by law. Class action lawsuits and class-wide arbitrations are not permitted.

Exceptions: Either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.`,
    },
    {
        id: "governing-law",
        title: "8. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles.

For users outside the United States, local consumer protection laws may provide additional rights that cannot be waived by contract. Nothing in these Terms is intended to limit those rights.

If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.

Questions about these Terms? Contact us at legal@promptforge.dev.`,
    },
];

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border/50 bg-card/30 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">Terms of Service</span>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-accent" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight font-display">Terms of Service</h1>
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
                        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-8">
                            <p className="text-sm text-muted-foreground">
                                These Terms of Service govern your use of the PromptForge platform. By using PromptForge,
                                you agree to these terms. Please read them carefully.
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
                            <Link href="/privacy-policy" className="text-accent text-sm hover:underline">Privacy Policy →</Link>
                            <Link href="/community" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Community Guidelines →</Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
