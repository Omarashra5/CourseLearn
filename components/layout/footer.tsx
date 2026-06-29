import Link from 'next/link';
import { Sparkles, Github, Linkedin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { href: '/courses', label: 'All Courses' },
    { href: '/categories', label: 'Categories' },
    { href: '/search', label: 'Search' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  Account: [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/settings', label: 'Settings' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-border/60 glass">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-display text-xl font-bold">Courses</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A premium programming courses platform. Learn to code, beautifully.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://github.com/Omarashra5" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/omarashraf22/" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-3 text-sm">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Courses.
          </p>
          <p className="text-xs text-muted-foreground">
            Created by Omar Ashraf
          </p>
        </div>
      </div>
    </footer>
  );
}
