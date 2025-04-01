"use client";
import React from "react";
import Popup from "reactjs-popup";
import "@/app/forPopup.css";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const QRCodePopup = ({ message }) => {
    return(<Popup
      trigger={
          <button className="md:w-[50%] w-[70%] p-2 flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg hover:from-teal-500 hover:to-green-500 transition-all duration-300 my-5 hover:cursor-pointer">
              <QrCode className="w-6 h-6" />
              <span className="font-bold">{"Show QR Code"}</span>
          </button>
      }
      position="right center"
      modal
      nested
  >
      {(close) => (
          <div
              style={{
                  backgroundColor: "#1e293b", 
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  textAlign: "center",
                  border: "1px solid #334155",
                  width: "100%", 
                  margin: "0 auto",
              }}
          >

              <div
                  style={{
                      padding: "20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      display: "inline-block",
                      width: "100%",
                      maxWidth: "300px",
                  }}
              >
                  <QRCodeSVG
                      value={message}
                      size={256}
                      style={{
                          width: "100%",
                          height: "auto", 
                      }}
                  />
              </div>

              <p
                  style={{
                      marginTop: "20px",
                      fontSize: "clamp(14px, 4vw, 16px)", 
                      color: "#d1d5db", 
                      fontWeight: "500",
                      wordBreak: "break-word", 
                  }}
              >
                  {message}
              </p>

              <button
                  onClick={close}
                  style={{
                      marginTop: "30px",
                      padding: "12px 24px",
                      backgroundColor: "#3b82f6", 
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "clamp(14px, 4vw, 16px)", 
                      fontWeight: "600",
                      transition: "background-color 0.3s ease",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                      width: "100%", 
                      maxWidth: "200px", 
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")} 
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")} 
              >
                  Close
              </button>
          </div>
      )}
  </Popup>);
};

export default QRCodePopup;
