import { FaFilePdf, FaFileVideo, FaFileAudio, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileArchive, FaFileAlt } from "react-icons/fa";

const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const iconClasses = "w-6 h-6";
  
    if (["pdf"].includes(ext)) return <FaFilePdf className={`${iconClasses} text-red-500`} />;
    if (["mp4", "mkv", "avi", "mov"].includes(ext)) return <FaFileVideo className={`${iconClasses} text-blue-500`} />;
    if (["mp3", "wav", "aac", "flac"].includes(ext)) return <FaFileAudio className={`${iconClasses} text-green-500`} />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord className={`flex-shrink-0 ${iconClasses} text-blue-700`} />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FaFileExcel className={`flex-shrink-0 ${iconClasses} text-green-800`} />;
    if (["ppt", "pptx"].includes(ext)) return <FaFilePowerpoint className={`flex-shrink-0 ${iconClasses} text-orange-700`} />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return <FaFileImage className={`flex-shrink-0 ${iconClasses} text-purple-500`} />;
    if (["zip", "rar", "7z"].includes(ext)) return <FaFileArchive className={`flex-shrink-0 ${iconClasses} text-yellow-900`} />;
  
    return <FaFileAlt className={`${iconClasses} text-gray-500`} />;
  };
  
  export default getFileIcon;
  