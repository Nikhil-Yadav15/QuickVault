"use client";
import React, { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SetPasswordPopup = ({ setPasswordParent, setuserPasswordPopup, userPasswordPopup }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCheckboxChange = () => {
    setIsChecked(true);
    setuserPasswordPopup(true);
    setIsPopupOpen(true);
    if (!userPasswordPopup) {
      setPasswordParent("");
      setPassword("");
    }
  };

  const handleSubmit = () => {
    setPasswordParent(password);
    console.log("Password set:", password);
    setIsPopupOpen(false);
    if (password !== "") {
      setIsChecked(true);
      setuserPasswordPopup(true);
    } else {
      setIsChecked(false);
      setuserPasswordPopup(false);
    }
  };

  return (
    <div className="flex items-center gap-3 my-5">
      <Dialog open={isPopupOpen} onOpenChange={(open) => {
        if (!open) {
          setIsPopupOpen(false);
        }
      }}>
        <DialogContent
          className="glass-card !bg-[rgba(10,10,20,0.95)] !border-white/10 sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-lg">
              Set Password
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 rounded-xl glass-input text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                onClick={() => {
                  setPassword("");
                  setPasswordParent("");
                  setIsPopupOpen(false);
                  setIsChecked(false);
                  setuserPasswordPopup(false);
                }}
                variant="outline"
                className="px-6 bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit()}
                className="px-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-0 cursor-pointer"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <label className="flex items-center gap-2.5 cursor-pointer group" onClick={handleCheckboxChange}>
        <Checkbox
          checked={isChecked && userPasswordPopup}
          className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
        <div className="flex items-center gap-2 text-white/70 group-hover:text-white/90 transition-colors">
          <LockKeyhole className="w-4 h-4" />
          <span className="font-medium text-sm">Add Password</span>
        </div>
      </label>
    </div>
  );
};

export default SetPasswordPopup;
