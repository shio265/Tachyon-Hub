import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-16">
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <RiArrowLeftLine className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
          Terms of Service
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="leading-7 not-first:mt-6">
            By accessing and using Tachyon Hub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            2. Use of Service
          </h2>
          <p className="leading-7 not-first:mt-6">
            Tachyon Hub provides a platform for storing and managing game redeem codes. You agree to use the service only for lawful purposes and in accordance with these Terms.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-4">
            You agree not to:
          </h3>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Use the service for any illegal or unauthorized purpose</li>
            <li className="leading-7">Attempt to gain unauthorized access to any portion of the service</li>
            <li className="leading-7">Upload or distribute viruses or any other malicious code</li>
            <li className="leading-7">Engage in any activity that disrupts or interferes with the service</li>
            <li className="leading-7">Impersonate or misrepresent your affiliation with any person or entity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            3. User Accounts
          </h2>
          <p className="leading-7 not-first:mt-6">
            When you create an account with us through Discord OAuth, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.
          </p>
          <p className="leading-7 not-first:mt-6">
            You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            4. Content
          </h2>
          <p className="leading-7 not-first:mt-6">
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through the service.
          </p>
          <p className="leading-7 not-first:mt-6">
            By posting content to the service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            5. API Usage
          </h2>
          <p className="leading-7 not-first:mt-6">
            If you are provided with an API key, you agree to:
          </p>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Keep your API key confidential and secure</li>
            <li className="leading-7">Not exceed reasonable rate limits for API requests</li>
            <li className="leading-7">Not use the API for any unauthorized or illegal purposes</li>
            <li className="leading-7">Accept that we may revoke API access at any time without notice</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            6. Intellectual Property
          </h2>
          <p className="leading-7 not-first:mt-6">
            The service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of Tachyon Hub and its licensors.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            7. Termination
          </h2>
          <p className="leading-7 not-first:mt-6">
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p className="leading-7 not-first:mt-6">
            If you wish to terminate your account, you may simply discontinue using the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            8. Limitation of Liability
          </h2>
          <p className="leading-7 not-first:mt-6">
            In no event shall Tachyon Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            9. Disclaimer
          </h2>
          <p className="leading-7 not-first:mt-6">
            Your use of the service is at your sole risk. The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The service is provided without warranties of any kind, whether express or implied.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            10. Changes to Terms
          </h2>
          <p className="leading-7 not-first:mt-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>
          <p className="leading-7 not-first:mt-6">
            By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            11. Contact Us
          </h2>
          <p className="leading-7 not-first:mt-6">
            If you have any questions about these Terms, please contact us through our support channels.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            These terms of service were last updated on {new Date().toLocaleDateString()}. By using Tachyon Hub, you acknowledge that you have read and understood these terms and agree to be bound by them.
          </p>
        </div>
      </div>
    </div>
  )
}
