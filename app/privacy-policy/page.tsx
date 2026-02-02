import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-16">
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <RiArrowLeftLine className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
          Privacy Policy
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            1. Information We Collect
          </h2>
          <p className="leading-7 not-first:mt-6">
            When you use Tachyon Hub, we collect information through Discord OAuth authentication, including:
          </p>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Discord user ID</li>
            <li className="leading-7">Discord username and avatar</li>
            <li className="leading-7">Email address (if provided by Discord)</li>
          </ul>
          <p className="leading-7 not-first:mt-6">
            We also collect information you provide when using the service, such as:
          </p>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Redeem codes you create or manage</li>
            <li className="leading-7">Rewards information</li>
            <li className="leading-7">API keys generated for your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            2. How We Use Your Information
          </h2>
          <p className="leading-7 not-first:mt-6">
            We use the information we collect to:
          </p>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Provide, maintain, and improve our services</li>
            <li className="leading-7">Authenticate your identity and manage your account</li>
            <li className="leading-7">Display your username and avatar in the application</li>
            <li className="leading-7">Enable you to create and manage redeem codes</li>
            <li className="leading-7">Communicate with you about service updates or issues</li>
            <li className="leading-7">Monitor and analyze usage patterns to improve user experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            3. Information Sharing and Disclosure
          </h2>
          <p className="leading-7 not-first:mt-6">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">With your consent</li>
            <li className="leading-7">To comply with legal obligations</li>
            <li className="leading-7">To protect our rights, privacy, safety, or property</li>
            <li className="leading-7">In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            4. Data Security
          </h2>
          <p className="leading-7 not-first:mt-6">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          <p className="leading-7 not-first:mt-6">
            Your API keys are stored securely and are only visible to you. We use industry-standard encryption to protect sensitive data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            5. Data Retention
          </h2>
          <p className="leading-7 not-first:mt-6">
            We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            6. Your Rights
          </h2>
          <p className="leading-7 not-first:mt-6">
            You have the right to:
          </p>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Access your personal information</li>
            <li className="leading-7">Correct inaccurate or incomplete information</li>
            <li className="leading-7">Request deletion of your personal information</li>
            <li className="leading-7">Object to processing of your personal information</li>
            <li className="leading-7">Request data portability</li>
          </ul>
          <p className="leading-7 not-first:mt-6">
            To exercise these rights, please contact us through our support channels.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            7. Cookies and Tracking
          </h2>
          <p className="leading-7 not-first:mt-6">
            We use cookies and similar tracking technologies to maintain your session and improve your experience. You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            8. Third-Party Services
          </h2>
          <p className="leading-7 not-first:mt-6">
            We use Discord OAuth for authentication. Please refer to Discord&apos;s Privacy Policy to understand how they handle your data. We are not responsible for the privacy practices of third-party services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            9. Children&apos;s Privacy
          </h2>
          <p className="leading-7 not-first:mt-6">
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            10. Changes to Privacy Policy
          </h2>
          <p className="leading-7 not-first:mt-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
          <p className="leading-7 not-first:mt-6">
            Your continued use of the service after any changes indicates your acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            11. Contact Us
          </h2>
          <p className="leading-7 not-first:mt-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us through our Discord support server or via <a href="mailto:support@tachyonhub.com">email</a>.
          </p>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-none border">
          <p className="leading-7 text-sm">
            This privacy policy was last updated on {new Date().toLocaleDateString()}. By using Tachyon Hub, you acknowledge that you have read and understood this policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  )
}
