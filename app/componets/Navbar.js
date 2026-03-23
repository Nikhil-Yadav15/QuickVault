import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import ShinyText from '@/components/ui/shiny-text';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center glass border-b border-white/[0.06]">
      <div className="text-xl font-semibold text-white/90 flex items-center">
        <NextLink href="/" passHref>
          <div className="flex items-center cursor-pointer gap-2.5 group">
            <Image
              src="/logo.png"
              alt="QuickVault Logo"
              width={36}
              height={36}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <ShinyText className="font-bold tracking-tight text-xl" speed={4}>
              QuickVault
            </ShinyText>
          </div>
        </NextLink>
      </div>
    </nav>
  );
};

export default Navbar;
