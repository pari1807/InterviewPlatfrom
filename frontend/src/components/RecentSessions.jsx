import React from "react";
import { Clock, Code2, Users, Trophy, Loader2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge, getDifficultyBadgeVariant } from "./ui/Badge";
import { Card, CardHeader, CardBody } from "./ui/Card";

export default function RecentSessions({ sessions = [], isLoading = false }) {
  return (
    <Card className="mt-8">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60">
            <Clock className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Past Interview Sessions</h2>
            <p className="text-xs text-slate-500">History of your completed practice rooms</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-16 text-slate-400">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => {
              const isActive = session.status === "active";
              return (
                <div
                  key={session._id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? "bg-emerald-50/40 border-emerald-300"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center font-bold text-white text-sm ${
                          isActive
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                            : "bg-slate-800 text-slate-200"
                        }`}
                      >
                        <Code2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                          {session.problem}
                        </h3>
                        <Badge variant={getDifficultyBadgeVariant(session.difficulty)} size="sm">
                          {session.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {isActive && (
                      <Badge variant="emerald" size="sm" className="animate-pulse">
                        ACTIVE
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-slate-400" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5 text-slate-400" />
                      <span>
                        {session.participant ? "2" : "1"} Participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="font-medium uppercase tracking-wider text-emerald-700">Completed</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="size-14 mx-auto mb-3 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100">
              <Trophy className="size-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No previous sessions yet</p>
            <p className="text-xs text-slate-500 mt-1">Start practicing to build up your interview history!</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
