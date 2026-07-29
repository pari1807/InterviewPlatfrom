import React from "react";
import { Link } from "react-router";
import { Zap, Code2, Users, Crown, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Badge, getDifficultyBadgeVariant } from "./ui/Badge";
import { Card, CardHeader, CardBody } from "./ui/Card";
import { Button } from "./ui/Button";

export default function ActiveSessions({ sessions = [], isLoading = false, isUserInSession }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Zap className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Active Rooms</h2>
            <p className="text-xs text-slate-500">Real-time collaborative candidate sessions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">{sessions.length} Active</span>
        </div>
      </CardHeader>

      <CardBody className="flex-1 overflow-y-auto max-h-[380px] p-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="size-8 animate-spin text-emerald-600 mb-2" />
            <p className="text-xs">Fetching active rooms...</p>
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => {
            const inSession = isUserInSession ? isUserInSession(session) : false;
            const isFull = session.participant && !inSession;

            return (
              <div
                key={session._id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    <Code2 className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">
                        {session.problem}
                      </h3>
                      <Badge variant={getDifficultyBadgeVariant(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Crown className="size-3.5 text-amber-500" />
                        <span className="font-medium text-slate-700">{session.host?.name || "Host"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5 text-slate-400" />
                        <span>{session.participant ? "2/2 Participants" : "1/2 Participants"}</span>
                      </span>
                      {isFull ? (
                        <Badge variant="error" size="sm">
                          FULL
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">
                          OPEN
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  {isFull ? (
                    <Button variant="ghost" size="sm" disabled className="w-full sm:w-auto">
                      Full
                    </Button>
                  ) : (
                    <Link to={`/session/${session._id}`} className="block">
                      <Button variant="primary" size="sm" className="w-full sm:w-auto">
                        <span>{inSession ? "Rejoin" : "Join Session"}</span>
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4">
            <div className="size-14 mx-auto mb-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
              <Sparkles className="size-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No active interview rooms</p>
            <p className="text-xs text-slate-500 mt-1">Be the first candidate to host a live room!</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
