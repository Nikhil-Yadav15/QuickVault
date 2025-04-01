"use client";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import "@/app/forPopup.css";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

const SetPasswordPopup = ({ setPasswordParent, setuserPasswordPopup, userPasswordPopup}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(true);
        setuserPasswordPopup(true);
        setIsPopupOpen(true);
        if (!userPasswordPopup){
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
        <div className="flex items-center gap-2 my-5">
            <Popup
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                position="center center"
                modal
                nested
                closeOnDocumentClick={false}
            >
                {(close) => (
                    <div
                        style={{
                            background: "linear-gradient(to bottom right, #000000, #1e40af)",
                            padding: "20px",
                            borderRadius: "12px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                            textAlign: "center",
                            border: "1px solid #10B981",
                            width: "100%",
                            maxWidth: "700px",
                            margin: "0 auto",
                        }}

                    >
                        <h3 className="bg-gradient-to-l from-green-400 via-green-500 to-emerald-300 bg-clip-text text-transparent text-xl font-semibold mb-5">
                            Set Password
                        </h3>

                        <div className="space-y-4 mb-5 relative">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full p-3 rounded-lg bg-amber-50 border focus:border-blue-500 focus:ring-2 focus:ring-green-200 focus:bg-white hover:border-blue-800 placeholder-gray-400 text-gray-700 border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {isPasswordVisible ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>

                        </div>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    setPassword("");
                                    setPasswordParent("");
                                    setIsPopupOpen(false);
                                    setIsChecked(false);
                                    setuserPasswordPopup(false);
                                }}
                                className="px-6 py-2 hover:cursor-pointer bg-gradient-to-r from-red-400 to-orange-900 text-white rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSubmit(close)}
                                className="px-6 py-2 hover:cursor-pointer bg-gradient-to-r from-blue-800 to-cyan-600 text-white rounded-lg font-medium"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}
            </Popup>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isChecked && userPasswordPopup}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 hover:cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2 text-white">
                    <LockKeyhole className="w-5 h-5" />
                    <span className="font-medium text-[clamp(1rem, 5vw, 3rem)] max-[750px]:text-[clamp(1rem, 1vw, 1rem)]">Add Password</span>
                </div>
            </label>
        </div>
    );
};

export default SetPasswordPopup;
