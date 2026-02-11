import { trpc } from "@good-dog/trpc/client";
import Header from "../Header";
import type {
  MusicSubmission,
} from "@prisma/client";
import { useState } from "react";
import { TableHeaderFormatting, TableOuterFormatting, TableRowFormatting } from "./TableFormatting";
import { Controls } from "./Controls";

/**
 * Song sub-page of admin dashboard.
 */
export default function Songs() {
    const [data] = trpc.music.useSuspenseQuery();
  return <p className="flex flex-col gap-[32px]">
    <Header
        title={"Songs"}
        subtitle={"Subtitle here"}
        requestPath={""}
        buttonContent="Invite"
      />
      <SongTable
        data={data.music}
      />

  </p>;
}

function SongTable({
  data,
}: {
  data: MusicSubmission[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  if (!data) {
    return <p>Loading...</p>;
  }

  // Calculate pagination
  const userQuery = trpc.user.useSuspenseQuery();
  const user = userQuery[0];

  return (
    <TableOuterFormatting>
      <Controls setSelectedFilter={setSelectedFilter} setSearchTerm={setSearchTerm} />
      <div className="flex flex-col">
        <TableHeaderFormatting>
          <p>Song Name</p>
          <p>Musician</p>
          <p>Description</p>
          <p>Date Submitted</p>
          <p>Song Link</p>
        </TableHeaderFormatting>

        {data
          .map((user: MusicSubmission, key) => {
            return (
                <TableRowFormatting key={key} isLast={key === data.length - 1}>
                <p>{user.songName}</p>
                <p>{user.performerName}</p>
                <p>
                  {"Need description"}
                </p>
                <p>
                    {user.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                </p>
                <a href={user.songLink}>
                    {user.songLink}
                    </a>
              </TableRowFormatting>
            );
          })}
      </div>
    </TableOuterFormatting>
  );
}
