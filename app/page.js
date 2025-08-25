"use client";

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from "framer-motion";
import getFileIcon from "./componets/getFileIcon";
import "./globals.css";
import { ClipLoader } from "react-spinners";
import { X, Copy, Check } from "lucide-react";
import formatBytes from './componets/formatBytes';
import pako from 'pako';
import CircularProgress from './componets/circluarProgressBar';
import { useRouter } from "next/navigation";
import QRCodePopup from './componets/popup';
import "./forPopup.css";
import SetPasswordPopup from './componets/SETpasswordPopup';


export default function Home() {

  const [password, setPasswordParent] = useState("");
  const [userPasswordPopup, setuserPasswordPopup] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [customEmail, setCustomEmail] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
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
  const SpinnerOverride = {
    display: "block",
    margin: "2px auto",
    borderWidth: "8px",
  };
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
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <CircularProgress fileCount={selectedFiles.length} percentage={percentage <= 100 ? percentage : 100} totalSize={totalSize} uploadedSize={uploadedSize} onClick={() => { setPasswordParent(''); setPercentage(0); setUploadedSize(0); setUploading(false); setIsFlipped(false); setSelectedFiles([]); setTotalSize(0); setCustomEmail(''); router.push("/"); }} />
      </div>)
  }

  const showfiles = () => {
    return (
      <div className="showingfiles w-full md:w-[90%] max-w-[700px] rounded-xl flex justify-center items-center">
        <div className="flex shadow-lg rounded-xl pl-4 pr-4 pt-8 pb-10 w-[90%] h-120 overflow-y-auto custom-scroll flex-col 
         border-3  backdrop-blur-sm" style={{
            background: `
          linear-gradient(to top left, #1e3a8a, #000000) padding-box,
          linear-gradient(var(--angle), #0f766e, #14b8a6, #0f766e) border-box
        `,
            border: "4px solid transparent",
            animation: "rotate 8s linear infinite",
            flexDirection: "column",
          }}>
          <div className="sticky top-0 z-10  pb-1">
            <h1 className="text-2xl font-bold bg-gradient-to-b from-green-400 via-green-500 to-gray-500 bg-clip-text text-transparent text-center border-b-2 border-green-500 mb-4 pb-2">
              Files to Upload:
            </h1>
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${(totalSize / MAX_FILE_SIZE) * 100}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-black text-sm font-bold">
                  {formatBytes(totalSize)}/{formatBytes(MAX_FILE_SIZE)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scroll">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`bg-gradient-to-b from-gray-200 via-gray-100 to-white mb-2 w-full p-2 border-2 flex justify-between items-center rounded-lg transform transition-all duration-300 ease-out ${deletingIndex === index ? "animate-slide-out" : ""
                  } ${mounted ? "animate-slide-in" : ""} hover:scale-[101%] hover:shadow-sm`}
              >
                <div className="flex items-center min-w-0 flex-grow">
                  {getFileIcon(file.name)}
                  <div className="pl-2 pr-2 flex items-start min-w-0">
                    <div className="truncate text-black pr-2">{file.name} -</div>
                    <div className="text-green-800 flex-shrink-0">{formatBytes(file.size)}</div>
                  </div>
                </div>

                <X
                  className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-700 hover:rotate-90 hover:w-8 hover:h-8 transition-all duration-200 ease-out flex-shrink-0"
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
      <div className="flex flex-col text-center justify-center items-center p-3 md:pl-5">
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
          Effortless File Transfers, Simplified.
        </h2>
        <p className="text-1xl md:text-lg text-gray-300 leading-relaxed mb-6">
          Welcome to the future of file sharing. Our platform empowers you to <span className="font-semibold text-blue-300">upload files seamlessly</span> and generate <span className="font-semibold text-green-300">custom links instantly</span>—no sign-ups, no logins, just pure simplicity. Whether you&apos;re sharing documents, images, or videos, we&apos;ve got you covered.
        </p>
        <p className="text-1xl md:text-lg text-gray-300 leading-relaxed mb-6">
          <span className="font-semibold text-purple-300">Upload. Share. Relax.</span> That&apos;s all it takes. Your files are securely stored and easily accessible, ensuring a hassle-free experience every time.
        </p>
        <p className="text-1xl md:text-lg text-gray-300 leading-relaxed hidden md:block">
          Ready to get started? Drag and drop your files above, or click to upload. Your custom link will be ready in seconds.
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



  const DrogBoxAnimation = isDragActive ? "rotate 5s linear infinite" : "rotate 22s linear infinite";

  // const mainContent = () => {
  //   return (
  //     <div className="mainstuff flex justify-center items-center max-[750px]:min-h-full  md:min-h-full md:w-[55%] order-2 md:order-2">
  //       {/* Card Container */}
  //       <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
  //         <div className="flip-card-inner">
  //           {/* Front Side */}
  //           <div className="flip-card-front">
  //             <div
  //               className="mainCard flex flex-col p-6 w-[90%] sm:w-[65%] max-w-[700px] rounded-xl overflow-hidden items-center hover:scale-[102%] hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-500 ease-in-out"
  //               style={{
  //                 background: `
  //                 linear-gradient(to bottom left, #1e3a8a, #000000) padding-box,
  //                 linear-gradient(var(--angle), #0f766e, #14b8a6, #0f766e) border-box
  //               `,
  //                 border: "4px solid transparent",
  //                 animation: "rotate 8s linear infinite",
  //                 flexDirection: "column",
  //               }}
  //             >
  //               <h2 className={`text-3xl text-center font-bold ${atleastAddfile ? "bg-gradient-to-r from-red-700 to-red-800" : "bg-gradient-to-l from-green-400 via-green-500 to-emerald-300"} bg-clip-text text-transparent pb-4`}>
  //                 {atleastAddfile ? "Add a File First!" : "Add your files here"}
  //               </h2>

  //               <div
  //                 {...getRootProps()}
  //                 className="relative flex justify-center items-center p-8 w-full max-w-md rounded-xl overflow-hidden cursor-pointer"
  //                 style={{
  //                   background: `
  //             linear-gradient(to bottom right, rgb(13, 148, 136), rgb(0, 0, 100)) padding-box,
  //             repeating-linear-gradient(
  //               var(--angle),
  //               rgb(249, 115, 22),
  //               rgb(249, 115, 22) 10px,
  //               transparent 10px,
  //               transparent 20px,
  //               rgb(13, 148, 136) 20px,
  //               rgb(13, 148, 136) 30px,
  //               transparent 30px,
  //               transparent 40px
  //             ) border-box
  //           `,
  //                   border: "3px dashed transparent",
  //                   animation: DrogBoxAnimation,
  //                   boxShadow: "inset 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 -4px 12px rgba(0, 0, 0, 0.5)",
  //                 }}
  //               >
  //                 <input {...getInputProps()} />
  //                 <div className="text-center space-y-4">
  //                   <p className={`text-gray-300 transition-colors ${isDragActive ? "text-white" : "text-white hover:scale-[120%] transition-all duration-500 ease-in-out"}`}>
  //                     {isDragActive ? "✨ Drop to upload!" : "Click or drag files here"}
  //                   </p>
  //                   {errorMessage && (
  //                     <p className="text-red-500 mt-2 font-bold">{errorMessage}</p>
  //                   )}
  //                 </div>
  //               </div>

  //               <div className="w-full p-6 pt-4">
  //                 <div className="space-y-1">
  //                   <label
  //                     htmlFor="url-input"
  //                     className="block text-center text-2xl font-medium bg-gradient-to-l from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent mb-2 transition-colors duration-200"
  //                   >
  //                     Enter your Custom URL
  //                     <span className="text-blue-500 ml-1">*</span>
  //                   </label>
  //                   <div className="relative group">
  //                     <input
  //                       id="url-input"
  //                       type="url"
  //                       onKeyDown={handleKeyDown}
  //                       value={customEmail}
  //                       onChange={(e) => {
  //                         setCustomEmail(e.target.value.replace(/[^\w\s-]/g, '-').replace(/\s+/g, '-').replace(/-{2,}/g, '-').replace(/^-{2,}|-{2,}$/g, ''));
  //                         if (e.target.value) {
  //                           setUploadBtnDisabled(false);
  //                         }
  //                         else {
  //                           setUploadBtnDisabled(true);
  //                         }
  //                         setChangeURLbg(false);
  //                       }
  //                       }
  //                       placeholder={process.env.NEXT_PUBLIC_FOR_PLACEHOLDER}
  //                       className={`w-full  px-5 py-3  bg-gray-50 rounded-lg border-2  
  //                           ${changeURLbg ? "focus:text-red-600 focus:border-red-600 focus:bg-white hover:border-red-800 border-red-600"
  //                           :
  //                           "focus:border-blue-500 focus:ring-2 focus:ring-green-200 focus:bg-white hover:border-blue-800"} transition-all duration-500 peer placeholder-gray-400 text-gray-700 border-gray-200`}
  //                       pattern="https://.*"
  //                       required
  //                     />
  //                     <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-100 pointer-events-none transition-all duration-300" />
  //                   </div>
  //                 </div>
  //                 {/* //!adding spinner with button */}
  //                 {changeURLbg && <p className="text-sm font-bold text-red-400 mt-2">
  //                   Oops! That URL is taken. Try another unique one!</p>}
                   
  //                  {!changeURLbg && <SetPasswordPopup userPasswordPopup={userPasswordPopup} setPasswordParent={setPasswordParent} setuserPasswordPopup={setuserPasswordPopup}/>}
                   
  //                 {SpinnerLoading ? (
  //                   <>
  //                     <ClipLoader loading={true} size={80} margin={15} speedMultiplier={1} color="#FFA500" cssOverride={SpinnerOverride} />
  //                   </>
  //                 ) : (


  //                   <button
  //                     className={`mt-3  w-full px-6 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-lg shadow-md ${uploadBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02] active:scale-95  hover:cursor-pointer hover:from-purple-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'} transition-all duration-200 flex items-center justify-center gap-2 `}
  //                     onClick={handleUploadBtn}
  //                     disabled={uploadBtnDisabled}
  //                   >
  //                     <svg
  //                       className="w-5 h-5 text-white animate-pulse-once"
  //                       fill="none"
  //                       stroke="currentColor"
  //                       viewBox="0 0 24 24"
  //                     >
  //                       <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M13 10V3L4 14h7v7l9-11h-7z"
  //                       />
  //                     </svg>
  //                     Upload Files
  //                   </button>
  //                 )}

  //               </div>
  //             </div>
  //           </div>

  //           {/* //!Back Side */}
  //           <div className="flip-card-back">
  //             <div
  //               className="mainCard relative flex flex-col p-6 w-[90%] sm:w-[65%] max-w-[800px] min-h-fit rounded-xl overflow-hidden items-center hover:scale-[102%] hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-500 ease-in-out"
  //               style={{
  //                 background: `
  //                 linear-gradient(to bottom right, #000000, #1e3a8a) padding-box,
  //                 linear-gradient(var(--angle), #14b8a6, #0f766e, #14b8a6) border-box
  //               `,
  //                 border: "4px solid transparent",
  //                 animation: "rotate 8s linear infinite",
  //               }}
  //             >
  //               <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-gray-500 bg-clip-text text-transparent pb-8 text-center">
  //                 Your files are ready to share!
  //               </h2>
  //               <h2 className="text-2xl font-bold text-amber-50">Copy the link to share your files</h2>
  //               <div className="flex items-center space-x-2 w-full my-3">
  //                 {/* Input Field */}
  //                 <input
  //                   type="text"
  //                   value={link}
  //                   readOnly
  //                   className="w-full p-2 font-semibold  rounded-lg border-2 border-gray-600 focus:border-blue-400 focus:bg-opacity-20 hover:border-blue-300 transition-all duration-500 text-purple-300"
  //                 />

  //                 {/* Copy Button */}
  //                 <button
  //                   onClick={handleCopy}
  //                   className={`p-2 flex items-center space-x-2 text-white hover:cursor-pointer rounded-lg transition-all duration-300 ${!changeBGCopy
  //                     ? "bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-yellow-500 hover:to-amber-400"
  //                     : "bg-cyan-500"
  //                     }`}
  //                 >
  //                   {copied ? <Check className="w-6 h-6 text-black" /> : <Copy className="w-6 h-6" />}
  //                 </button>
  //               </div>
  //               <QRCodePopup message={link} />
  //               <p className="text-sm text-red-400 mt-2">
  //                 ⚠️ Link will expire after <span className="font-bold">10 days!</span>
  //               </p>
  //             </div> 
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const mainContent = () => {
  return (
    <div className="mainstuff flex justify-center items-center w-full md:w-[55%] order-2 md:order-2 px-4">
      {/* Card Container with fixed dimensions */}
      <div className={`flip-card ${isFlipped ? "flipped" : ""} w-full max-w-[700px]`}>
        <div className="flip-card-inner">
          {/* Front Side */}
          <div className="flip-card-front">
            <div
              className="mainCard flex flex-col p-6 w-full rounded-xl overflow-hidden items-center hover:scale-[102%] hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-500 ease-in-out"
              style={{
                background: `
                  linear-gradient(to bottom left, #1e3a8a, #000000) padding-box,
                  linear-gradient(var(--angle), #0f766e, #14b8a6, #0f766e) border-box
                `,
                border: "4px solid transparent",
                animation: "rotate 8s linear infinite",
                minHeight: "450px", // Fixed minimum height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // Distribute content evenly
              }}
            >
              {/* Title Section */}
              <div className="flex-shrink-0">
                <h2 className={`text-3xl text-center font-bold ${atleastAddfile ? "bg-gradient-to-r from-red-700 to-red-800" : "bg-gradient-to-l from-green-400 via-green-500 to-emerald-300"} bg-clip-text text-transparent pb-4`}>
                  {atleastAddfile ? "Add a File First!" : "Add your files here"}
                </h2>
              </div>

              {/* Drop Zone Section */}
              <div className="flex-grow flex items-center justify-center">
                <div
                  {...getRootProps()}
                  className="relative flex justify-center items-center p-8 w-full max-w-md rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: `
                      linear-gradient(to bottom right, rgb(13, 148, 136), rgb(0, 0, 100)) padding-box,
                      repeating-linear-gradient(
                        var(--angle),
                        rgb(249, 115, 22),
                        rgb(249, 115, 22) 10px,
                        transparent 10px,
                        transparent 20px,
                        rgb(13, 148, 136) 20px,
                        rgb(13, 148, 136) 30px,
                        transparent 30px,
                        transparent 40px
                      ) border-box
                    `,
                    border: "3px dashed transparent",
                    animation: DrogBoxAnimation,
                    boxShadow: "inset 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 -4px 12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <input {...getInputProps()} />
                  <div className="text-center space-y-4">
                    <p className={`text-gray-300 transition-colors ${isDragActive ? "text-white" : "text-white hover:scale-[120%] transition-all duration-500 ease-in-out"}`}>
                      {isDragActive ? "✨ Drop to upload!" : "Click or drag files here"}
                    </p>
                    {errorMessage && (
                      <p className="text-red-500 mt-2 font-bold">{errorMessage}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Input and Button Section */}
              <div className="w-full flex-shrink-0">
                <div className="space-y-1">
                  <label
                    htmlFor="url-input"
                    className="block text-center text-2xl font-medium bg-gradient-to-l from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent mb-2 transition-colors duration-200"
                  >
                    Enter your Custom URL
                    <span className="text-blue-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
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
                      className={`w-full px-5 py-3 bg-gray-50 rounded-lg border-2 
                        ${changeURLbg ? "focus:text-red-600 focus:border-red-600 focus:bg-white hover:border-red-800 border-red-600"
                        : "focus:border-blue-500 focus:ring-2 focus:ring-green-200 focus:bg-white hover:border-blue-800"} 
                        transition-all duration-500 peer placeholder-gray-400 text-gray-700 border-gray-200`}
                      pattern="https://.*"
                      required
                    />
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-100 pointer-events-none transition-all duration-300" />
                  </div>
                </div>
                
                {changeURLbg && (
                  <p className="text-sm font-bold text-red-400 mt-2">
                    Oops! That URL is taken. Try another unique one!
                  </p>
                )}
                
                {!changeURLbg && (
                  <SetPasswordPopup userPasswordPopup={userPasswordPopup} setPasswordParent={setPasswordParent} setuserPasswordPopup={setuserPasswordPopup}/>
                )}
                
                {SpinnerLoading ? (
                  <div className="flex justify-center mt-3">
                    <ClipLoader loading={true} size={80} margin={15} speedMultiplier={1} color="#FFA500" cssOverride={SpinnerOverride} />
                  </div>
                ) : (
                  <button
                    className={`mt-3 w-full px-6 py-3 bg-gradient-to-r from-blue-800 to-cyan-600 text-white font-semibold rounded-lg shadow-md ${uploadBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02] active:scale-95 hover:cursor-pointer hover:from-purple-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'} transition-all duration-200 flex items-center justify-center gap-2`}
                    onClick={handleUploadBtn}
                    disabled={uploadBtnDisabled}
                  >
                    <svg
                      className="w-5 h-5 text-white animate-pulse-once"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Upload Files
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="flip-card-back">
            <div
              className="mainCard relative flex flex-col p-6 w-full rounded-xl overflow-hidden items-center hover:scale-[102%] hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-500 ease-in-out"
              style={{
                background: `
                  linear-gradient(to bottom right, #000000, #1e3a8a) padding-box,
                  linear-gradient(var(--angle), #14b8a6, #0f766e, #14b8a6) border-box
                `,
                border: "4px solid transparent",
                animation: "rotate 8s linear infinite",
                minHeight: "450px", // Same fixed height as front
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // Center content vertically
                gap: "1.5rem", // Consistent spacing
              }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-gray-500 bg-clip-text text-transparent text-center">
                Your files are ready to share!
              </h2>
              
              <h3 className="text-2xl font-bold text-amber-50 text-center">
                Copy the link to share your files
              </h3>
              
              <div className="flex items-center space-x-2 w-full">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="w-full p-2 font-semibold rounded-lg border-2 border-gray-600 focus:border-blue-400 focus:bg-opacity-20 hover:border-blue-300 transition-all duration-500 text-purple-300"
                />
                <button
                  onClick={handleCopy}
                  className={`p-2 flex items-center space-x-2 text-white hover:cursor-pointer rounded-lg transition-all duration-300 ${!changeBGCopy
                    ? "bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-yellow-500 hover:to-amber-400"
                    : "bg-cyan-500"
                  }`}
                >
                  {copied ? <Check className="w-6 h-6 text-black" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
              
              <QRCodePopup message={link} />
              
              <p className="text-sm text-red-400 text-center">
                ⚠️ Link will expire after <span className="font-bold">10 days!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


  const showingBenefit = () => {
    return (
      <div className=" showBenefi flex justify-center items-center md:items-center w-full md:w-[55%] md:justify-center order-1 md:order-1">
        {showBenefit()}

      </div>
    )
  }

  const showFilesORPercentage = () => {
    return (
      <div className="  showFilesclass flex justify-center items-center w-full md:w-[50%] md:justify-center order-1 md:order-1">
        {uploading ? shPercentage() : showfiles()}

      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-bl from-blue-900 to-black">
      <div
        className="main flex-grow flex flex-col md:flex-row"
      >

        {selectedFiles.length > 0 ? showFilesORPercentage() : showingBenefit()}

        {mainContent()}
      </div>
    </div>
  );
};
