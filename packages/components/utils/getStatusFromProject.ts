import { MatchState    } from '@prisma/client';
import type {Match, ProjectSubmission, SongRequest} from '@prisma/client';

type SongRequestWithMatch = SongRequest & {matches : Match[]}

interface SongRequests {songRequests : SongRequestWithMatch[]}

export type ProjectSubmissionWithSongRequestAndMatches = ProjectSubmission & SongRequests

export default function getStatusFromProject(project : ProjectSubmissionWithSongRequestAndMatches) {
    const actionRequired = project.songRequests.some((songReq) =>
        songReq.matches.some(
        (match) => match.matchState === MatchState.NEW,
        ),
    );
    // Something approved by media maker but not by musician
    const pendingApproval = project.songRequests.some((songReq) =>
        songReq.matches.some(
        (match) => match.matchState === MatchState.SONG_REQUESTED,
        ),
    );

    // Complete when all requests in approved by musician state
    const completed = project.songRequests.every((scene) =>
        scene.matches.every(
        (match) => match.matchState === MatchState.APPROVED_BY_MUSICIAN,
        ),
    );

    const matchSize = project.songRequests.reduce((prev, song) => {
        return prev + song.matches.length;
    }, 0);

   return actionRequired
              ? "in progress"
              : pendingApproval
                ? "in review"
                : matchSize === 0
                  ? "not started"
                  : completed
                    ? "completed" : "unknown"


}