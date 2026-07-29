import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Settings, Mic, Video, Bell, Globe, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast.success("Platform preferences saved successfully!");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure audio/video devices and platform preferences.</p>
        </div>

        {/* Media Devices Card */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <Video className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Audio & Video Settings</h2>
              <p className="text-xs text-slate-500">Configure default hardware peripherals for Stream video calls</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <Mic className="size-5 text-slate-600" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Microphone Input</p>
                  <p className="text-xs text-slate-500">Enable microphone audio by default on room join</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={micEnabled}
                onChange={(e) => setMicEnabled(e.target.checked)}
                className="size-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <Video className="size-5 text-slate-600" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Camera Video Stream</p>
                  <p className="text-xs text-slate-500">Enable HD camera feed by default on room join</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={camEnabled}
                onChange={(e) => setCamEnabled(e.target.checked)}
                className="size-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Notifications & System Preferences */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60">
              <Bell className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications & Preferences</h2>
              <p className="text-xs text-slate-500">Manage real-time alerts for live candidate sessions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-slate-600" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Email & In-App Alerts</p>
                  <p className="text-xs text-slate-500">Receive notifications when a peer joins your live session</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="size-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="emeraldGradient" size="lg" onClick={handleSave}>
            <Check className="size-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
