"use client";
import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { BeatLoader } from "react-spinners";
import getFileIcon from "../../componets/getFileIcon";
import formatBytes from "../../componets/formatBytes";
import pako from "pako";
import JSZip from "jszip";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BackgroundBeams from "@/components/ui/background-beams";


export default function DownloadFile({ params }) {
    const [customUrl, setCustomUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [alld, setalld] = useState(false);
    const [found, setFound] = useState(false);
    const [files, setFiles] = useState([]);
    const router = useRouter();
    const [loadingStates, setLoadingStates] = useState({});
    
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [userEntered, setUserEntered] = useState("");
    const [error_forWrongPassword, seterror_forWrongPassword] = useState(false);

    
    useEffect(() => {
        async function fetchParams() {
            const dt = await params;
            setCustomUrl(dt?.customUrl || "Unknown");
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (customUrl && customUrl !== "Unknown") {
            handleGetFiles();
        }
    }, [customUrl]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleVerify();
        }
      };

    const handleVerify = () => {
        if (password == userEntered){
            setFound(true);
            setConfirmPassword(false);
        } else {
            seterror_forWrongPassword(true);
        }
    }

    const handlePasswordPresent = () => {
        return (
            <div className="flex justify-center items-center">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 shadow-2xl">
                    <h2 className="text-white/90 text-2xl font-bold mb-6 text-center">Enter Password</h2>
                    <input
                        type="password"
                        value={userEntered}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setUserEntered(e.target.value);
                            seterror_forWrongPassword(false);
                        }}
                        placeholder="Enter the password"
                        className={`w-full p-3 rounded-xl ${error_forWrongPassword ? "bg-red-500/10 border-red-500/50" : "bg-white/5 border-white/10"} backdrop-blur-sm text-white placeholder:text-white/40 mb-4 border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors`}
                    />
                    {error_forWrongPassword && <p className="text-sm text-center font-bold text-red-400 mt-1 mb-2">
                        Wrong Password!</p>}

                    <Button onClick={handleVerify} className="w-full py-3 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition duration-200">
                        Verify
                    </Button>
                </div>
            </div>
        );
    };

    

    const reassembleFileFromChunks = async (chunkUrls) => {
        const chunkBuffers = [];
        for (const url of chunkUrls) {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            chunkBuffers.push(new Uint8Array(buffer));
        }
        const totalSize = chunkBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
        const combinedBuffer = new Uint8Array(totalSize);
        let offset = 0;
        for (const buffer of chunkBuffers) {
            combinedBuffer.set(buffer, offset);
            offset += buffer.length;
        }
        const inflatedBuffer = pako.inflate(combinedBuffer);
        const blob = new Blob([inflatedBuffer], { type: "application/octet-stream" });
        return blob;
    };

    const handleDownload = async (fileName, chunkUrls, index) => {
        setLoadingStates((prev) => ({ ...prev, [index]: true }));
        try {
            const fileBlob = await reassembleFileFromChunks(chunkUrls);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(fileBlob);
            link.download = fileName || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            setLoadingStates((prev) => ({ ...prev, [index]: false }));
        } catch (error) {
            setLoadingStates((prev) => ({ ...prev, [index]: false }));
        }
    };

    const handleDownloadAll = async (files, zipFileName = "download.zip") => {
        if (!alld){
        try {
            const zip = new JSZip();
            for (const file of files) {
                const fileName = file.filename;
                const chunkUrls = file.urls;
                const fileBlob = await reassembleFileFromChunks(chunkUrls);
                zip.file(fileName, fileBlob);
            }
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = zipFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            setalld((prev) => false);
        } catch (error) {
            setalld((prev) => false);
        }
    }
    };

    const handleFound = (files) => {

        return (
            <div
                className="glass-card glass-card-hover relative flex flex-col p-6 max-w-[600px] max-[600px]:w-[90%] w-[60%] rounded-2xl transition-all duration-500 ease-in-out pl-4 pr-4 pt-8 pb-10 custom-scroll mt-4"
            >
                <div className="sticky top-0 z-10 pb-2 text-2xl font-bold text-white/90 flex flex-row justify-between items-center border-b border-white/10 mb-4 w-full">
                    <h1>Your Files:</h1>
                    <Button onClick={() => { handleDownloadAll(files); setalld((prev) => true); }} className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-5 rounded-xl shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2 max-[670px]:px-4 max-[670px]:py-1 max-[670px]:text-sm max-[670px]:mt-4">
                        Download All
                        {alld ? <BeatLoader loading={true} color="rgba(255,255,255, 0.8)" size={8}/> : <Download /> }
                    </Button>

                </div>

                {/* Files List */}
                <div className="w-full">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-xl mb-2 w-full p-3 flex justify-between items-center transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20"
                        >
                            
                            <div className="flex items-center min-w-0 flex-grow">
                                {getFileIcon(file.filename)}
                                <div className="pl-2 pr-2 flex items-start min-w-0">
                                    <div className="truncate text-white/90 pr-2">{file.filename} -</div>
                                    <div className="text-emerald-400 flex-shrink-0">{formatBytes(file.file_size)}</div>
                                </div>
                            </div>

                            {loadingStates[index] ? (
                                <BeatLoader loading={true} color="rgba(16,185,129, 1)" size={8} />
                            ) : <Download disabled={loadingStates[index]}
                                className="w-6 h-6 text-emerald-400 cursor-pointer hover:text-emerald-300 hover:scale-110 transition-all duration-200 ease-out flex-shrink-0"
                                onClick={() => {
                                    handleDownload(file.filename, file.urls, index);
                                }}
                            />}
                        </div>
                    ))}
                </div>
            </div>

        )
    }

    const handleNotFound = () => {

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                                Link Not Found!
                            </h2>
                            <p className="text-white/60 max-w-md">
                                This link has either expired or is incorrect. Please check the URL and try again.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/')}
                            className="cursor-pointer mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Return Home</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // Fetch files
    const handleGetFiles = async () => {
        try {
            const dt = { "CustomUrl": customUrl };
            const res = await fetch("/api/retrieve_files", {
                method: "POST",
                body: JSON.stringify(dt),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            
            if (data.success) {
                
                setFiles(data.files);
                if (!data.password) {
                    setFound(true);
                    setLoading(false); 
                } else {
                    setPassword(data.password);
                    setLoading(false);
                    setConfirmPassword(true);

                }
            
            } else {
                setLoading(false);
                setFound(false);

            }
        } catch (error) {
            
            setLoading(false);
            setFound(false);
        }
    };

    const override = {
        display: "block",
        margin: "20px auto",
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            <BackgroundBeams className="fixed inset-0 z-0 pointer-events-none opacity-40" />
            <div className="relative z-10 flex-grow w-full flex items-center justify-center py-16">
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <ClipLoader loading={true} size={105} margin={15} speedMultiplier={1} color="#10b981" cssOverride={override} />
                        <h1 className="text-3xl font-bold text-white/90">Getting Your Files</h1>
                    </div>
                ) : confirmPassword ? (
                    handlePasswordPresent()
                ) : found ? (
                    handleFound(files)
                ) : (
                    handleNotFound()
                )}
            </div>
        </div>
    );
}
