import { ModeToggle } from "./modeToggle";
export default function Navbar() {
  return (
    <nav className="z-10 sticky top-0 w-full flex items-center justify-between px-8 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
      {/* Logo or Branding (optional) */}
      <div className="flex-shrink-0">
        {/* Replace with your logo or branding */}
        <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Brand
        </a>
      </div>

      {/* Mode Toggle Button */}
      <div className="flex items-center">
        <ModeToggle />
      </div>
    </nav>
  );
}
