import './Home.css';

export default function Home() {
  return (
    <article className="home">
      <h1>Open Jefferson Engine</h1>

      <p>
        <i>This website is currently under construction. It is meant for use as both a reverse engineering tool and as project documentation.</i>
      </p>

      <p>
        <strong>Open Jefferson Engine</strong> is an open-source project dedicated to reverse engineering Fallout: Van Buren — the unreleased RPG developed by Black Isle Studios before its cancellation in 2003.
      </p>

      <section>
        <h2>What is the Open Jefferson Engine Project?</h2>
        <p>
          Initiated by a dream to complete and play the unfinished work of Black Isle Studios, the project aims to analyze, document, and reconstruct the Jefferson Engine and Fallout: Van Buren in C++, leveraging tools like <strong>IDA</strong>, <strong>OOAnalyzer</strong>, and <strong>ImHex</strong>.
        </p>
      </section>

      <section>
        <h2>Technical Methodology</h2>
        <p>
          Our work focuses on both static and dynamic analysis of the Van Buren tech demo.
        </p>
      </section>

      <section>
        <h2>Project Goals</h2>
        <ul>
          <li>
            Completely reverse Van Buren’s underlying code in <strong>Ida</strong>.
          </li>
          <li>
            Generate a c++ codebase from the <strong>Ida</strong> database using a custom made tool to perform automated post processing on the decompiled code.
          </li>
          <li>
            Document the codebase.
          </li>
        </ul>
      </section>

      <section>
        <h2>Open Source and Collaboration</h2>
        <p>
          The project is open-source, inviting contributions from the community. We welcome anyone interested in fallout, reverse engineering, game development, and/or preservation of gaming history to join us.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          Open Jefferson Engine is a non-commercial, community-driven fan project. It is unaffiliated with Bethesda Softworks, Interplay Entertainment, or Black Isle Studios. All proprietary content and trademarks remain the property of their respective owners. This project operates within the boundaries of fair use for research, educational, and preservation purposes.
        </p>
      </section>
    </article>
  );
}
