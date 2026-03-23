"use client";
import React, { useState } from "react";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const QRCodePopup = ({ message }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="md:w-[50%] w-[70%] py-2.5 px-4 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 my-5 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 font-medium">
          <QrCode className="w-5 h-5" />
          <span>Show QR Code</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="glass-card !bg-[rgba(10,10,20,0.9)] !border-white/10 sm:max-w-md"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-white/90">Scan to Download</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="p-5 bg-white rounded-2xl shadow-lg">
            <QRCodeSVG
              value={message}
              size={200}
              style={{ width: "100%", height: "auto", maxWidth: "200px" }}
            />
          </div>
          <p className="text-sm text-white/50 text-center break-all px-4">
            {message}
          </p>
          <Button
            onClick={() => setOpen(false)}
            className="w-full max-w-[200px] bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-0 cursor-pointer"
            size="lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePopup;
