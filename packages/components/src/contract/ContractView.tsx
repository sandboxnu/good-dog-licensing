"use client";

import { trpc } from "@good-dog/trpc/client";
import { MusicAffiliation, MusicRole } from "@good-dog/db";

const LOCATION_LABELS: Record<string, string> = {
  SOCIAL_MEDIA: "Social Media (Youtube, Instagram, Tik Tok, Vimeo, etc.)",
  PERSONAL_WEBSITE: "Personal Website",
  FILM_FESTIVAL: "Film Festival(s)",
  ACADEMIC_PROJECT: "Academic Project (in-class performance)",
  OTHER: "Other",
};

const MUSIC_ROLE_LABELS: Record<MusicRole, string> = {
  VOCALIST: "Vocalist",
  INSTRUMENTALIST: "Instrumentalist",
  PRODUCER: "Producer",
  SONGWRITER: "Songwriter",
  LYRICIST: "Lyricist",
};

const MASTER_RECORDING_ROLES: MusicRole[] = [
  MusicRole.VOCALIST,
  MusicRole.INSTRUMENTALIST,
  MusicRole.PRODUCER,
];

const COMPOSITION_ROLES: MusicRole[] = [
  MusicRole.SONGWRITER,
  MusicRole.LYRICIST,
];

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border border-black flex items-center justify-center flex-shrink-0">
        {checked && <span className="text-xs leading-none">✓</span>}
      </div>
      <span>{label}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-bold">{children}</span>;
}

