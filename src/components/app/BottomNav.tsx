import Link from "next/link";
import { Plus } from "lucide-react";
import { mobileNav } from "@/lib/nav";
import { NavLink } from "./NavLink";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end border-t border-divider bg-surface px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
      {mobileNav.map((item) =>
        item.href === "/lancar" ? (
          <div key={item.href} className="flex flex-1 justify-center">
            <Link
              href="/lancar"
              aria-label="Lançar movimentação"
              className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-700 text-white shadow-lg"
            >
              <Plus size={26} strokeWidth={2.75} />
            </Link>
          </div>
        ) : (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={<item.icon size={22} strokeWidth={2.75} />}
            variant="bottom"
          />
        ),
      )}
    </nav>
  );
}
