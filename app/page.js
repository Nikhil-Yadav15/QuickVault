"use client";

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import getFileIcon from "./componets/getFileIcon";
import "./globals.css";
import { ClipLoader } from "react-spinners";
import { X, Copy, Check, Upload, CloudUpload } from "lucide-react";
import formatBytes from './componets/formatBytes';
import pako from 'pako';
import CircularProgress from './componets/circluarProgressBar';
import { useRouter } from "next/navigation";
import QRCodePopup from './componets/popup';
import SetPasswordPopup from './componets/SETpasswordPopup';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BackgroundBeams from "@/components/ui/background-beams";
import TextGenerateEffect from "@/components/ui/text-generate-effect";
import SplitText from "@/components/ui/split-text";
import FloatingFiles from "@/components/ui/floating-files";
import ConfettiBurst from "@/components/ui/confetti-burst";


export default function Home() {

  const [password, setPasswordParent] = useState("");
  const [userPasswordPopup, setuserPasswordPopup] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [customEmail, setCustomEmail] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [SpinnerLoading, setSpinnerLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState('localhost:3000/yourCustomUrl');
  const [changeBGCopy, setchangeBGCopy] = useState(false);
  const [changeURLbg, setChangeURLbg] = useState(false);
  const [uploading, setUploading] = useState(false); //?
  const [percentage, setPercentage] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [atleastAddfile, setAtleastAddfile] = useState(false);
  const [uploadBtnDisabled, setUploadBtnDisabled] = useState(true);
  const router = useRouter();
  const CHUNK_SIZE = 5 * 1024 * 1024;
  const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024;

  useEffect(() => {
    const logVisit = async () => {
      try {
        const response = await fetch('/api/track', {
          method: 'POST',
        });
        if (!response.ok) {
          console.error('Failed to log');
        }
      } catch (error) {
        console.error('Error logging:', error);
      }
    };
    logVisit();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUploadBtn();
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setErrorMessage("");



    const newFileSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize + newFileSize > MAX_FILE_SIZE) {
      setErrorMessage(`Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTotalSize(prevTotal => prevTotal + newFileSize);
    setAtleastAddfile(false);
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, [totalSize, MAX_FILE_SIZE]);

  const [deletingIndex, setDeletingIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: true, maxSize: MAX_FILE_SIZE, onDropRejected: () => {
      setErrorMessage(`Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`);
    }
  });
  const removeFileThroughX = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };
  const handleRemoveFile = (index) => {
    setMounted(false);
    setDeletingIndex(index);
    const removedFileSize = selectedFiles[index].size;
    setTotalSize(totalSize - removedFileSize);
    setTimeout(() => {
      removeFileThroughX(index);
      setDeletingIndex(null);
    }, 300);
  };

  const shPercentage = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <CircularProgress fileCount={selectedFiles.length} percentage={percentage <= 100 ? percentage : 100} totalSize={totalSize} uploadedSize={uploadedSize} onClick={() => { setPasswordParent(''); setPercentage(0); setUploadedSize(0); setUploading(false); setIsFlipped(false); setSelectedFiles([]); setTotalSize(0); setCustomEmail(''); router.push("/"); }} />
      </div>)
  }

  const showfiles = () => {
    return (
      <div className="showingfiles w-full md:w-[90%] max-w-[700px] rounded-xl flex justify-center items-center">
        <div className="glass-card flex flex-col pl-4 pr-4 pt-6 pb-8 w-[90%] h-120 overflow-y-auto custom-scroll">
          <div className="sticky top-0 z-10 pb-2">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-center border-b border-white/10 mb-4 pb-3">
              Files to Upload
            </h1>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>{formatBytes(totalSize)}</span>
                <span>{formatBytes(MAX_FILE_SIZE)}</span>
              </div>
              <Progress value={(totalSize / MAX_FILE_SIZE) * 100} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-cyan-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scroll space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`glass flex justify-between items-center rounded-xl p-3 transition-all duration-300 ease-out ${deletingIndex === index ? "animate-slide-out" : ""
                  } ${mounted ? "animate-slide-in" : ""} hover:bg-white/[0.06]`}
              >
                <div className="flex items-center min-w-0 flex-grow gap-2.5">
                  {getFileIcon(file.name)}
                  <div className="flex items-baseline min-w-0 gap-1.5">
                    <span className="truncate text-white/80 text-sm">{file.name}</span>
                    <span className="text-emerald-400/70 text-xs flex-shrink-0">{formatBytes(file.size)}</span>
                  </div>
                </div>
                <X
                  className="w-5 h-5 text-white/30 cursor-pointer hover:text-red-400 hover:rotate-90 transition-all duration-200 ease-out flex-shrink-0"
                  onClick={() => handleRemoveFile(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  const showBenefit = () => {
    return (
      <div className="flex flex-col text-center justify-center items-center p-3 md:pl-8 max-w-2xl">
        {/* 3D Floating File Objects */}
        <div className="hidden md:flex w-full justify-center mb-6">
          <FloatingFiles className="w-[360px] h-[340px]" />
        </div>

        <h2 className="text-2xl md:text-4xl font-bold mb-6">
          <SplitText
            text="Effortless File Transfers, Simplified."
            className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            delay={0.03}
          />
        </h2>
        <TextGenerateEffect
          words="Welcome to the future of file sharing. Upload files seamlessly and generate custom links instantly — no sign-ups, no logins, just pure simplicity."
          className="text-lg md:text-xl text-white/80 leading-relaxed mb-5"
        />
        <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-5">
          <span className="font-semibold text-emerald-400">Upload. Share. Relax.</span> Your files are securely stored and easily accessible.
        </p>
        <p className="text-lg md:text-xl text-white/60 leading-relaxed hidden md:block">
          Drag and drop your files, or click to upload. Your custom link will be ready in seconds.
        </p>
      </div>
    )
  }

  const compressFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const compressed = pako.deflate(uint8Array);

        resolve(new File([compressed], file.name + ".compressed", { type: "application/octet-stream" }));
      };
      reader.readAsArrayBuffer(file);
    });
  };
  const calculateProgressIncrement = (fileSize) => {
    return (fileSize / totalSize) * 100;
  };
  const calculatefilesent = (fileSize) => {
    return fileSize;
  };
  const splitFileIntoChunks = (file) => {
    const chunks = [];
    let start = 0;

    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      chunks.push(chunk);
      start = end;
    }

    return chunks;
  };
  const uploadChunkToCloudinary = async (chunk, fileName, chunkIndex) => {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("upload_preset", "fileShare");
    formData.append("folder", "uploads");
    formData.append("resource_type", "raw");
    formData.append("public_id", `${fileName}_chunk_${chunkIndex}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error("Failed to upload chunk to Cloudinary");
    }
    setPercentage((prevPercentage) => Math.ceil(prevPercentage + calculateProgressIncrement(chunk.size)));
    setUploadedSize((prev) => prev + calculatefilesent(chunk.size));
    return response.json();
  };

  const uploadFileToCloudinary = async (file) => {
    const compressedFile = await compressFile(file);

    let results;
    if (compressedFile.size > 10 * 1024 * 1024) {
      const chunks = splitFileIntoChunks(compressedFile);
      const uploadPromises = chunks.map((chunk, index) =>
        uploadChunkToCloudinary(chunk, file.name, index)
      );
      results = await Promise.all(uploadPromises);
    } else {
      const result = await uploadChunkToCloudinary(compressedFile, file.name, 0);
      results = [result];
    }

    return results;
  };

  const handleUploadBtn = async () => {
    setSpinnerLoading(true);
    setuserPasswordPopup(false);
    const dt = { "CustomEmail": customEmail }
    setUploadedSize(0);
    setLink(process.env.NEXT_PUBLIC_FOR_LINK + customEmail);


    if (selectedFiles.length > 0) {
      try {
        const res = await fetch("/api/findFilePresence", {
          method: "POST",
          body: JSON.stringify(dt),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        if (data.success) {
          setIsFlipped(!isFlipped);
          setConfettiKey((k) => k + 1);
          setSpinnerLoading(false);
          try {
            setUploading(true);

            const uploadPromises = selectedFiles.map(async (file) => {
              const results = await uploadFileToCloudinary(file);

              return {
                public_ids: results.map((result) => result.public_id),
                urls: results.map((result) => result.secure_url),
                filename: file.name,
                file_size: file.size,
              };
            });

            const uploadedFiles = await Promise.all(uploadPromises);

            const res = await fetch("/api/uploadNsave", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customUrl: customEmail,
                files: uploadedFiles,
                password: password
              }),
            });
            const finalVerdict = await res.json();
          } catch (error) {
            setUploading(false);
            setIsFlipped(!isFlipped);
          } finally {
            setPercentage(100);
          }
        }
        else {
          setChangeURLbg(true);
          setSpinnerLoading(false);
        }

      }
      catch (error) {
        setUploading(false);
        setIsFlipped(false);
      }
    } else {
      setAtleastAddfile(true);
      setSpinnerLoading(false);
    }
  };


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setchangeBGCopy(true);
      setTimeout(() => { setCopied(false); setchangeBGCopy(false); }, 2000);
    } catch (err) {
      handleFallbackCopy(link);
    }
  };

  const handleFallbackCopy = (text) => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    setCopied(true);
    setchangeBGCopy(true);
    setTimeout(() => { setCopied(false); setchangeBGCopy(false); }, 2000);
    document.body.removeChild(tempTextArea);
  };



  const mainContent = () => {
    return (
      <div className="mainstuff flex justify-center items-center max-[750px]:min-h-full md:min-h-full md:w-[55%] order-2 md:order-2">
        <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
          <div className="flip-card-inner">
            {/* Front Side */}
            <div className="flip-card-front">
              <div className="animated-border flex flex-col p-6 w-[90%] sm:w-[65%] max-w-[700px] overflow-hidden items-center">
                <h2 className={`text-2xl text-center font-semibold ${atleastAddfile ? "text-red-400" : "bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"} pb-4`}>
                  {atleastAddfile ? "Add a File First!" : "Add your files here"}
                </h2>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`group relative flex justify-center items-center p-10 w-full max-w-md rounded-xl overflow-hidden cursor-pointer border border-dashed transition-all duration-500 ${isDragActive ? "border-emerald-500/60 bg-emerald-500/5" : "border-white/15 hover:border-emerald-500/40"}`}
                  style={{ background: isDragActive ? "rgba(16,185,129,0.03)" : "rgba(255,255,255,0.02)" }}
                >
                  <input {...getInputProps()} />
                  <div className="text-center space-y-3">
                    <CloudUpload className={`w-10 h-10 mx-auto transition-all duration-500 ${isDragActive ? "text-emerald-400 -translate-y-1 scale-110" : "text-white/60 group-hover:-translate-y-2 group-hover:scale-115 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"}`} />
                    <p className={`text-sm transition-colors duration-300 ${isDragActive ? "text-emerald-400" : "text-white/70 group-hover:text-emerald-400/80"}`}>
                      {isDragActive ? "Drop to upload!" : "Click or drag files here"}
                    </p>
                    {errorMessage && (
                      <p className="text-red-400 mt-2 text-sm font-medium">{errorMessage}</p>
                    )}
                  </div>
                </div>

                {/* URL Input & Actions */}
                <div className="w-full p-4 pt-5 space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="url-input"
                      className="block text-center text-lg font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                      Enter your Custom URL
                      <span className="text-emerald-500 ml-1">*</span>
                    </label>
                    <input
                      id="url-input"
                      type="url"
                      onKeyDown={handleKeyDown}
                      value={customEmail}
                      onChange={(e) => {
                        setCustomEmail(e.target.value.replace(/[^\w\s-]/g, '-').replace(/\s+/g, '-').replace(/-{2,}/g, '-').replace(/^-{2,}|-{2,}$/g, ''));
                        if (e.target.value) {
                          setUploadBtnDisabled(false);
                        } else {
                          setUploadBtnDisabled(true);
                        }
                        setChangeURLbg(false);
                      }}
                      placeholder={process.env.NEXT_PUBLIC_FOR_PLACEHOLDER}
                      className={`w-full px-4 py-3 rounded-xl text-sm glass-input ${changeURLbg ? "!border-red-500/50 !text-red-400 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
                      pattern="https://.*"
                      required
                    />
                  </div>

                  {changeURLbg && (
                    <p className="text-sm text-red-400">
                      Oops! That URL is taken. Try another unique one!
                    </p>
                  )}

                  {!changeURLbg && <SetPasswordPopup userPasswordPopup={userPasswordPopup} setPasswordParent={setPasswordParent} setuserPasswordPopup={setuserPasswordPopup} />}

                  {SpinnerLoading ? (
                    <div className="flex justify-center py-3">
                      <ClipLoader loading={true} size={50} speedMultiplier={1} color="#10b981" />
                    </div>
                  ) : (
                    <button
                      className={`w-full px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${uploadBtnDisabled
                        ? 'opacity-30 cursor-not-allowed bg-white/10'
                        : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer'
                        }`}
                      onClick={handleUploadBtn}
                      disabled={uploadBtnDisabled}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="flip-card-back">
              <div className="animated-border relative flex flex-col p-6 w-[90%] sm:w-[65%] max-w-[800px] min-h-fit overflow-visible items-center">
                <ConfettiBurst trigger={confettiKey} />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent pb-6 text-center">
                  Your files are ready to share!
                </h2>
                <h3 className="text-lg font-medium text-white/70 mb-3">Copy the link to share your files</h3>

                <div className="flex items-center gap-2 w-full my-3">
                  <input
                    type="text"
                    value={link}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-cyan-300/80 font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${!changeBGCopy
                      ? "glass hover:bg-white/10"
                      : "bg-emerald-500/20 border-emerald-500/30"
                      }`}
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-white/60" />}
                  </button>
                </div>

                <QRCodePopup message={link} />

                <p className="text-sm text-white/50 mt-2">
                  ⚠️ Link expires after <span className="font-medium text-amber-400/70">10 days</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  const showingBenefit = () => {
    return (
      <div className="showBenefi flex justify-center items-center md:items-center w-full md:w-[55%] md:justify-center order-1 md:order-1 px-4">
        {showBenefit()}
      </div>
    )
  }

  const showFilesORPercentage = () => {
    return (
      <div className="showFilesclass flex justify-center items-center w-full md:w-[50%] md:justify-center order-1 md:order-1 px-4">
        {uploading ? shPercentage() : showfiles()}
      </div>
    )
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <BackgroundBeams className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      <div className="main relative z-10 flex-grow flex flex-col md:flex-row">
        {selectedFiles.length > 0 ? showFilesORPercentage() : showingBenefit()}
        {mainContent()}
      </div>
    </div>
  );
};