export default function ContractView({ contractId }: { contractId: string }) {
  const [contract] = trpc.getContractById.useSuspenseQuery({ contractId });

  const formattedDate = new Date(contract.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const masterContributors = contract.contractMusicContributors.filter((c) =>
    MASTER_RECORDING_ROLES.includes(c.contributorRole),
  );
  const compositionContributors = contract.contractMusicContributors.filter(
    (c) => COMPOSITION_ROLES.includes(c.contributorRole),
  );

  return (
    <div className="bg-white text-black w-full max-w-[850px] px-16 py-14 text-sm leading-relaxed shadow-lg font-serif">
      {/* Title */}
      <h1 className="text-center font-bold text-base uppercase mb-6 tracking-wide">
        Synchronization and Master Use License Agreement
      </h1>

      {/* Preamble */}
      <p className="mb-4 text-justify">
        This Synchronization and Master Use License Agreement (this{" "}
        <SectionLabel>&ldquo;License&rdquo;</SectionLabel>), dated as of{" "}
        <span className="font-semibold">{formattedDate}</span> (&ldquo;Effective
        Date&rdquo;) is between{" "}
        <span className="font-semibold">{contract.licensorFullName}</span>{" "}
        {contract.licensorEntity && <>({contract.licensorEntity})</>} (the{" "}
        <SectionLabel>&ldquo;Licensor&rdquo;</SectionLabel>), and{" "}
        <span className="font-semibold">{contract.licenseeFullName}</span>{" "}
        {contract.licenseeEntity && <>({contract.licenseeEntity})</>} (the{" "}
        <SectionLabel>&ldquo;Licensee&rdquo;</SectionLabel>).
      </p>

      <p className="mb-4 text-justify">
        <SectionLabel>Licensee</SectionLabel> is a media maker who has produced
        or is producing for distribution and/or public performance an audio or
        audiovisual project, as set forth in{" "}
        <span className="underline">Schedule A</span> and made a part hereof
        (the <SectionLabel>&ldquo;Production&rdquo;</SectionLabel>).
      </p>

      <p className="mb-6 text-justify">
        <SectionLabel>Licensor</SectionLabel> is the copyright owner(s) who owns
        and/or controls all rights in and to the musical composition and sound
        recording as set forth in <span className="underline">Schedule B</span>{" "}
        attached hereto and made a part hereof (the{" "}
        <SectionLabel>&ldquo;Song&rdquo;</SectionLabel>) and who desires to
        grant all necessary rights to Licensee for Licensee&rsquo;s use of the
        Song in the Production, as set forth in{" "}
        <span className="underline">Schedule A</span> and{" "}
        <span className="underline">Schedule B</span>.
      </p>

      <p className="font-bold mb-4 uppercase">
        Accordingly, the parties agree as follows:
      </p>

      {/* Section 1 */}
      <div className="mb-4">
        <p className="font-bold mb-2">1. Definitions.</p>
        <div className="pl-6 space-y-2">
          <p className="text-justify">
            a. <SectionLabel>&ldquo;Song&rdquo;</SectionLabel> means the musical
            composition and sound recording collectively, to which rights are
            granted under this License and whose title is provided in{" "}
            <span className="underline">Schedule B</span>.
          </p>
          <p className="text-justify">
            b. <SectionLabel>&ldquo;All Owners&rdquo;</SectionLabel> means all
            persons and/or entities who own and/or control any rights in and to
            the Song, including without limitation, recording artists,
            composers, songwriters, publishers, and/or producers, as may be set
            forth on <span className="underline">Schedule B</span>. The Licensor
            is the signatory to this License on behalf of All Owners.
          </p>
          <p className="text-justify">
            c. <SectionLabel>&ldquo;Production&rdquo;</SectionLabel> means the
            audiovisual media production with the title and description set
            forth in <span className="underline">Schedule A</span>.
          </p>
          <p className="text-justify">
            d. <SectionLabel>&ldquo;Scope of Use&rdquo;</SectionLabel> means the
            details of the Song&rsquo;s use in the Production, set forth in{" "}
            <span className="underline">Schedule A</span>, with which the
            Licensee shall substantially conform to in Licensee&rsquo;s actual
            use of the Song.
          </p>
          <p className="text-justify">
            e. The <SectionLabel>&ldquo;Term&rdquo;</SectionLabel> of this
            License shall commence upon execution of this License and continue
            for the life of copyright(s) to which rights are granted under this
            License.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mb-4">
        <p className="text-justify">
          <span className="font-bold">2. Termination.</span> Notwithstanding
          anything to the contrary contained herein, if Licensee fails to comply
          with the conditions and limitations of this License, then this License
          will terminate automatically. To reinstate this License, Licensee must
          either (i) cure the failure to comply within 30 days of the
          termination of this License, or (ii) receive express written
          reinstatement by the Licensor. Sections 1, 4, 5, and 6 survive
          termination of this License.
        </p>
      </div>

      {/* Section 3 */}
      <div className="mb-4">
        <p className="font-bold mb-2">3. Grant of License &amp; Limitations.</p>
        <div className="pl-6 space-y-3">
          <div>
            <p className="font-bold mb-1">a. Grant of License.</p>
            <p className="pl-4 mb-1 text-justify">
              In consideration of the conditions of this License, subject to the
              terms and conditions hereof, Licensor hereby grants to Licensee:
            </p>
            <div className="pl-8 space-y-2">
              <p className="text-justify">
                i. <span className="underline">Synch License</span>: an
                irrevocable, non-exclusive, non-sublicensable license to record
                and synchronize the Song solely as described under Scope of Use
                and the Duration set forth in{" "}
                <span className="underline">Schedule A</span>;
              </p>
              <p className="text-justify">
                ii.{" "}
                <span className="underline">Direct Performance License</span>:
                an irrevocable, non-exclusive, personal, non-sublicensable
                license to exhibit and publicly perform the Production embodying
                the Song throughout the world (the{" "}
                <SectionLabel>&ldquo;Territory&rdquo;</SectionLabel>) in any
                medium or forum whether now known or hereafter devised;
              </p>
              <p className="text-justify">
                iii. <span className="underline">Performance Sublicense</span>:
                an irrevocable, non-exclusive license to permit any third party
                (&ldquo;Exhibitor&rdquo;) the right to exhibit and publicly
                perform the Production embodying the Song throughout the world
                (the <SectionLabel>&ldquo;Territory&rdquo;</SectionLabel>) in
                any medium or forum whether now known or hereafter devised,
                conditioned upon each such Exhibitor having a valid performance
                license from the person, firm, corporation or other entity which
                has the legal right and authority to issue licenses to publicly
                perform the Song in each country of the Territory in which the
                Song shall be performed hereunder, or from the Licensor
                directly.
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-1">b. Limitations.</p>
            <p className="pl-4 mb-1 text-justify">
              The Licensee may only use the Song under this License subject to
              the following conditions and limitations:
            </p>
            <div className="pl-8 space-y-2">
              <p className="text-justify">
                i. <SectionLabel>Attribution.</SectionLabel> Licensee shall
                provide a written on-screen credit to Licensor, as set forth in{" "}
                <span className="underline">Schedule B</span>, in equal size and
                prominence with other contributors to the Production.
              </p>
              <p className="text-justify">
                ii. <SectionLabel>Cue Sheets.</SectionLabel> Subject to Licensor
                affiliating with a Performance Rights Organization
                (&ldquo;PRO&rdquo;) (e.g., ASCAP, BMI, SESAC), Licensee shall
                file a cue sheet with such PRO (as set forth in Schedules A and
                B).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="mb-4">
        <p className="font-bold mb-2">4. Representations &amp; Warranties.</p>
        <p className="pl-6 mb-2 text-justify">
          Licensor represents and warrants that:
        </p>
        <div className="pl-6 space-y-2">
          <p className="text-justify">
            a. Licensor has the full legal right, power and authority to grant
            this License on behalf of All Owners. Licensor has provided complete
            and accurate information about All Owners in{" "}
            <span className="underline">Schedule B</span>.
          </p>
          <p className="text-justify">
            b. The exercise by the Licensee of the rights granted herein will
            not infringe upon or violate the copyright or any other rights of
            any person or entity nor subject Licensee to any obligation or
            liability not set forth in this License.
          </p>
        </div>
      </div>

      {/* Section 5 */}
      <div className="mb-4">
        <p className="text-justify">
          <span className="font-bold">5. Indemnity.</span> Licensor agrees to
          indemnify, save and hold Licensee harmless from any and all loss and
          damage arising out of, connected with or as a result of breach by
          Licensor of any warranty, representation, agreement, undertaking or
          covenant contained in this License including, without limitation, any
          claim by any third party in connection with the foregoing, provided
          such claim has been settled with Licensor&rsquo;s prior written
          consent (not to be unreasonably withheld) or reduced to judgment.
        </p>
      </div>

      {/* Section 6 */}
      <div className="mb-8">
        <p className="text-justify">
          <span className="font-bold">6. Entire Agreement/Counterparts.</span>{" "}
          This License constitutes the entire understanding between the Licensor
          and Licensee with respect to the subject matter of this License. Any
          additions or changes in this License shall be valid only if set forth
          in writing and signed by the Licensor and Licensee. This License may
          be executed in counterparts, each of which is deemed an original, but
          all of which together are deemed to be one and the same agreement. A
          signed copy of this License delivered by facsimile, email, or other
          means of electronic transmission is deemed to have the same legal
          effect as delivery of an original signed copy of this License.
        </p>
      </div>

      <p className="font-bold mb-8 text-justify">
        Therefore, the parties agree to be bound by the terms and conditions of
        this License as of the Effective Date.
      </p>

      {/* Signature blocks */}
      {/* TODO: Replace italic name rendering with actual handwritten signature images */}
      <div className="flex gap-16 mb-2">
        <div className="flex-1">
          <p className="font-bold mb-6">Licensor (on behalf of All Owners)</p>
          <p className="mb-1">
            <span className="font-bold">By:</span>{" "}
            {contract.licensorSigned ? (
              <span className="italic">{contract.licensorFullName}</span>
            ) : (
              <span className="border-b border-black inline-block w-56">
                &nbsp;
              </span>
            )}
          </p>
          {contract.licensorSigned && (
            <p className="text-xs text-gray-600 mt-1">Signed</p>
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold mb-6">Licensee</p>
          <p className="mb-1">
            <span className="font-bold">By:</span>{" "}
            {contract.licenseeSigned ? (
              <span className="italic">{contract.licenseeFullName}</span>
            ) : (
              <span className="border-b border-black inline-block w-56">
                &nbsp;
              </span>
            )}
          </p>
          {contract.licenseeSigned && (
            <p className="text-xs text-gray-600 mt-1">Signed</p>
          )}
        </div>
      </div>

      <hr className="my-10 border-black" />

      {/* Schedule A */}
      <div className="mb-10">
        <h2 className="text-center font-bold uppercase mb-1">Schedule A</h2>
        <p className="text-center mb-6">Licensee Information</p>

        <div className="mb-5">
          <p className="font-bold mb-2">A. Licensee Information</p>
          <div className="pl-4 space-y-1">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {contract.licenseeFullName}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {contract.licenseePhone}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {contract.licenseeEmail}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <p className="font-bold mb-2">
            B. Title of the audiovisual production (the{" "}
            <span className="font-bold">&ldquo;Production&rdquo;</span>):
          </p>
          <p className="pl-4">{contract.productionTitle}</p>
        </div>

        <div className="mb-5">
          <p className="font-bold mb-2">
            C. Description/synopsis of the Production:
          </p>
          <p className="pl-4 text-justify">{contract.productionDescription}</p>
        </div>

        <div className="mb-5">
          <p className="font-bold mb-2">
            D. The usage of the Song in the Production (the{" "}
            <span className="font-bold">&ldquo;Scope of Use&rdquo;</span>):
          </p>
          <p className="pl-4 mb-3 text-justify">
            {contract.songRequestDescription}
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold mb-2">
            E. Where will the Production be performed, displayed, distributed,
            exhibited, or otherwise shared?
          </p>
          <div className="pl-4 space-y-2">
            {Object.entries(LOCATION_LABELS).map(([key, label]) => (
              <CheckItem
                key={key}
                checked={contract.locationOfUse === key}
                label={label}
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="my-10 border-black" />

      {/* Schedule B */}
      <div>
        <h2 className="text-center font-bold uppercase mb-1">Schedule B</h2>
        <p className="text-center mb-6">Licensor Information</p>

        <div className="mb-5">
          <p className="font-bold mb-2">A. Licensor Information</p>
          <div className="pl-4 space-y-1">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {contract.licensorFullName}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {contract.licensorPhone}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {contract.licensorEmail}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-bold mb-2">
            B. Title of the musical composition/sound recording (the{" "}
            <span className="font-bold">&ldquo;Song&rdquo;</span>):
          </p>
          <p className="pl-4">{contract.songTitle}</p>
        </div>

        {contract.contractMusicContributors.length > 0 && (
          <div>
            <p className="font-bold mb-3">
              C. &ldquo;All Owner&rdquo; information, including contact
              information if available:
            </p>

            {/* Master Recording Table */}
            {masterContributors.length > 0 && (
              <div className="mb-6">
                <p className="text-center underline mb-2">
                  Master Recording Information
                </p>
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        Name
                      </th>
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        Role
                      </th>
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        Phone/Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {masterContributors.map((c) => (
                      <tr key={c.contractMusicContributorId}>
                        <td className="border border-black px-2 py-1">
                          {c.contributorFullName}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {MUSIC_ROLE_LABELS[c.contributorRole]}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {c.contributorEmail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Composition Table */}
            {compositionContributors.length > 0 && (
              <div className="mb-4">
                <p className="text-center underline mb-2">
                  Composition Information
                </p>
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        Composer (i.e. songwriter)
                      </th>
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        Publisher(s)
                      </th>
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        Phone/Email
                      </th>
                      <th className="border border-black px-2 py-1 text-left font-bold">
                        PRO Affiliation(s)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compositionContributors.map((c) => (
                      <tr key={c.contractMusicContributorId}>
                        <td className="border border-black px-2 py-1">
                          {c.contributorFullName}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {c.contributorPublisher || "—"}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {c.contributorEmail}
                        </td>
                        <td className="border border-black px-2 py-1">
                          {c.contributorAffiliation &&
                          c.contributorAffiliation !== MusicAffiliation.NONE
                            ? c.contributorAffiliation
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
