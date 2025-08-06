"use client";

import { Button } from "@/components/ui/button";
import { gameFont } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="paper-card p-12 rounded-2xl mb-8">
            <h1
              className={cn(
                "text-5xl font-bold text-foreground mb-4",
                gameFont.className
              )}
            >
              ✨ What is <span className="text-primary">Emoki</span>?
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              <strong>Emoki</strong> is a simple, privacy-friendly platform
              where you can write and share your thoughts — we call them{" "}
              <strong>"chits"</strong> — in a safe and meaningful way. It's like
              your personal digital notebook, but with the option to share when
              you feel like it, however you feel like it.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enter">
              <Button size="lg" className="game-button px-8 py-4 text-lg">
                Start Writing Chits
              </Button>
            </Link>
            <Link href="/paper">
              <Button
                variant="secondary"
                size="lg"
                className="game-button-secondary px-8 py-4 text-lg"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What makes Emoki different */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="paper-card p-8 rounded-xl">
            <h2
              className={cn(
                "text-3xl font-bold text-center mb-8",
                gameFont.className
              )}
            >
              🔒 What makes Emoki different?
            </h2>
            <p className="text-lg text-center text-muted-foreground leading-relaxed">
              We believe in giving people a space to{" "}
              <strong>express their real emotions</strong>,{" "}
              <strong>freely but responsibly</strong>. Not everything we feel is
              meant for the world, and not everything we share should have our
              name on it. Emoki is designed to respect that balance.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2
            className={cn(
              "text-3xl font-bold text-center mb-12",
              gameFont.className
            )}
          >
            📦 How does it work?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Vault */}
            <div className="paper-card p-6 rounded-xl">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3">Personal Vault</h3>
              <p className="text-muted-foreground">
                This is your private space. No one but you can see or access the
                chits in this vault. Use this as your digital diary or a place
                to vent without fear.
              </p>
            </div>

            {/* Open to Public */}
            <div className="paper-card p-6 rounded-xl">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3">Open to Public</h3>
              <p className="text-muted-foreground">
                Want to share your thoughts with the world? Add them here. Chits
                in this vault are visible in the public feed and on the site,
                with your name if you choose to show it.
              </p>
            </div>

            {/* Anonymous Mode */}
            <div className="paper-card p-6 rounded-xl">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold mb-3">Anonymous Mode</h3>
              <p className="text-muted-foreground">
                This is for when you want to be heard, but not seen. You can
                post chits anonymously. These are still public, but your
                identity is hidden.
              </p>
            </div>

            {/* Custom Vaults */}
            <div className="paper-card p-6 rounded-xl opacity-75 border-dashed lg:col-span-3 md:col-span-2">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold mb-3">
                Custom Vaults{" "}
                <span className="text-sm text-muted-foreground">
                  (Coming Soon)
                </span>
              </h3>
              <p className="text-muted-foreground">
                You'll be able to create your own vaults and share them with
                close friends. Think of it like a shared journal or memory box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Emoki */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="paper-card p-8 rounded-xl">
            <h2
              className={cn(
                "text-3xl font-bold text-center mb-8",
                gameFont.className
              )}
            >
              🧠 Why Emoki?
            </h2>
            <div className="text-center mb-6">
              <p className="text-lg text-muted-foreground mb-4">
                We all have things we want to say:
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">💭</div>
                <p className="text-muted-foreground">
                  Some are personal and sensitive
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🎭</div>
                <p className="text-muted-foreground">
                  Some deserve to be shared anonymously
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-muted-foreground">
                  Some need a safe community
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">📔</div>
                <p className="text-muted-foreground">
                  Some are just meant for ourselves
                </p>
              </div>
            </div>
            <p className="text-lg text-center text-muted-foreground">
              Emoki gives you <strong>full control</strong> over who sees your
              words. Whether you're journaling privately, expressing
              anonymously, or sharing a thought with the world — Emoki adapts to
              you.
            </p>
          </div>
        </div>
      </section>

      {/* Safe Space */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="paper-card p-8 rounded-xl text-center">
            <h2 className={cn("text-3xl font-bold mb-8", gameFont.className)}>
              💭 A Thoughtful, Safe Space
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We're building Emoki as a space where:
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <p className="text-muted-foreground">
                  Your <strong>privacy</strong> is respected by default.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">💪</div>
                <p className="text-muted-foreground">
                  You can <strong>own your emotions</strong>, not suppress them.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚖️</div>
                <p className="text-muted-foreground">
                  <strong>Freedom of expression</strong> exists with{" "}
                  <strong>accountability</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎭</div>
                <p className="text-muted-foreground">
                  You can choose <strong>who you are</strong> with each chit —
                  yourself, anonymous, or private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="paper-card p-8 rounded-xl">
            <h2 className={cn("text-3xl font-bold mb-6", gameFont.className)}>
              Ready to start writing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join Emoki today and discover a new way to express yourself,
              connect with others, and keep your thoughts safe.
            </p>
            <Link href="/enter">
              <Button size="lg" className="game-button px-12 py-4 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
