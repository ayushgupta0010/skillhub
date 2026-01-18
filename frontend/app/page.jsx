import { Navbar } from "./components/navbar.jsx";

export default async function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="pt-18 p-0 relative flex min-h-screen h-max justify-center bg-linear-to-br from-blue-600 via-teal-600 to-green-600 ">
        <div className="rounded-2xl h-fit border border-white/20 shadow-2xl backdrop-blur-xl mx-auto max-w-6xl py-5 space-y-28 bg-zinc-950 text-zinc-100 opacity-75">

          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white transition-colors duration-300 hover:text-blue-400">
              SkillHub
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto transition-colors duration-300 hover:text-zinc-300">
              Learn From Those You Teach!
            </p>
          </section>

          <hr className="border-zinc-800" />

          {/* Idea Section */}
          <h2 className="text-3xl font-bold text-center m-5 text-white">
            The Idea
          </h2>

          <section className="text-center flex flex-row justify-evenly items-center bg-zinc-900/60 rounded-2xl p-10 border border-zinc-800 transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="space-y-4 w-3/8">
              <p className="text-zinc-300 transition-colors duration-300 hover:text-zinc-200">
                People know things, people want to learn things.
              </p>
              <p className="text-zinc-400 transition-colors duration-300 hover:text-zinc-300">
                Traditional courses are expensive and often inaccessible for those balancing learning with a tight budget.
              </p>
              <p className="text-zinc-200 font-medium transition-colors duration-300 hover:text-blue-400">
                So, instead of paying with money, you pay with knowledge!
              </p>
            </div>

            <div className="space-y-4 text-zinc-400 w-3/8">
              <p className="transition-colors duration-300 hover:text-zinc-300">
                SkillHub is a way for skilled people to meet up with other skilled people to share what they know.
              </p>
              <p className="transition-colors duration-300 hover:text-zinc-300">
                In return for teaching something, you get to learn something from the very person you taught.
              </p>
              <p className="transition-colors duration-300 hover:text-zinc-300">
                We specialize in not only getting people to meet each other, but to make the most out of these interactions.
              </p>
            </div>
          </section>

          {/* Features Highlight */}
          <section className="bg-zinc-500/30 rounded-2xl p-10 space-y-6 border border-zinc-400 text-xl text-white transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10">
            <p className="text-zinc-400 max-w-full transition-colors duration-300 hover:text-zinc-300">
              SkillHub sets itself apart by looking at education in a completely new way. People are nuanced and skilled in their own ways, and instead of ignoring that, we embrace that! We allow those who thrive in one area to be the student of those who thrive in another, and through that, push everyone to grow.
            </p>
          </section>

          {/* How It Works */}
          <section className="space-y-10">
            <h2 className="text-3xl font-bold text-center text-white">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="space-y-3 bg-zinc-900/70 p-6 rounded-xl border border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <span className="text-blue-500 font-bold text-xl">
                    {String(num)}
                  </span>
                  <h3 className="text-xl font-semibold text-white">
                    {num === 1 && "Create an Account"}
                    {num === 2 && "Set Your Skills"}
                    {num === 3 && "Connect & Learn"}
                  </h3>
                  <p className="text-zinc-400">
                    {num === 1 &&
                      "Sign up and join a community built around shared learning."}
                    {num === 2 &&
                      "List what you can teach and what you want to learn, including your proficiency levels for smarter matching."}
                    {num === 3 &&
                      "Find matches on our boards, start conversations, host calls, or collaborate in groups — all in one place."}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Feature List */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-white">
              What We Offer
            </h2>

            <ul className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-center">
              {[
                "Built-in real-time messaging",
                "Intelligent skill-based matchmaking",
                "Profile and skill management",
                "Video calls with automatic AI note-taking",
                "Group-based skill exchanges",
                "Discord integration",
              ].map((item) => (
                <li
                  key={item}
                  className="p-6 rounded-xl bg-zinc-900/70 border border-zinc-800 text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:text-white hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </>
  );
}
