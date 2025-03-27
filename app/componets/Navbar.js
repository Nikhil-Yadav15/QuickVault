import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav
      className="w-full py-4 px-6 flex justify-between items-center "
      style={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(1, 0, 0, 0.1)'}}
    >
      <div className="text-2xl text-amber-50 flex items-center">
        <NextLink href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <Image
              src="/logo.png"
              alt="ShareVault Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span>QuickVault</span>
          </div>
        </NextLink>
      </div>
    </nav>
  );
};

export default Navbar;



// <nav
//       style={{
//         background: 'rgba(1, 0, 0, 0.1)',
//         height: '10vh',
//         width: '100%',
//         position: 'fixed',
//         top: '0',
//         display: 'flex',
//         justifyContent: 'space-between',
//         padding: '1rem',
//         alignItems: 'center',
//         zIndex: '1',
//         backdropFilter: 'blur(10px)',
//       }}
//     >
//       <div className="Logo text-2xl text-amber-50 flex items-center">
//         <NextLink href="/" passHref>
//             <div className='flex items-center'>

//             <Image
//               src="/logo.png"
//               alt="ShareVault Logo"
//               width={40}
//               height={40}
//               className="mr-2"
//               />
//             <span>ShareVault</span>
//               </div>
//         </NextLink>
//       </div>
//     </nav>
