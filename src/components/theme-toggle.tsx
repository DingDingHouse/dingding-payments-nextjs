'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div
            className="flex items-center cursor-pointer"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 mr-2" />
            ) : (
                <Moon className="h-4 w-4 mr-2" />
            )}
            <span>{theme === 'dark' ? 'Light' : 'Dark'} theme</span>
        </div>
    )
}